import { Request } from 'express'
import { UserRole } from '@prisma/client'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
}

export interface AuthRequest extends Request {
  user?: AuthUser
}

export interface PaginationQuery {
  page?: string
  limit?: string
  search?: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}
