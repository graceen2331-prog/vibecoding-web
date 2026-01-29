import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import courseRoutes from './routes/courseRoutes.js'
import achievementRoutes from './routes/achievementRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import prisma from './lib/prisma.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}))
app.use(express.json())

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Vibe Coding Backend is running' })
})

// API 路由
app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/achievements', achievementRoutes)
app.use('/api/projects', projectRoutes)

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal Server Error' })
})

// 启动服务器
const startServer = async () => {
  try {
    // 测试数据库连接
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ 数据库连接成功')
    
    app.listen(PORT, () => {
      console.log(`✅ Vibe Coding Backend running on port ${PORT}`)
      console.log(`   API: http://localhost:${PORT}/api/health`)
      console.log(`   Auth: http://localhost:${PORT}/api/auth/login`)
      console.log(`   Courses: http://localhost:${PORT}/api/courses`)
    })
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message)
    console.log('📝 请确保 DATABASE_URL 环境变量已正确配置')
    process.exit(1)
  }
}

startServer()

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('\n关闭服务器...')
  await prisma.$disconnect()
  process.exit(0)
})
