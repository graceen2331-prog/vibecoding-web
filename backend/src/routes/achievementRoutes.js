// backend/src/routes/achievementRoutes.js
import express from 'express'
import prisma from '../lib/prisma.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

// 获取所有成就
router.get('/', async (req, res) => {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(achievements)
  } catch (error) {
    console.error('Get achievements error:', error)
    res.status(500).json({ error: 'Failed to get achievements' })
  }
})

// 获取用户的成就（需要认证）
router.get('/user/achievements', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user

    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { unlockedAt: 'desc' },
    })

    res.json(userAchievements.map(ua => ({
      ...ua.achievement,
      unlockedAt: ua.unlockedAt,
    })))
  } catch (error) {
    console.error('Get user achievements error:', error)
    res.status(500).json({ error: 'Failed to get user achievements' })
  }
})

// 解锁成就（内部使用）
router.post('/:achievementId/unlock', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user
    const { achievementId } = req.params

    // 检查成就是否存在
    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId },
    })

    if (!achievement) {
      return res.status(404).json({ error: 'Achievement not found' })
    }

    // 检查是否已解锁
    const existing = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId,
          achievementId,
        },
      },
    })

    if (existing) {
      return res.status(409).json({ error: 'Achievement already unlocked' })
    }

    // 创建成就解锁记录
    const unlocked = await prisma.userAchievement.create({
      data: {
        userId,
        achievementId,
      },
      include: { achievement: true },
    })

    res.json(unlocked)
  } catch (error) {
    console.error('Unlock achievement error:', error)
    res.status(500).json({ error: 'Failed to unlock achievement' })
  }
})

export default router
