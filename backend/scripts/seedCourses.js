// backend/scripts/seedCourses.js
import prisma from '../src/lib/prisma.js'

const courses = [
  {
    id: 'course-001',
    title: '课程 1：你好，JavaScript',
    description: '学习变量、输出和编程的基础概念',
    level: 'beginner',
    duration: 15,
    order: 1,
  },
  {
    id: 'course-002',
    title: '课程 2：数字的世界',
    description: '掌握数据类型和数值运算',
    level: 'beginner',
    duration: 20,
    order: 2,
  },
  {
    id: 'course-003',
    title: '课程 3：判断与选择',
    description: '学习 if/else 条件判断语句',
    level: 'beginner',
    duration: 20,
    order: 3,
  },
  {
    id: 'course-004',
    title: '课程 4：重复的力量',
    description: '掌握 for 循环和循环逻辑',
    level: 'beginner',
    duration: 25,
    order: 4,
  },
  {
    id: 'course-005',
    title: '课程 5：函数的魔力',
    description: '学习定义和调用函数',
    level: 'beginner',
    duration: 25,
    order: 5,
  },
  {
    id: 'course-006',
    title: '课程 6：列表与集合',
    description: '掌握数组和列表操作',
    level: 'beginner',
    duration: 25,
    order: 6,
  },
  {
    id: 'course-007',
    title: '课程 7：字符串变魔术',
    description: '学习字符串操作和处理',
    level: 'beginner',
    duration: 20,
    order: 7,
  },
  {
    id: 'course-008',
    title: '课程 8：综合项目',
    description: '综合应用前 7 课的概念，完成一个交互式应用',
    level: 'beginner',
    duration: 60,
    order: 8,
  },
]

const achievements = [
  {
    name: '第一行代码',
    description: '完成课程 1',
    icon: '🎯',
    badgeColor: 'blue',
  },
  {
    name: '小小计算家',
    description: '完成课程 2',
    icon: '🔢',
    badgeColor: 'purple',
  },
  {
    name: '逻辑大师',
    description: '完成课程 3',
    icon: '🧠',
    badgeColor: 'green',
  },
  {
    name: '循环骑士',
    description: '完成课程 4',
    icon: '🔄',
    badgeColor: 'yellow',
  },
  {
    name: '函数之神',
    description: '完成课程 5',
    icon: '⚡',
    badgeColor: 'red',
  },
  {
    name: '数据武士',
    description: '完成课程 6',
    icon: '⚔️',
    badgeColor: 'orange',
  },
  {
    name: '字符串魔法师',
    description: '完成课程 7',
    icon: '✨',
    badgeColor: 'pink',
  },
  {
    name: '全能开发者',
    description: '完成课程 8',
    icon: '👑',
    badgeColor: 'gold',
  },
]

async function main() {
  console.log('🌱 开始初始化数据...')

  try {
    // 清除现有数据
    await prisma.achievement.deleteMany()
    await prisma.course.deleteMany()
    console.log('✅ 清除现有数据')

    // 创建课程
    for (const course of courses) {
      await prisma.course.create({ data: course })
    }
    console.log(`✅ 创建了 ${courses.length} 门课程`)

    // 创建成就
    for (const achievement of achievements) {
      await prisma.achievement.create({ data: achievement })
    }
    console.log(`✅ 创建了 ${achievements.length} 个成就`)

    console.log('🎉 数据初始化完成！')
  } catch (error) {
    console.error('❌ 数据初始化失败:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

