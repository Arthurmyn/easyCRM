import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth'
import { AuthRequest } from '../types'

const router = Router()
const prisma = new PrismaClient()

const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
})

const registerSchema = z.object({
  name: z.string().min(2, 'Минимум 2 символа'),
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
})

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const body = loginSchema.parse(req.body)

    const user = await prisma.user.findUnique({ where: { email: body.email } })
    if (!user) {
      res.status(401).json({ success: false, error: 'Неверный email или пароль' })
      return
    }

    const isValid = await bcrypt.compare(body.password, user.password)
    if (!isValid) {
      res.status(401).json({ success: false, error: 'Неверный email или пароль' })
      return
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      data: {
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: error.errors[0].message })
      return
    }
    res.status(500).json({ success: false, error: 'Ошибка сервера' })
  }
})

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const body = registerSchema.parse(req.body)

    const existing = await prisma.user.findUnique({ where: { email: body.email } })
    if (existing) {
      res.status(400).json({ success: false, error: 'Пользователь с таким email уже существует' })
      return
    }

    const hashedPassword = await bcrypt.hash(body.password, 12)

    const user = await prisma.user.create({
      data: { name: body.name, email: body.email, password: hashedPassword },
      select: { id: true, name: true, email: true, role: true },
    })

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    )

    res.status(201).json({ success: true, data: { token, user } })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: error.errors[0].message })
      return
    }
    res.status(500).json({ success: false, error: 'Ошибка сервера' })
  }
})

router.get('/me', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })

    if (!user) {
      res.status(404).json({ success: false, error: 'Пользователь не найден' })
      return
    }

    res.json({ success: true, data: user })
  } catch {
    res.status(500).json({ success: false, error: 'Ошибка сервера' })
  }
})

export default router
