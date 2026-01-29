// backend/src/routes/courseRoutes.js
import express from 'express'
import prisma from '../lib/prisma.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

// 获取所有课程
router.get('/', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { order: 'asc' },
    })
    res.json(courses)
  } catch (error) {
    console.error('Get courses error:', error)
    res.status(500).json({ error: 'Failed to get courses' })
  }
})

// 获取单个课程详情
router.get('/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }

    res.json(course)
  } catch (error) {
    console.error('Get course error:', error)
    res.status(500).json({ error: 'Failed to get course' })
  }
})

// 获取特定课程的用户进度（需要认证）
router.get('/:courseId/progress', authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params
    const { userId } = req.user

    const progress = await prisma.userProgress.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    })

    // 如果没有进度记录，返回默认值
    if (!progress) {
      return res.json({
        status: 'not_started',
        courseId,
        userId,
      })
    }

    res.json(progress)
  } catch (error) {
    console.error('Get course progress error:', error)
    res.status(500).json({ error: 'Failed to get course progress' })
  }
})

// 标记课程完成（需要认证）
router.post('/:courseId/complete', authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params
    const { userId } = req.user

    // 更新或创建进度记录
    const progress = await prisma.userProgress.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      update: {
        status: 'completed',
        completedAt: new Date(),
      },
      create: {
        userId,
        courseId,
        status: 'completed',
        completedAt: new Date(),
      },
    })

    res.json({
      success: true,
      progress,
    })
  } catch (error) {
    console.error('Complete course error:', error)
    res.status(500).json({ error: 'Failed to complete course' })
  }
})

// 获取用户的课程进度（需要认证）
router.get('/user/:userId/progress', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params

    // 只能查看自己的进度
    if (req.user.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    const progress = await prisma.userProgress.findMany({
      where: { userId },
      include: {
        course: true,
      },
    })

    res.json(progress)
  } catch (error) {
    console.error('Get progress error:', error)
    res.status(500).json({ error: 'Failed to get progress' })
  }
})

export default router
