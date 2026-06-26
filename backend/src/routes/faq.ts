import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { authMiddleware, adminMiddleware } from '../middleware/auth'
import { AuthRequest } from '../types'

const router = Router()
const prisma = new PrismaClient()

const faqSchema = z.object({
  question: z.string().min(5),
  answer: z.string().min(10),
  order: z.number().optional(),
  published: z.boolean().optional(),
})

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const faqs = await prisma.fAQ.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    })
    res.json({ success: true, data: faqs })
  } catch {
    res.status(500).json({ success: false, error: 'Ошибка сервера' })
  }
})

router.get('/admin', authMiddleware, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const faqs = await prisma.fAQ.findMany({ orderBy: { order: 'asc' } })
    res.json({ success: true, data: faqs })
  } catch {
    res.status(500).json({ success: false, error: 'Ошибка сервера' })
  }
})

router.post('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const body = faqSchema.parse(req.body)
    const faq = await prisma.fAQ.create({ data: body })
    res.status(201).json({ success: true, data: faq })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: error.errors[0].message })
      return
    }
    res.status(500).json({ success: false, error: 'Ошибка сервера' })
  }
})

router.put('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const body = faqSchema.partial().parse(req.body)
    const faq = await prisma.fAQ.update({ where: { id: req.params.id }, data: body })
    res.json({ success: true, data: faq })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: error.errors[0].message })
      return
    }
    res.status(500).json({ success: false, error: 'Ошибка сервера' })
  }
})

router.delete('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.fAQ.delete({ where: { id: req.params.id } })
    res.json({ success: true, message: 'FAQ удалён' })
  } catch {
    res.status(500).json({ success: false, error: 'Ошибка сервера' })
  }
})

export default router
