import { Router, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth'
import { AuthRequest } from '../types'

const router = Router()
const prisma = new PrismaClient()

router.get('/', authMiddleware, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [totalLeads, newLeads, totalProjects, totalUsers, recentLeads, leadsByStatus, leadsByMonth] =
      await Promise.all([
        prisma.lead.count(),
        prisma.lead.count({ where: { status: 'NEW' } }),
        prisma.project.count({ where: { published: true } }),
        prisma.user.count(),
        prisma.lead.findMany({
          orderBy: { createdAt: 'desc' },
          take: 5,
        }),
        prisma.lead.groupBy({
          by: ['status'],
          _count: { status: true },
        }),
        prisma.$queryRaw<{ month: string; count: bigint }[]>`
          SELECT TO_CHAR(DATE_TRUNC('month', "createdAt"), 'YYYY-MM') as month,
                 COUNT(*) as count
          FROM leads
          WHERE "createdAt" >= NOW() - INTERVAL '6 months'
          GROUP BY DATE_TRUNC('month', "createdAt")
          ORDER BY DATE_TRUNC('month', "createdAt") ASC
        `,
      ])

    const leadsByMonthSerialized = leadsByMonth.map((r) => ({
      month: r.month,
      count: Number(r.count),
    }))

    res.json({
      success: true,
      data: {
        totalLeads,
        newLeads,
        totalProjects,
        totalUsers,
        recentLeads,
        leadsByStatus: leadsByStatus.map((s) => ({ status: s.status, count: s._count.status })),
        leadsByMonth: leadsByMonthSerialized,
      },
    })
  } catch {
    res.status(500).json({ success: false, error: 'Ошибка сервера' })
  }
})

export default router
