import { useState, useEffect } from 'react'
import { achievementAPI } from '../../services/api'
import { Card, Spin, Tooltip, Badge, message } from 'antd'
import { TrophyOutlined, LockOutlined } from '@ant-design/icons'

// 预定义的成就徽章（作为默认显示）
const DEFAULT_ACHIEVEMENTS = [
  {
    id: 'first_code',
    name: '初次编程',
    description: '运行你的第一行代码',
    icon: '🎉',
    color: 'bg-green-100 text-green-700',
  },
  {
    id: 'hello_world',
    name: 'Hello World',
    description: '成功输出 Hello World',
    icon: '👋',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'first_variable',
    name: '变量大师',
    description: '学会使用变量',
    icon: '📦',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    id: 'first_function',
    name: '函数入门',
    description: '创建你的第一个函数',
    icon: '⚡',
    color: 'bg-yellow-100 text-yellow-700',
  },
  {
    id: 'loop_master',
    name: '循环高手',
    description: '掌握循环语句',
    icon: '🔄',
    color: 'bg-pink-100 text-pink-700',
  },
  {
    id: 'day_complete',
    name: '日课完成',
    description: '完成一天的所有课程',
    icon: '🌟',
    color: 'bg-orange-100 text-orange-700',
  },
  {
    id: 'week_warrior',
    name: '周末战士',
    description: '连续学习一周',
    icon: '🏆',
    color: 'bg-red-100 text-red-700',
  },
  {
    id: 'coding_master',
    name: '编程大师',
    description: '完成所有课程',
    icon: '👑',
    color: 'bg-indigo-100 text-indigo-700',
  }
]

export default function AchievementBadge() {
  const [achievements, setAchievements] = useState([])
  const [userAchievements, setUserAchievements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        // 并行获取所有成就和用户成就
        const [allRes, userRes] = await Promise.all([
          achievementAPI.getAllAchievements().catch(() => ({ data: [] })),
          achievementAPI.getUserAchievements().catch(() => ({ data: [] }))
        ])

        // 如果后端有数据，使用后端数据；否则使用默认数据
        const allAchievements = allRes.data.length > 0 ? allRes.data : DEFAULT_ACHIEVEMENTS
        const unlockedIds = new Set(userRes.data.map(a => a.id || a.achievementId))

        // 合并数据，标记已解锁的成就
        const mergedAchievements = allAchievements.map(achievement => {
          const defaultAch = DEFAULT_ACHIEVEMENTS.find(d => d.id === achievement.id || d.name === achievement.name)
          return {
            ...achievement,
            icon: achievement.icon || defaultAch?.icon || '🏅',
            color: defaultAch?.color || 'bg-gray-100 text-gray-700',
            unlocked: unlockedIds.has(achievement.id)
          }
        })

        setAchievements(mergedAchievements)
        setUserAchievements(userRes.data)
      } catch (error) {
        console.error('Failed to fetch achievements:', error)
        // 使用默认数据
        setAchievements(DEFAULT_ACHIEVEMENTS.map(a => ({ ...a, unlocked: false })))
      } finally {
        setLoading(false)
      }
    }

    fetchAchievements()
  }, [])

  const unlockedCount = achievements.filter(a => a.unlocked).length

  if (loading) {
    return (
      <Card>
        <div className="text-center py-8">
          <Spin tip="加载成就中..." />
        </div>
      </Card>
    )
  }

  return (
    <Card 
      title={
        <div className="flex items-center justify-between">
          <span><TrophyOutlined className="mr-2 text-yellow-500" />成就徽章</span>
          <span className="text-sm font-normal text-gray-500">
            已解锁 {unlockedCount} / {achievements.length}
          </span>
        </div>
      }
    >
      <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
        {achievements.map((achievement) => (
          <Tooltip
            key={achievement.id}
            title={
              <div>
                <p className="font-semibold">{achievement.name}</p>
                <p className="text-gray-300">{achievement.description}</p>
                {!achievement.unlocked && (
                  <p className="text-yellow-400 mt-1"><LockOutlined /> 未解锁</p>
                )}
              </div>
            }
          >
            <div className="relative cursor-pointer transition-transform hover:scale-110">
              <Badge 
                count={achievement.unlocked ? '✓' : <LockOutlined style={{ color: '#999' }} />}
                offset={[-5, 5]}
                style={{ 
                  backgroundColor: achievement.unlocked ? '#52c41a' : '#f0f0f0',
                  color: achievement.unlocked ? '#fff' : '#999'
                }}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl
                    ${achievement.unlocked 
                      ? achievement.color 
                      : 'bg-gray-100 text-gray-400 grayscale'
                    }`}
                >
                  {achievement.icon}
                </div>
              </Badge>
            </div>
          </Tooltip>
        ))}
      </div>

      {unlockedCount === 0 && (
        <p className="text-center text-gray-500 text-sm mt-4">
          开始学习来解锁你的第一个成就徽章！💪
        </p>
      )}
    </Card>
  )
}
