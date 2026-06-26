import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { authMiddleware, adminMiddleware } from '../middleware/auth'
import { AuthRequest } from '../types'

const router = Router()
const prisma = new PrismaClient()

const reviewSchema = z.object({
  author: z.string().min(2),
  company: z.string().min(2),
  rating: z.number().min(1).max(5),
  text: z.string().min(10),
  avatar: z.string().optional(),
  published: z.boolean().optional(),
})

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await prisma.review.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ success: true, data: reviews })
  } catch {
    res.status(500).json({ success: false, error: 'Ошибка сервера' })
  }
})

router.get('/admin', authMiddleware, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reviews = await prisma.review.findMany({ orderBy: { createdAt: 'desc' } })
    res.json({ success: true, data: reviews })
  } catch {
    res.status(500).json({ success: false, error: 'Ошибка сервера' })
  }
})

router.post('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const body = reviewSchema.parse(req.body)
    const review = await prisma.review.create({ data: body })
    res.status(201).json({ success: true, data: review })
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
    const body = reviewSchema.partial().parse(req.body)
    const review = await prisma.review.update({ where: { id: req.params.id }, data: body })
    res.json({ success: true, data: review })
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
    await prisma.review.delete({ where: { id: req.params.id } })
    res.json({ success: true, message: 'Отзыв удалён' })
  } catch {
    res.status(500).json({ success: false, error: 'Ошибка сервера' })
  }
})

export default router
