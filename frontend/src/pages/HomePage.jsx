import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { courseAPI } from '../services/api'
import AchievementBadge from '../components/Achievement/AchievementBadge'

export default function HomePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseAPI.getCourses()
        setCourses(response.data)
      } catch (error) {
        console.error('Failed to fetch courses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 顶部导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🚀</span>
            <h1 className="text-2xl font-bold text-gray-900">Vibe Coding</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">欢迎回来</p>
              <p className="text-md font-semibold text-gray-900">{user?.username || user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
            >
              登出
            </button>
          </div>
        </div>
      </nav>

      {/* 主内容区 */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* 欢迎横幅 */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-8 mb-12">
          <h2 className="text-4xl font-bold mb-4">欢迎来到 Vibe Coding! 👋</h2>
          <p className="text-lg mb-4">
            30 秒内运行你的第一行代码。开始 8 天的 JavaScript 学习之旅吧！
          </p>
          <div className="flex space-x-4">
            <button className="bg-white text-purple-600 font-bold px-6 py-3 rounded-lg hover:shadow-lg transition">
              🎯 立即开始学习
            </button>
            <button className="border-2 border-white text-white font-bold px-6 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition">
              📚 查看课程计划
            </button>
          </div>
        </div>

        {/* 学习进度卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">📊 学习进度</h3>
              <span className="text-3xl">0%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '0%' }}></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">0 / 8 课程完成</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">⏱️ 学习时长</h3>
              <span className="text-3xl">0 min</span>
            </div>
            <p className="text-sm text-gray-500">保持学习！每天进步一点点</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">🏆 成就徽章</h3>
              <span className="text-3xl">0</span>
            </div>
            <p className="text-sm text-gray-500">完成课程解锁新徽章</p>
          </div>
        </div>

        {/* 成就展示 */}
        <div className="mb-12">
          <AchievementBadge />
        </div>

        {/* 课程列表 */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">📚 课程列表</h3>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">正在加载课程...</p>
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course, index) => (
                <div 
                  key={course.id}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                        课程 {index + 1}
                      </div>
                      <h4 className="text-lg font-bold text-gray-900">{course.title}</h4>
                    </div>
                    <span className="text-2xl">📖</span>
                  </div>
                  <p className="text-gray-600 mb-4">{course.description || '编程学习课程'}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">⏱️ {course.duration} 分钟</span>
                    <button 
                      onClick={() => navigate(`/course/${course.id}`)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm font-semibold"
                    >
                      开始学习 →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm">
              <p className="text-gray-500 mb-4">还没有课程。请检查服务器连接。</p>
              <button className="text-purple-600 hover:text-purple-700 font-semibold">
                🔄 重新加载
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
