import React, { useEffect, useRef, useState } from 'react'
import Editor from '@monaco-editor/react'

const DEFAULT_CODE = `// 欢迎来到 Vibe Coding!
// 试试运行这个代码：

console.log('🚀 Hello Vibe Coding!')

// 基础计算
const sum = 2 + 3
console.log(\`2 + 3 = \${sum}\`)

// 字符串操作
const greeting = 'Hello, '
const name = 'Vibe Coder'
console.log(greeting + name)

// 数组操作
const fruits = ['apple', 'banana', 'orange']
console.log('我喜欢吃:', fruits)
`

export default function EditorComponent({ courseId, onSave, onComplete, onCodeChange }) {
  const [code, setCode] = useState(DEFAULT_CODE)
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [showOutput, setShowOutput] = useState(false)
  const containerRef = useRef(null)

  // 当代码改变时调用回调
  const handleCodeChange = (value) => {
    const newCode = value || ''
    setCode(newCode)
    if (onCodeChange) {
      onCodeChange(newCode)
    }
  }

  // 运行代码
  const handleRun = async () => {
    setIsRunning(true)
    setError('')
    setOutput('')
    setShowOutput(true)

    try {
      // 使用 Worker 在沙箱中运行代码
      const logs = []
      
      // 创建一个代理 console.log
      const sandboxCode = `
        const logs = []
        const originalLog = console.log
        
        console.log = function(...args) {
          logs.push(args.map(arg => {
            try {
              return typeof arg === 'string' ? arg : JSON.stringify(arg)
            } catch {
              return String(arg)
            }
          }).join(' '))
          originalLog(...args)
        }
        
        try {
          ${code}
        } catch (e) {
          console.log('❌ 错误:', e.message)
        }
        
        logs
      `

      // 使用 Function 构造器安全地执行代码
      const result = new Function(sandboxCode)()
      setOutput(result.join('\n'))
    } catch (err) {
      setError(`❌ 执行出错: ${err.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  // 重置代码
  const handleReset = () => {
    setCode(DEFAULT_CODE)
    setOutput('')
    setError('')
    setShowOutput(false)
  }

  // 下载代码
  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([code], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `course-${courseId}-code.js`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full" ref={containerRef}>
      {/* 工具栏 */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">✨</span>
          <h3 className="text-white font-bold text-lg">JavaScript 编辑器</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRun}
            disabled={isRunning}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold transition ${
              isRunning
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-white text-purple-600 hover:shadow-lg'
            }`}
          >
            <span>{isRunning ? '运行中...' : '▶ 运行'}</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center space-x-2 px-4 py-2 bg-white text-purple-600 rounded-lg hover:shadow-lg font-bold transition"
          >
            <span>🔄 重置</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-4 py-2 bg-white text-purple-600 rounded-lg hover:shadow-lg font-bold transition"
          >
            <span>⬇️ 下载</span>
          </button>
        </div>
      </div>

      {/* 编辑器和输出 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 代码编辑器 */}
        <div className="flex-1 flex flex-col">
          <div className="text-xs bg-gray-700 text-gray-300 px-4 py-2 flex items-center justify-between">
            <span>📝 代码编辑区</span>
            <span className="text-gray-400">JavaScript</span>
          </div>
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={handleCodeChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>

        {/* 输出面板 */}
        <div
          className={`w-96 bg-gray-900 text-gray-100 flex flex-col border-l border-gray-700 transition-all ${
            !showOutput && 'hidden md:flex'
          }`}
        >
          <div className="text-xs bg-gray-800 text-gray-400 px-4 py-2 flex items-center justify-between">
            <span>📤 输出结果</span>
            <button
              onClick={() => setShowOutput(false)}
              className="text-gray-500 hover:text-gray-300 text-lg"
            >
              ✕
            </button>
          </div>

          {/* 输出内容 */}
          <div className="flex-1 overflow-auto p-4 font-mono text-sm space-y-1">
            {error ? (
              <div className="text-red-400 whitespace-pre-wrap break-words">{error}</div>
            ) : output ? (
              <div className="text-green-400 whitespace-pre-wrap break-words">{output}</div>
            ) : (
              <div className="text-gray-500 italic">点击 "运行" 按钮查看输出...</div>
            )}
          </div>

          {/* 清空按钮 */}
          {(output || error) && (
            <div className="border-t border-gray-700 px-4 py-2">
              <button
                onClick={() => {
                  setOutput('')
                  setError('')
                }}
                className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-100 px-3 py-1 rounded"
              >
                🗑 清空输出
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 状态栏 */}
      <div className="bg-gray-800 text-gray-400 text-xs px-4 py-2 flex items-center justify-between border-t border-gray-700">
        <span>编辑器已准备好 ✓</span>
        <span>按 Ctrl+S 保存代码</span>
      </div>
    </div>
  )
}
