import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { courseAPI } from '../services/api'
import AchievementBadge from '../components/Achievement/AchievementBadge'
import { Card, Progress, Spin, Button, Row, Col, Statistic, Tag, message } from 'antd'
import { BookOutlined, TrophyOutlined, ClockCircleOutlined, RocketOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons'

export default function HomePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCourses: 8,
    completedCourses: 0,
    progressPercent: 0,
    unlockedAchievements: 0,
    totalAchievements: 8
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      // 并行获取课程和用户统计
      const [coursesRes, statsRes] = await Promise.all([
        courseAPI.getCourses(),
        courseAPI.getUserStats().catch(() => ({ data: stats })) // 如果获取失败使用默认值
      ])
      setCourses(coursesRes.data)
      if (statsRes.data) {
        setStats(statsRes.data)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
      message.error('获取数据失败，请检查网络连接')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleStartLearning = () => {
    // 找到第一个未完成的课程，如果都完成了就打开第一个
    if (courses.length > 0) {
      navigate(`/course/${courses[0].id}`)
    }
  }

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
            <Button 
              icon={<SettingOutlined />}
              onClick={() => navigate('/admin')}
            >
              管理后台
            </Button>
            <div className="text-right">
              <p className="text-sm text-gray-500">欢迎回来</p>
              <p className="text-md font-semibold text-gray-900">{user?.username || user?.email}</p>
            </div>
            <Button danger onClick={logout}>登出</Button>
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
            <Button 
              type="primary" 
              size="large" 
              icon={<RocketOutlined />}
              onClick={handleStartLearning}
              className="!bg-white !text-purple-600 !border-none hover:!bg-gray-100"
            >
              立即开始学习
            </Button>
            <Button 
              size="large" 
              ghost
              icon={<BookOutlined />}
              onClick={() => document.getElementById('course-list')?.scrollIntoView({ behavior: 'smooth' })}
            >
              查看课程计划
            </Button>
          </div>
        </div>

        {/* 学习进度卡片 - 使用 Ant Design */}
        <Row gutter={[24, 24]} className="mb-12">
          <Col xs={24} md={8}>
            <Card hoverable>
              <Statistic
                title={<span><BookOutlined className="mr-2" />学习进度</span>}
                value={stats.progressPercent}
                suffix="%"
                valueStyle={{ color: '#7c3aed' }}
              />
              <Progress 
                percent={stats.progressPercent} 
                strokeColor="#7c3aed" 
                showInfo={false}
                className="mt-2"
              />
              <p className="text-sm text-gray-500 mt-2">
                {stats.completedCourses} / {stats.totalCourses} 课程完成
              </p>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card hoverable>
              <Statistic
                title={<span><ClockCircleOutlined className="mr-2" />学习时长</span>}
                value={stats.completedCourses * 15}
                suffix="分钟"
                valueStyle={{ color: '#3b82f6' }}
              />
              <p className="text-sm text-gray-500 mt-4">保持学习！每天进步一点点</p>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card hoverable>
              <Statistic
                title={<span><TrophyOutlined className="mr-2" />成就徽章</span>}
                value={stats.unlockedAchievements}
                suffix={`/ ${stats.totalAchievements}`}
                valueStyle={{ color: '#f59e0b' }}
              />
              <p className="text-sm text-gray-500 mt-4">完成课程解锁新徽章</p>
            </Card>
          </Col>
        </Row>

        {/* 成就展示 */}
        <div className="mb-12">
          <AchievementBadge />
        </div>

        {/* 课程列表 */}
        <div id="course-list">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">📚 课程列表</h3>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={fetchData}
              loading={loading}
            >
              刷新
            </Button>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <Spin size="large" tip="正在加载课程..." />
            </div>
          ) : courses.length > 0 ? (
            <Row gutter={[24, 24]}>
              {courses.map((course, index) => (
                <Col xs={24} md={12} key={course.id}>
                  <Card 
                    hoverable
                    onClick={() => navigate(`/course/${course.id}`)}
                    className="h-full"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <Tag color="purple" className="mb-2">课程 {index + 1}</Tag>
                        <h4 className="text-lg font-bold text-gray-900">{course.title}</h4>
                      </div>
                      <span className="text-2xl">📖</span>
                    </div>
                    <p className="text-gray-600 mb-4">{course.description || '编程学习课程'}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        <ClockCircleOutlined className="mr-1" />
                        {course.duration} 分钟
                      </span>
                      <Button type="primary" className="!bg-purple-600">
                        开始学习 →
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Card className="text-center">
              <p className="text-gray-500 mb-4">还没有课程。请检查服务器连接。</p>
              <Button type="primary" icon={<ReloadOutlined />} onClick={fetchData}>
                重新加载
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
