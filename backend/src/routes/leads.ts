import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { PrismaClient, LeadStatus } from '@prisma/client'
import { authMiddleware, adminMiddleware } from '../middleware/auth'
import { AuthRequest } from '../types'

const router = Router()
const prisma = new PrismaClient()

const leadSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  phone: z.string().min(10, 'Введите корректный номер телефона'),
  email: z.string().email('Некорректный email').optional().or(z.literal('')),
  company: z.string().optional(),
  message: z.string().optional(),
})

// Public: Create lead
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const body = leadSchema.parse(req.body)

    const lead = await prisma.lead.create({
      data: {
        name: body.name,
        phone: body.phone,
        email: body.email || undefined,
        company: body.company || undefined,
        message: body.message || undefined,
      },
    })

    res.status(201).json({
      success: true,
      data: lead,
      message: 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: error.errors[0].message })
      return
    }
    res.status(500).json({ success: false, error: 'Ошибка сервера' })
  }
})

// Admin: Get all leads
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const search = req.query.search as string
    const status = req.query.status as LeadStatus

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { company: { contains: search, mode: 'insensitive' as const } },
          { phone: { contains: search } },
        ],
      }),
      ...(status && { status }),
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.lead.count({ where }),
    ])

    res.json({
      success: true,
      data: leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch {
    res.status(500).json({ success: false, error: 'Ошибка сервера' })
  }
})

// Admin: Update lead status
router.patch('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { status } = req.body

    const lead = await prisma.lead.update({
      where: { id },
      data: { status },
    })

    res.json({ success: true, data: lead })
  } catch {
    res.status(500).json({ success: false, error: 'Ошибка сервера' })
  }
})

// Admin: Delete lead
router.delete('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    await prisma.lead.delete({ where: { id } })

    res.json({ success: true, message: 'Заявка удалена' })
  } catch {
    res.status(500).json({ success: false, error: 'Ошибка сервера' })
  }
})

export default router
