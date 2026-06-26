import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'

import authRoutes from './routes/auth'
import leadsRoutes from './routes/leads'
import projectsRoutes from './routes/projects'
import servicesRoutes from './routes/services'
import reviewsRoutes from './routes/reviews'
import faqRoutes from './routes/faq'
import usersRoutes from './routes/users'
import statsRoutes from './routes/stats'

const app = express()

// Security
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}))

// Rate limiting
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, error: 'Слишком много запросов, попробуйте позже' },
}))

app.use('/api/leads', rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Слишком много заявок с одного IP' },
  skip: (req) => req.method !== 'POST',
}))

// Middleware
app.use(compression())
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'easyCRM API is running', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/leads', leadsRoutes)
app.use('/api/projects', projectsRoutes)
app.use('/api/services', servicesRoutes)
app.use('/api/reviews', reviewsRoutes)
app.use('/api/faq', faqRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/stats', statsRoutes)

// 404
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Маршрут не найден' })
})

export default app
