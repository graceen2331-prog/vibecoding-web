// frontend/src/pages/VerifyPage.jsx
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

export default function VerifyPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { verifyToken, isLoading, error } = useAuthStore()
  const [message, setMessage] = useState('正在验证...')

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get('token')

      if (!token) {
        setMessage('❌ 缺少验证 token')
        setTimeout(() => navigate('/login'), 2000)
        return
      }

      try {
        setMessage('⏳ 正在验证你的链接...')
        await verifyToken(token)
        setMessage('✅ 验证成功！即将跳转...')
        setTimeout(() => navigate('/'), 1500)
      } catch (err) {
        setMessage(
          error || '❌ 链接已过期或无效，请重新登陆'
        )
        setTimeout(() => navigate('/login'), 3000)
      }
    }

    verify()
  }, [searchParams, verifyToken, error, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="text-6xl mb-4 animate-bounce">⚙️</div>
        <p className="text-2xl font-bold mb-2">{message}</p>
      </div>
    </div>
  )
}
