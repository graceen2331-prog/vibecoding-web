import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { courseAPI, codeAPI, achievementAPI } from '../services/api'
import Editor from '../components/CourseEditor/Editor'
import { Card, Button, Progress, Tag, Alert, Spin, Modal, Result, message, Steps, List } from 'antd'
import { 
  ArrowLeftOutlined, 
  CheckCircleOutlined, 
  PlayCircleOutlined,
  TrophyOutlined,
  BulbOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'

export default function CoursePage() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [code, setCode] = useState('')
  
  // 代码验证状态
  const [validating, setValidating] = useState(false)
  const [validationResult, setValidationResult] = useState(null)
  
  // 成就解锁模态框
  const [achievementModal, setAchievementModal] = useState(false)
  const [unlockedAchievement, setUnlockedAchievement] = useState(null)

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

  // 自动验证代码
  const handleValidateCode = async () => {
    if (!code.trim()) {
      message.warning('请先编写一些代码')
      return
    }

    setValidating(true)
    try {
      const res = await codeAPI.validate(code, courseId)
      setValidationResult(res.data)
      
      if (res.data.valid) {
        message.success(res.data.message || '代码验证通过！')
        
        // 如果通过验证且有成就ID，尝试解锁成就
        if (res.data.achievementId) {
          try {
            const achievementRes = await achievementAPI.unlockAchievement(res.data.achievementId)
            if (achievementRes.data && achievementRes.data.achievement) {
              setUnlockedAchievement(achievementRes.data.achievement)
              setAchievementModal(true)
            }
          } catch (achErr) {
            // 成就可能已解锁，忽略错误
            console.log('Achievement may already be unlocked')
          }
        }
      } else {
        message.info(res.data.message || '继续尝试，你可以做到的！')
      }
    } catch (err) {
      console.error('Validation error:', err)
      message.error('代码验证失败')
    } finally {
      setValidating(false)
    }
  }

  const handleMarkComplete = async () => {
    try {
      await courseAPI.markCourseComplete(courseId)
      setProgress({ ...progress, status: 'completed' })
      message.success('🎉 恭喜完成课程！')
      
      // 尝试解锁对应成就
      if (validationResult?.achievementId) {
        try {
          await achievementAPI.unlockAchievement(validationResult.achievementId)
        } catch (e) {
          // 忽略已解锁错误
        }
      }
      
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
          <Spin size="large" />
          <p className="text-xl mt-4">正在加载课程...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
        <Result
          status="error"
          title="加载失败"
          subTitle={error}
          extra={[
            <Button type="primary" key="home" onClick={() => navigate('/')}>
              返回首页
            </Button>
          ]}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/')}
              className="!text-purple-600"
            >
              返回
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{course?.title}</h1>
              <p className="text-sm text-gray-600">{course?.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Tag color="purple">{course?.level}</Tag>
            <Tag icon={<ClockCircleOutlined />}>{course?.duration} 分钟</Tag>
          </div>
        </div>
      </div>

      {/* 主内容 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 编辑器区 (3 列) */}
          <div className="lg:col-span-3 h-[600px]">
            <Editor 
              courseId={courseId} 
              onSave={() => {}}
              onCodeChange={(newCode) => setCode(newCode)}
            />
          </div>

          {/* 侧边栏 (1 列) */}
          <div className="lg:col-span-1 space-y-6">
            {/* 进度卡 */}
            <Card title={<span><CheckCircleOutlined className="mr-2" />课程进度</span>}>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">完成度</span>
                    <span className="text-sm font-bold text-purple-600">
                      {progress?.status === 'completed' ? '100%' : '0%'}
                    </span>
                  </div>
                  <Progress
                    percent={progress?.status === 'completed' ? 100 : 0}
                    strokeColor="#7c3aed"
                    showInfo={false}
                  />
                </div>

                {/* 状态 */}
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">状态</p>
                  <Tag
                    color={
                      progress?.status === 'completed'
                        ? 'green'
                        : progress?.status === 'in_progress'
                        ? 'blue'
                        : 'default'
                    }
                  >
                    {progress?.status === 'completed'
                      ? '✅ 已完成'
                      : progress?.status === 'in_progress'
                      ? '⏳ 学习中'
                      : '⭕ 未开始'}
                  </Tag>
                </div>
              </div>
            </Card>

            {/* 代码验证结果 */}
            {validationResult && (
              <Card title={<span><PlayCircleOutlined className="mr-2" />验证结果</span>}>
                <Alert
                  message={validationResult.message}
                  type={validationResult.valid ? 'success' : 'info'}
                  showIcon
                  className="mb-3"
                />
                {validationResult.tests && validationResult.tests.length > 0 && (
                  <List
                    size="small"
                    dataSource={validationResult.tests}
                    renderItem={(test) => (
                      <List.Item>
                        <span className={test.passed ? 'text-green-600' : 'text-gray-500'}>
                          {test.passed ? '✅' : '⭕'} {test.name}
                        </span>
                        {!test.passed && test.hint && (
                          <p className="text-xs text-gray-400 ml-6">{test.hint}</p>
                        )}
                      </List.Item>
                    )}
                  />
                )}
              </Card>
            )}

            {/* 验证按钮 */}
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={handleValidateCode}
              loading={validating}
              block
              size="large"
              className="!bg-blue-600"
            >
              🔍 验证代码
            </Button>

            {/* 完成按钮 */}
            {progress?.status !== 'completed' && (
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={handleMarkComplete}
                block
                size="large"
                className="!bg-green-600"
                disabled={!validationResult?.valid}
              >
                ✅ 标记为完成
              </Button>
            )}

            {progress?.status === 'completed' && (
              <Alert
                message="🎉 恭喜！"
                description="你已完成此课程"
                type="success"
                showIcon
              />
            )}

            {/* 学习提示 */}
            <Card size="small" className="!bg-blue-50 !border-blue-200">
              <p className="text-sm font-bold text-blue-700 mb-2">
                <BulbOutlined className="mr-1" />学习提示
              </p>
              <ul className="text-xs text-blue-600 space-y-1">
                <li>• 在左边编辑器中编写代码</li>
                <li>• 点击 "运行" 按钮执行代码</li>
                <li>• 点击 "验证代码" 检查是否正确</li>
                <li>• 通过验证后点击 "标记为完成"</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      {/* 成就解锁模态框 */}
      <Modal
        open={achievementModal}
        onCancel={() => setAchievementModal(false)}
        footer={[
          <Button key="ok" type="primary" onClick={() => setAchievementModal(false)}>
            太棒了！
          </Button>
        ]}
        centered
      >
        <Result
          icon={<TrophyOutlined style={{ color: '#faad14', fontSize: 72 }} />}
          title="🎉 成就解锁！"
          subTitle={
            <div className="text-center">
              <div className="text-4xl my-4">{unlockedAchievement?.icon || '🏆'}</div>
              <p className="text-xl font-bold">{unlockedAchievement?.name}</p>
              <p className="text-gray-500">{unlockedAchievement?.description}</p>
            </div>
          }
        />
      </Modal>
    </div>
  )
}
