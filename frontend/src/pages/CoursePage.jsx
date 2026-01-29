import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { courseAPI } from '../services/api'
import Editor from '../components/CourseEditor/Editor'
import ShareModal from '../components/ShareModal'

export default function CoursePage() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [shareOpen, setShareOpen] = useState(false)
  const [code, setCode] = useState('')

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // 获取课程信息
        const courseRes = await courseAPI.getCourseById(courseId)
        setCourse(courseRes.data)

        // 获取用户进度
        const progressRes = await courseAPI.getUserProgress(courseId)
        setProgress(progressRes.data)
      } catch (err) {
        setError('无法加载课程信息')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourseData()
  }, [courseId])

  const handleMarkComplete = async () => {
    try {
      await courseAPI.markCourseComplete(courseId)
      setProgress({ ...progress, status: 'completed' })
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (err) {
      setError('无法标记课程完成')
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4 animate-bounce">📚</div>
          <p className="text-xl">正在加载课程...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-xl">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-6 py-3 bg-white text-purple-600 rounded-lg font-bold hover:shadow-lg"
          >
            返回首页
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="text-purple-600 hover:text-purple-700 font-bold"
            >
              ← 返回
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{course?.title}</h1>
              <p className="text-sm text-gray-600">{course?.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-xs text-gray-500">难度</p>
              <p className="text-sm font-bold text-gray-900 capitalize">{course?.level}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">时长</p>
              <p className="text-sm font-bold text-gray-900">{course?.duration} 分钟</p>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 编辑器区 (3 列) */}
          <div className="lg:col-span-3 h-screen sticky top-0">
            <Editor 
              courseId={courseId} 
              onSave={() => {}}
              onCodeChange={(newCode) => setCode(newCode)}
            />
          </div>

          {/* 侧边栏 (1 列) */}
          <div className="lg:col-span-1 space-y-6">
            {/* 进度卡 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📊 课程进度</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">完成度</span>
                    <span className="text-sm font-bold text-purple-600">
                      {progress?.status === 'completed' ? '100%' : '0%'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        progress?.status === 'completed'
                          ? 'bg-green-500 w-full'
                          : 'bg-purple-600 w-0'
                      }`}
                    ></div>
                  </div>
                </div>

                {/* 状态 */}
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">状态</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                      progress?.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : progress?.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {progress?.status === 'completed'
                      ? '✅ 已完成'
                      : progress?.status === 'in_progress'
                      ? '⏳ 学习中'
                      : '⭕ 未开始'}
                  </span>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            {progress?.status !== 'completed' && (
              <button
                onClick={handleMarkComplete}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition"
              >
                ✅ 标记为完成
              </button>
            )}

            {progress?.status === 'completed' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm font-bold text-green-700">🎉 恭喜！</p>
                <p className="text-xs text-green-600 mt-1">你已完成此课程</p>
              </div>
            )}

            {/* 学习提示 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-bold text-blue-700 mb-2">💡 学习提示</p>
              <ul className="text-xs text-blue-600 space-y-1">
                <li>• 在左边编辑器中编写代码</li>
                <li>• 点击 "运行" 按钮执行代码</li>
                <li>• 查看右侧的输出结果</li>
                <li>• 完成后点击"标记为完成"</li>
              </ul>
            </div>

            {/* 共享按钮 */}
            <button 
              onClick={() => setShareOpen(true)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-bold transition">
              🔗 分享作品
            </button>
          </div>
        </div>

        {/* 分享模态框 */}
        <ShareModal 
          isOpen={shareOpen}
          courseId={courseId}
          code={code}
          onClose={() => setShareOpen(false)}
        />
      </div>
    </div>
  )
}
