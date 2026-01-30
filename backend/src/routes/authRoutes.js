// backend/src/routes/authRoutes.js
import express from 'express'
import { sendMagicLink, verifyMagicLink, getUserById } from '../services/authService.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

// 发送 Magic Link
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body

    // 简单的邮箱验证
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email' })
    }

    const result = await sendMagicLink(email)
    const response = {
      success: true,
      message: '📧 Magic Link 已发送到你的邮箱',
    }
    
    // 如果有token返回（SMTP未配置时的开发模式）
    if (result.token) {
      response.testToken = result.token
    }
    
    res.json(response)
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Failed to send magic link' })
  }
})

// 验证 Magic Link Token
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({ error: 'Missing token' })
    }

    const result = await verifyMagicLink(token)
    res.json(result)
  } catch (error) {
    console.error('Verify error:', error)
    res.status(401).json({ error: error.message || 'Token verification failed' })
  }
})

// 获取当前用户信息（需要认证）
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await getUserById(req.user.userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Failed to get user' })
  }
})

export default router
