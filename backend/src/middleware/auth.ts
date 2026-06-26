import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AuthRequest, AuthUser } from '../types'

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Токен авторизации не предоставлен' })
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as AuthUser
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ success: false, error: 'Недействительный токен' })
  }
}

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Не авторизован' })
    return
  }

  if (req.user.role !== 'ADMIN') {
    res.status(403).json({ success: false, error: 'Доступ запрещён. Требуются права администратора' })
    return
  }

  next()
}
