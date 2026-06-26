import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { authMiddleware, adminMiddleware } from '../middleware/auth'
import { AuthRequest } from '../types'

const router = Router()
const prisma = new PrismaClient()

const serviceSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  icon: z.string(),
  price: z.string().optional(),
  order: z.number().optional(),
  published: z.boolean().optional(),
})

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const services = await prisma.service.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    })
    res.json({ success: true, data: services })
  } catch {
    res.status(500).json({ success: false, error: 'Ошибка сервера' })
  }
})

router.get('/admin', authMiddleware, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const services = await prisma.service.findMany({ orderBy: { order: 'asc' } })
    res.json({ success: true, data: services })
  } catch {
    res.status(500).json({ success: false, error: 'Ошибка сервера' })
  }
})

router.post('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const body = serviceSchema.parse(req.body)
    const service = await prisma.service.create({ data: body })
    res.status(201).json({ success: true, data: service })
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
    const body = serviceSchema.partial().parse(req.body)
    const service = await prisma.service.update({ where: { id: req.params.id }, data: body })
    res.json({ success: true, data: service })
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
    await prisma.service.delete({ where: { id: req.params.id } })
    res.json({ success: true, message: 'Услуга удалена' })
  } catch {
    res.status(500).json({ success: false, error: 'Ошибка сервера' })
  }
})

export default router
