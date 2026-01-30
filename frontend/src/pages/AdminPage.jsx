import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Layout, Menu, Card, Table, Button, Modal, Form, Input, InputNumber, 
  Select, message, Popconfirm, Statistic, Row, Col, Tag, Space, Tabs, Spin
} from 'antd'
import {
  DashboardOutlined,
  BookOutlined,
  TrophyOutlined,
  UserOutlined,
  SettingOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import { courseAPI, achievementAPI } from '../services/api'
import api from '../services/api'

const { Header, Sider, Content } = Layout
const { TextArea } = Input

export default function AdminPage() {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [loading, setLoading] = useState(false)

  // 数据状态
  const [courses, setCourses] = useState([])
  const [achievements, setAchievements] = useState([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalAchievements: 0,
    completedCourses: 0
  })

  // 模态框状态
  const [courseModal, setCourseModal] = useState(false)
  const [achievementModal, setAchievementModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [editingAchievement, setEditingAchievement] = useState(null)

  const [courseForm] = Form.useForm()
  const [achievementForm] = Form.useForm()

  // 获取数据
  const fetchData = async () => {
    setLoading(true)
    try {
      const [coursesRes, achievementsRes] = await Promise.all([
        courseAPI.getCourses(),
        achievementAPI.getAllAchievements()
      ])
      setCourses(coursesRes.data)
      setAchievements(achievementsRes.data)
      setStats({
        totalUsers: 0, // 需要后端支持
        totalCourses: coursesRes.data.length,
        totalAchievements: achievementsRes.data.length,
        completedCourses: 0
      })
    } catch (error) {
      message.error('获取数据失败')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // 课程表格列
  const courseColumns = [
    {
      title: '序号',
      dataIndex: 'order',
      key: 'order',
      width: 80,
      sorter: (a, b) => a.order - b.order,
    },
    {
      title: '课程名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '难度',
      dataIndex: 'level',
      key: 'level',
      render: (level) => (
        <Tag color={level === 'beginner' ? 'green' : level === 'intermediate' ? 'blue' : 'red'}>
          {level === 'beginner' ? '入门' : level === 'intermediate' ? '中级' : '高级'}
        </Tag>
      ),
    },
    {
      title: '时长(分钟)',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEditCourse(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除这个课程吗？"
            onConfirm={() => handleDeleteCourse(record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // 成就表格列
  const achievementColumns = [
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      width: 80,
      render: (icon) => <span className="text-2xl">{icon || '🏅'}</span>,
    },
    {
      title: '成就名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '徽章颜色',
      dataIndex: 'badgeColor',
      key: 'badgeColor',
      render: (color) => (
        <Tag color={color || 'default'}>{color || '默认'}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEditAchievement(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除这个成就吗？"
            onConfirm={() => handleDeleteAchievement(record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // 课程操作
  const handleEditCourse = (course) => {
    setEditingCourse(course)
    courseForm.setFieldsValue(course)
    setCourseModal(true)
  }

  const handleDeleteCourse = async (id) => {
    try {
      await api.delete(`/api/admin/courses/${id}`)
      message.success('课程已删除')
      fetchData()
    } catch (error) {
      message.error('删除失败：' + (error.response?.data?.error || '未知错误'))
    }
  }

  const handleSaveCourse = async (values) => {
    try {
      if (editingCourse) {
        await api.put(`/api/admin/courses/${editingCourse.id}`, values)
        message.success('课程已更新')
      } else {
        await api.post('/api/admin/courses', values)
        message.success('课程已创建')
      }
      setCourseModal(false)
      setEditingCourse(null)
      courseForm.resetFields()
      fetchData()
    } catch (error) {
      message.error('保存失败：' + (error.response?.data?.error || '未知错误'))
    }
  }

  // 成就操作
  const handleEditAchievement = (achievement) => {
    setEditingAchievement(achievement)
    achievementForm.setFieldsValue(achievement)
    setAchievementModal(true)
  }

  const handleDeleteAchievement = async (id) => {
    try {
      await api.delete(`/api/admin/achievements/${id}`)
      message.success('成就已删除')
      fetchData()
    } catch (error) {
      message.error('删除失败：' + (error.response?.data?.error || '未知错误'))
    }
  }

  const handleSaveAchievement = async (values) => {
    try {
      if (editingAchievement) {
        await api.put(`/api/admin/achievements/${editingAchievement.id}`, values)
        message.success('成就已更新')
      } else {
        await api.post('/api/admin/achievements', values)
        message.success('成就已创建')
      }
      setAchievementModal(false)
      setEditingAchievement(null)
      achievementForm.resetFields()
      fetchData()
    } catch (error) {
      message.error('保存失败：' + (error.response?.data?.error || '未知错误'))
    }
  }

  // 渲染仪表盘
  const renderDashboard = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">📊 数据概览</h2>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="总课程数"
              value={stats.totalCourses}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#7c3aed' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="总成就数"
              value={stats.totalAchievements}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#f59e0b' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="注册用户"
              value={stats.totalUsers || '-'}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3b82f6' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="课程完成数"
              value={stats.completedCourses || '-'}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#10b981' }}
            />
          </Card>
        </Col>
      </Row>

      <Card className="mt-6" title="快速操作">
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => {
            setEditingCourse(null)
            courseForm.resetFields()
            setCourseModal(true)
          }}>
            添加课程
          </Button>
          <Button icon={<PlusOutlined />} onClick={() => {
            setEditingAchievement(null)
            achievementForm.resetFields()
            setAchievementModal(true)
          }}>
            添加成就
          </Button>
          <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading}>
            刷新数据
          </Button>
        </Space>
      </Card>
    </div>
  )

  // 渲染课程管理
  const renderCourses = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">📚 课程管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => {
          setEditingCourse(null)
          courseForm.resetFields()
          setCourseModal(true)
        }}>
          添加课程
        </Button>
      </div>
      <Card>
        <Table
          dataSource={courses}
          columns={courseColumns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  )

  // 渲染成就管理
  const renderAchievements = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">🏆 成就管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => {
          setEditingAchievement(null)
          achievementForm.resetFields()
          setAchievementModal(true)
        }}>
          添加成就
        </Button>
      </div>
      <Card>
        <Table
          dataSource={achievements}
          columns={achievementColumns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  )

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '数据概览',
    },
    {
      key: 'courses',
      icon: <BookOutlined />,
      label: '课程管理',
    },
    {
      key: 'achievements',
      icon: <TrophyOutlined />,
      label: '成就管理',
    },
  ]

  return (
    <Layout className="min-h-screen">
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        theme="light"
        className="shadow-md"
      >
        <div className="h-16 flex items-center justify-center border-b">
          <span className="text-xl">🚀</span>
          {!collapsed && <span className="ml-2 font-bold">管理后台</span>}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[activeMenu]}
          onClick={({ key }) => setActiveMenu(key)}
          items={menuItems}
          className="border-none"
        />
      </Sider>
      
      <Layout>
        <Header className="bg-white px-6 flex items-center justify-between shadow-sm">
          <Button 
            type="link" 
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/')}
          >
            返回首页
          </Button>
          <span className="text-gray-500">Vibe Coding 管理后台</span>
        </Header>
        
        <Content className="m-6">
          {activeMenu === 'dashboard' && renderDashboard()}
          {activeMenu === 'courses' && renderCourses()}
          {activeMenu === 'achievements' && renderAchievements()}
        </Content>
      </Layout>

      {/* 课程编辑模态框 */}
      <Modal
        title={editingCourse ? '编辑课程' : '添加课程'}
        open={courseModal}
        onCancel={() => {
          setCourseModal(false)
          setEditingCourse(null)
          courseForm.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form
          form={courseForm}
          layout="vertical"
          onFinish={handleSaveCourse}
          initialValues={{ level: 'beginner', duration: 15 }}
        >
          <Form.Item
            name="title"
            label="课程名称"
            rules={[{ required: true, message: '请输入课程名称' }]}
          >
            <Input placeholder="例如：JavaScript 入门" />
          </Form.Item>
          <Form.Item
            name="description"
            label="课程描述"
          >
            <TextArea rows={3} placeholder="课程的简短描述" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="order"
                label="课程序号"
                rules={[{ required: true, message: '请输入序号' }]}
              >
                <InputNumber min={1} max={100} className="w-full" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="level"
                label="难度级别"
              >
                <Select>
                  <Select.Option value="beginner">入门</Select.Option>
                  <Select.Option value="intermediate">中级</Select.Option>
                  <Select.Option value="advanced">高级</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="duration"
                label="时长(分钟)"
              >
                <InputNumber min={5} max={120} className="w-full" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => {
                setCourseModal(false)
                setEditingCourse(null)
                courseForm.resetFields()
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 成就编辑模态框 */}
      <Modal
        title={editingAchievement ? '编辑成就' : '添加成就'}
        open={achievementModal}
        onCancel={() => {
          setAchievementModal(false)
          setEditingAchievement(null)
          achievementForm.resetFields()
        }}
        footer={null}
        width={500}
      >
        <Form
          form={achievementForm}
          layout="vertical"
          onFinish={handleSaveAchievement}
        >
          <Form.Item
            name="name"
            label="成就名称"
            rules={[{ required: true, message: '请输入成就名称' }]}
          >
            <Input placeholder="例如：初次编程" />
          </Form.Item>
          <Form.Item
            name="description"
            label="成就描述"
          >
            <TextArea rows={2} placeholder="获得此成就的条件描述" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="icon"
                label="图标 (Emoji)"
              >
                <Input placeholder="例如：🎉" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="badgeColor"
                label="徽章颜色"
              >
                <Select placeholder="选择颜色">
                  <Select.Option value="green">绿色</Select.Option>
                  <Select.Option value="blue">蓝色</Select.Option>
                  <Select.Option value="purple">紫色</Select.Option>
                  <Select.Option value="yellow">黄色</Select.Option>
                  <Select.Option value="red">红色</Select.Option>
                  <Select.Option value="orange">橙色</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => {
                setAchievementModal(false)
                setEditingAchievement(null)
                achievementForm.resetFields()
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  )
}
