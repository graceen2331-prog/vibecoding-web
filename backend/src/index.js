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
  // 先启动HTTP服务器，确保Render健康检查通过
  const server = app.listen(PORT, () => {
    console.log(`✅ Vibe Coding Backend running on port ${PORT}`)
    console.log(`   API: http://localhost:${PORT}/api/health`)
  })

  // 然后异步测试数据库连接（不阻塞启动）
  try {
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ 数据库连接成功')
  } catch (error) {
    console.warn('⚠️ 数据库连接失败:', error.message)
    console.warn('⚠️ 部分功能可能不可用，但服务已启动')
    // 不退出，让服务继续运行
  }
}

startServer()

// 优雅关闭
// 注意：如果数据库连接失败，prisma.$disconnect() 可能会报错，可以简单包裹一下
process.on('SIGINT', async () => {
  console.log('\n关闭服务器...')
  try {
    await prisma.$disconnect()
  } catch (e) {
    // 忽略断开连接时的错误
  }
  process.exit(0)
})