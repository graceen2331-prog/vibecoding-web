// backend/src/routes/projectRoutes.js
import express from 'express'
import crypto from 'crypto'
import prisma from '../lib/prisma.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

// 创建分享链接
router.post('/share', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user
    const { courseId, code, title } = req.body

    // 生成唯一的分享 token
    const shareToken = crypto.randomBytes(16).toString('hex')

    const project = await prisma.sharedProject.create({
      data: {
        userId,
        courseId,
        code,
        title: title || `我的作品`,
        shareToken,
      },
    })

    const shareUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/share/${shareToken}`

    res.json({
      id: project.id,
      shareToken,
      shareUrl,
    })
  } catch (error) {
    console.error('Create share error:', error)
    res.status(500).json({ error: 'Failed to create share' })
  }
})

// 获取分享的项目
router.get('/share/:shareToken', async (req, res) => {
  try {
    const { shareToken } = req.params

    const project = await prisma.sharedProject.findUnique({
      where: { shareToken },
      include: {
        user: {
          select: { id: true, username: true, email: true },
        },
        course: {
          select: { id: true, title: true },
        },
      },
    })

    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }

    res.json(project)
  } catch (error) {
    console.error('Get share error:', error)
    res.status(500).json({ error: 'Failed to get share' })
  }
})

// 获取用户的所有分享项目
router.get('/user/projects', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user

    const projects = await prisma.sharedProject.findMany({
      where: { userId },
      include: {
        course: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json(projects)
  } catch (error) {
    console.error('Get user projects error:', error)
    res.status(500).json({ error: 'Failed to get user projects' })
  }
})

export default router
