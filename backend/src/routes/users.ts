import { Router, Response } from 'express'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { PrismaClient, UserRole } from '@prisma/client'
import { authMiddleware, adminMiddleware } from '../middleware/auth'
import { AuthRequest } from '../types'

const router = Router()
const prisma = new PrismaClient()

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6).optional(),
  role: z.nativeEnum(UserRole).optional(),
})

router.get('/', authMiddleware, adminMiddleware, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ success: true, data: users })
  } catch {
    res.status(500).json({ success: false, error: 'Ошибка сервера' })
  }
})

router.post('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const body = userSchema.parse(req.body)

    const existing = await prisma.user.findUnique({ where: { email: body.email } })
    if (existing) {
      res.status(400).json({ success: false, error: 'Пользователь уже существует' })
      return
    }

    const hashedPassword = await bcrypt.hash(body.password || 'changeme123', 12)
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: body.role,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })

    res.status(201).json({ success: true, data: user })
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
    const body = userSchema.partial().parse(req.body)
    const updateData: Record<string, unknown> = { ...body }

    if (body.password) {
      updateData.password = await bcrypt.hash(body.password, 12)
    } else {
      delete updateData.password
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })

    res.json({ success: true, data: user })
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
    if (req.params.id === req.user!.id) {
      res.status(400).json({ success: false, error: 'Нельзя удалить себя' })
      return
    }
    await prisma.user.delete({ where: { id: req.params.id } })
    res.json({ success: true, message: 'Пользователь удалён' })
  } catch {
    res.status(500).json({ success: false, error: 'Ошибка сервера' })
  }
})

export default router
