// frontend/src/pages/LoginPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const { sendMagicLink, isLoading, error } = useAuthStore()
  const [email, setEmail] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [testToken, setTestToken] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email.trim()) {
      return
    }

    try {
      const response = await sendMagicLink(email)
      // 保存测试 token（开发环境）
      if (response?.testToken) {
        setTestToken(response.testToken)
      }
      setShowSuccess(true)
      
      // 2 秒后显示检查邮箱提示
      setTimeout(() => {
        // 保持在登陆页，让用户等待邮件
      }, 2000)
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl mb-2">🚀</h1>
          <h2 className="text-3xl font-bold text-white mb-2">Vibe Coding</h2>
          <p className="text-purple-100">
            {showSuccess ? '✨ 检查你的邮箱' : '30 秒学会编程'}
          </p>
        </div>

        {/* 登陆卡片 */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {!showSuccess ? (
            <>
              <p className="text-gray-600 text-center mb-6">
                输入邮箱，我们会发送登陆链接到你的邮箱
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="你的邮箱"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition"
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                    <p className="text-red-700 text-sm">❌ {error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className={`w-full py-3 rounded-lg font-bold text-white transition ${
                    isLoading || !email.trim()
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg'
                  }`}
                >
                  {isLoading ? '📧 发送中...' : '🔗 发送登陆链接'}
                </button>
              </form>

              <p className="text-gray-500 text-xs text-center mt-6">
                我们不会与任何人分享你的邮箱 🔒
              </p>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">📧</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                检查你的邮箱！
              </h3>
              <p className="text-gray-600 mb-6">
                我们已经发送了登陆链接到：
              </p>
              <p className="font-bold text-purple-600 mb-6 break-all">
                {email}
              </p>
              
              {/* 开发环境：显示 Magic Link */}
              {testToken && import.meta.env.MODE === 'development' && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-6 text-left">
                  <p className="text-sm font-bold text-green-700 mb-3">
                    ✨ 开发模式：Magic Link 已生成
                  </p>
                  <div className="bg-white p-3 rounded border border-green-200 mb-3 max-h-20 overflow-y-auto">
                    <code className="text-xs text-gray-700 break-all">
                      {testToken}
                    </code>
                  </div>
                  <button
                    onClick={() => {
                      const verifyUrl = `/auth/verify?token=${testToken}`
                      window.location.href = verifyUrl
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-bold text-sm mb-2"
                  >
                    🎯 直接验证 Token
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(testToken)
                      alert('已复制到剪贴板')
                    }}
                    className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded font-bold text-sm"
                  >
                    📋 复制 Token
                  </button>
                </div>
              )}
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6 text-left">
                <p className="text-sm text-gray-700">
                  💡 <strong>提示：</strong>
                </p>
                <ul className="text-sm text-gray-700 mt-2 space-y-1 ml-4">
                  <li>• 检查垃圾邮件文件夹</li>
                  <li>• 链接将在 15 分钟后过期</li>
                  <li>• 如果没收到，再试一次</li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setShowSuccess(false)
                  setTestToken(null)
                }}
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                🔄 换个邮箱重试
              </button>
            </div>
          )}
        </div>

        {/* 底部说明 */}
        <div className="text-center mt-8 text-purple-100">
          <p className="text-sm">
            🎓 Join 10,000+ learners on their coding journey
          </p>
        </div>
      </div>
    </div>
  )
}
