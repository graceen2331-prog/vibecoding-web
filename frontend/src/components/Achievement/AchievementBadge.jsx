 import { useState, useEffect } from 'react'

// 预定义的成就徽章
const ACHIEVEMENTS = [
  {
    id: 'first_code',
    name: '初次编程',
    description: '运行你的第一行代码',
    icon: '🎉',
    color: 'bg-green-100 text-green-700',
    unlocked: false
  },
  {
    id: 'hello_world',
    name: 'Hello World',
    description: '成功输出 Hello World',
    icon: '👋',
    color: 'bg-blue-100 text-blue-700',
    unlocked: false
  },
  {
    id: 'first_variable',
    name: '变量大师',
    description: '学会使用变量',
    icon: '📦',
    color: 'bg-purple-100 text-purple-700',
    unlocked: false
  },
  {
    id: 'first_function',
    name: '函数入门',
    description: '创建你的第一个函数',
    icon: '⚡',
    color: 'bg-yellow-100 text-yellow-700',
    unlocked: false
  },
  {
    id: 'loop_master',
    name: '循环高手',
    description: '掌握循环语句',
    icon: '🔄',
    color: 'bg-pink-100 text-pink-700',
    unlocked: false
  },
  {
    id: 'day_complete',
    name: '日课完成',
    description: '完成一天的所有课程',
    icon: '🌟',
    color: 'bg-orange-100 text-orange-700',
    unlocked: false
  },
  {
    id: 'week_warrior',
    name: '周末战士',
    description: '连续学习一周',
    icon: '🏆',
    color: 'bg-red-100 text-red-700',
    unlocked: false
  },
  {
    id: 'coding_master',
    name: '编程大师',
    description: '完成所有课程',
    icon: '👑',
    color: 'bg-indigo-100 text-indigo-700',
    unlocked: false
  }
]

export default function AchievementBadge() {
  const [achievements, setAchievements] = useState(ACHIEVEMENTS)
  const unlockedCount = achievements.filter(a => a.unlocked).length

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">🏆 成就徽章</h3>
        <span className="text-sm text-gray-500">
          已解锁 {unlockedCount} / {achievements.length}
        </span>
      </div>
      
      <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`relative group cursor-pointer transition-transform hover:scale-110`}
            title={achievement.name}
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
            
            {/* 悬浮提示 */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                          invisible group-hover:visible opacity-0 group-hover:opacity-100 
                          transition-opacity z-10">
              <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
                <p className="font-semibold">{achievement.name}</p>
                <p className="text-gray-300">{achievement.description}</p>
                {!achievement.unlocked && (
                  <p className="text-yellow-400 mt-1">🔒 未解锁</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {unlockedCount === 0 && (
        <p className="text-center text-gray-500 text-sm mt-4">
          开始学习来解锁你的第一个成就徽章！💪
        </p>
      )}
    </div>
  )
}
