import app from './app'

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`🚀 easyCRM API running on port ${PORT}`)
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🔗 Health: http://localhost:${PORT}/api/health`)
})
