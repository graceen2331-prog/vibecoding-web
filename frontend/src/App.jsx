import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import VerifyPage from './pages/VerifyPage'
import HomePage from './pages/HomePage'
import CoursePage from './pages/CoursePage'
import { useAuthStore } from './store/useAuthStore'

export default function App() {
  const { token, user, fetchCurrentUser, isLoading } = useAuthStore()
  const [initialized, setInitialized] = useState(false)

  // 初始化：检查本地 token
  useEffect(() => {
    const init = async () => {
      if (token && !user) {
        try {
          await fetchCurrentUser()
        } catch (error) {
          console.log('无法获取用户信息，可能 token 已过期')
        }
      }
      setInitialized(true)
    }

    init()
  }, [token, user, fetchCurrentUser])

  if (!initialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4 animate-pulse">🚀</div>
          <p className="text-xl">Vibe Coding 正在启动...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        {/* 认证路由 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/verify" element={<VerifyPage />} />

        {/* 保护的路由 */}
        {token && user ? (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/course/:courseId" element={<CoursePage />} />
          </>
        ) : (
          <Route path="/" element={<Navigate to="/login" replace />} />
        )}

        {/* 默认重定向 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}
