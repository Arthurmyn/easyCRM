import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { authMiddleware, adminMiddleware } from '../middleware/auth'
import { AuthRequest } from '../types'

const router = Router()
const prisma = new PrismaClient()

const projectSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  image: z.string(),
  category: z.string(),
  link: z.string().optional(),
  stack: z.array(z.string()),
  result: z.string().optional(),
  order: z.number().optional(),
  published: z.boolean().optional(),
})

// Public: Get published projects
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const category = req.query.category as string

    const projects = await prisma.project.findMany({
      where: {
        published: true,
        ...(category && { category }),
      },
      orderBy: { order: 'asc' },
    })

    res.json({ success: true, data: projects })
  } catch {
    res.status(500).json({ success: false, error: 'Ошибка сервера' })
  }
})

// Admin: Get all projects
router.get('/admin', authMiddleware, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: 'asc' },
    })

    res.json({ success: true, data: projects })
  } catch {
    res.status(500).json({ success: false, error: 'Ошибка сервера' })
  }
})

// Admin: Create project
router.post('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const body = projectSchema.parse(req.body)
    const project = await prisma.project.create({ data: body })

    res.status(201).json({ success: true, data: project })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: error.errors[0].message })
      return
    }
    res.status(500).json({ success: false, error: 'Ошибка сервера' })
  }
})

// Admin: Update project
router.put('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const body = projectSchema.partial().parse(req.body)
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: body,
    })

    res.json({ success: true, data: project })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: error.errors[0].message })
      return
    }
    res.status(500).json({ success: false, error: 'Ошибка сервера' })
  }
})

// Admin: Delete project
router.delete('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } })
    res.json({ success: true, message: 'Проект удалён' })
  } catch {
    res.status(500).json({ success: false, error: 'Ошибка сервера' })
  }
})

export default router
