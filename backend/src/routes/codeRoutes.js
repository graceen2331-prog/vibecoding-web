// backend/src/routes/codeRoutes.js
import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js'
import prisma from '../lib/prisma.js'

const router = express.Router()

// 课程验证规则配置 - 使用成就名称来匹配数据库
const COURSE_VALIDATORS = {
  // 课程1: Hello World
  'course-001': {
    name: '初次编程',
    tests: [
      {
        name: '输出 Hello',
        check: (code, output) => output.toLowerCase().includes('hello'),
        hint: '使用 console.log("Hello World") 输出文字'
      }
    ],
    achievementName: '第一行代码'
  },
  // 课程2: 数字运算
  'course-002': {
    name: '数字运算',
    tests: [
      {
        name: '声明变量',
        check: (code, output) => (code.includes('let ') || code.includes('const ') || code.includes('var ')),
        hint: '使用 let name = 值 声明变量'
      },
      {
        name: '输出结果',
        check: (code, output) => output.length > 0,
        hint: '使用 console.log() 输出计算结果'
      }
    ],
    achievementName: '小小计算家'
  },
  // 课程3: 条件判断
  'course-003': {
    name: '条件判断',
    tests: [
      {
        name: '使用 if 语句',
        check: (code) => code.includes('if') && (code.includes('{') || code.includes('else')),
        hint: '使用 if (条件) { } 编写条件判断'
      }
    ],
    achievementName: '逻辑大师'
  },
  // 课程4: 循环
  'course-004': {
    name: '循环语句',
    tests: [
      {
        name: '使用循环',
        check: (code) => code.includes('for') || code.includes('while'),
        hint: '使用 for 或 while 循环重复执行代码'
      }
    ],
    achievementName: '循环骑士'
  },
  // 课程5: 函数
  'course-005': {
    name: '函数入门',
    tests: [
      {
        name: '定义函数',
        check: (code) => code.includes('function ') || code.includes('=>'),
        hint: '使用 function 名称() { } 或箭头函数定义函数'
      }
    ],
    achievementName: '函数之神'
  },
  // 课程6: 数组
  'course-006': {
    name: '数组操作',
    tests: [
      {
        name: '创建数组',
        check: (code) => code.includes('[') && code.includes(']'),
        hint: '使用 [元素1, 元素2] 创建数组'
      }
    ],
    achievementName: '数据武士'
  },
  // 课程7: 字符串
  'course-007': {
    name: '字符串操作',
    tests: [
      {
        name: '使用字符串',
        check: (code, output) => (code.includes('"') || code.includes("'") || code.includes('`')) && output.length > 0,
        hint: '创建字符串并输出'
      }
    ],
    achievementName: '字符串魔法师'
  },
  // 课程8: 综合项目
  'course-008': {
    name: '综合项目',
    tests: [
      {
        name: '使用函数',
        check: (code) => code.includes('function ') || code.includes('=>'),
        hint: '创建至少一个函数'
      },
      {
        name: '有输出结果',
        check: (code, output) => output.length > 0,
        hint: '确保你的代码有输出'
      }
    ],
    achievementName: '全能开发者'
  }
}

// 安全执行代码并捕获输出
const executeCode = (code) => {
  const logs = []
  const errors = []
  
  // 创建沙箱 console
  const sandboxConsole = {
    log: (...args) => logs.push(args.map(String).join(' ')),
    error: (...args) => errors.push(args.map(String).join(' ')),
    warn: (...args) => logs.push('[warn] ' + args.map(String).join(' ')),
    info: (...args) => logs.push(args.map(String).join(' ')),
  }
  
  try {
    // 使用 Function 构造器在沙箱中执行代码
    const fn = new Function('console', code)
    fn(sandboxConsole)
    
    return {
      success: true,
      output: logs.join('\n'),
      errors: errors.join('\n')
    }
  } catch (error) {
    return {
      success: false,
      output: logs.join('\n'),
      errors: error.message
    }
  }
}

// POST /api/code/validate - 验证用户代码
router.post('/validate', authMiddleware, async (req, res) => {
  try {
    const { code, courseId } = req.body
    
    if (!code || !courseId) {
      return res.status(400).json({ 
        error: '缺少必要参数',
        details: '需要提供 code 和 courseId'
      })
    }
    
    // 获取课程验证规则
    const validator = COURSE_VALIDATORS[courseId]
    
    if (!validator) {
      // 如果没有特定规则，只检查代码能否执行
      const result = executeCode(code)
      return res.json({
        valid: result.success,
        output: result.output,
        errors: result.errors,
        tests: [],
        message: result.success ? '代码执行成功！' : '代码有错误，请检查'
      })
    }
    
    // 执行代码
    const execResult = executeCode(code)
    
    // 运行测试
    const testResults = validator.tests.map(test => {
      const passed = test.check(code, execResult.output)
      return {
        name: test.name,
        passed,
        hint: passed ? null : test.hint
      }
    })
    
    const allPassed = testResults.every(t => t.passed)
    const passedCount = testResults.filter(t => t.passed).length
    
    // 如果通过验证，查找对应的成就ID
    let achievementId = null
    if (allPassed && validator.achievementName) {
      try {
        const achievement = await prisma.achievement.findFirst({
          where: { name: validator.achievementName }
        })
        if (achievement) {
          achievementId = achievement.id
        }
      } catch (err) {
        console.error('查找成就失败:', err)
      }
    }
    
    res.json({
      valid: execResult.success && allPassed,
      output: execResult.output,
      errors: execResult.errors,
      courseName: validator.name,
      tests: testResults,
      passed: passedCount,
      total: testResults.length,
      achievementId: achievementId,
      achievementName: allPassed ? validator.achievementName : null,
      message: allPassed 
        ? `🎉 太棒了！所有测试通过 (${passedCount}/${testResults.length})`
        : `继续加油！通过 ${passedCount}/${testResults.length} 个测试`
    })
    
  } catch (error) {
    console.error('Code validation error:', error)
    res.status(500).json({ error: '代码验证失败' })
  }
})

// POST /api/code/run - 仅运行代码，不验证
router.post('/run', async (req, res) => {
  try {
    const { code } = req.body
    
    if (!code) {
      return res.status(400).json({ error: '请提供要运行的代码' })
    }
    
    const result = executeCode(code)
    
    res.json({
      success: result.success,
      output: result.output,
      errors: result.errors
    })
    
  } catch (error) {
    console.error('Code run error:', error)
    res.status(500).json({ error: '代码运行失败' })
  }
})

export default router
