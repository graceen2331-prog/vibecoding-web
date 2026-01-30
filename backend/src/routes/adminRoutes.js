// backend/src/routes/adminRoutes.js
import express from 'express'
import prisma from '../lib/prisma.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

// 简单的管理员验证中间件（生产环境应该更严格）
const adminMiddleware = (req, res, next) => {
  // 目前简单地允许所有认证用户访问管理功能
  // 生产环境应该检查用户角色
  next()
}

// ============ 课程管理 ============

// 创建课程
router.post('/courses', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, description, level, duration, order } = req.body

    if (!title || !order) {
      return res.status(400).json({ error: '课程名称和序号是必填项' })
    }

    const course = await prisma.course.create({
      data: {
        title,
        description: description || '',
        level: level || 'beginner',
        duration: duration || 15,
        order: parseInt(order),
      },
    })

    res.json(course)
  } catch (error) {
    console.error('Create course error:', error)
    if (error.code === 'P2002') {
      return res.status(400).json({ error: '课程序号已存在' })
    }
    res.status(500).json({ error: '创建课程失败' })
  }
})

// 更新课程
router.put('/courses/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, level, duration, order } = req.body

    const course = await prisma.course.update({
      where: { id },
      data: {
        title,
        description,
        level,
        duration: parseInt(duration),
        order: parseInt(order),
      },
    })

    res.json(course)
  } catch (error) {
    console.error('Update course error:', error)
    if (error.code === 'P2025') {
      return res.status(404).json({ error: '课程不存在' })
    }
    res.status(500).json({ error: '更新课程失败' })
  }
})

// 删除课程
router.delete('/courses/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    await prisma.course.delete({
      where: { id },
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Delete course error:', error)
    if (error.code === 'P2025') {
      return res.status(404).json({ error: '课程不存在' })
    }
    res.status(500).json({ error: '删除课程失败' })
  }
})

// ============ 成就管理 ============

// 创建成就
router.post('/achievements', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, description, icon, badgeColor } = req.body

    if (!name) {
      return res.status(400).json({ error: '成就名称是必填项' })
    }

    const achievement = await prisma.achievement.create({
      data: {
        name,
        description: description || '',
        icon: icon || '🏅',
        badgeColor: badgeColor || 'blue',
      },
    })

    res.json(achievement)
  } catch (error) {
    console.error('Create achievement error:', error)
    if (error.code === 'P2002') {
      return res.status(400).json({ error: '成就名称已存在' })
    }
    res.status(500).json({ error: '创建成就失败' })
  }
})

// 更新成就
router.put('/achievements/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, icon, badgeColor } = req.body

    const achievement = await prisma.achievement.update({
      where: { id },
      data: {
        name,
        description,
        icon,
        badgeColor,
      },
    })

    res.json(achievement)
  } catch (error) {
    console.error('Update achievement error:', error)
    if (error.code === 'P2025') {
      return res.status(404).json({ error: '成就不存在' })
    }
    res.status(500).json({ error: '更新成就失败' })
  }
})

// 删除成就
router.delete('/achievements/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    await prisma.achievement.delete({
      where: { id },
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Delete achievement error:', error)
    if (error.code === 'P2025') {
      return res.status(404).json({ error: '成就不存在' })
    }
    res.status(500).json({ error: '删除成就失败' })
  }
})

// ============ 统计信息 ============

// 获取统计数据
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [totalUsers, totalCourses, totalAchievements, completedProgress] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.achievement.count(),
      prisma.userProgress.count({ where: { status: 'completed' } }),
    ])

    res.json({
      totalUsers,
      totalCourses,
      totalAchievements,
      completedCourses: completedProgress,
    })
  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({ error: '获取统计数据失败' })
  }
})

export default router
