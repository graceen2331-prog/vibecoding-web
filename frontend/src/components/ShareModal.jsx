// frontend/src/components/ShareModal.jsx
import { useState } from 'react'
import { projectAPI } from '../services/api'

export default function ShareModal({ isOpen, courseId, code, onClose }) {
  const [shareUrl, setShareUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    setLoading(true)
    try {
      const response = await projectAPI.shareProject({
        courseId,
        code,
        title: `我完成了课程 ${courseId}`,
      })
      setShareUrl(response.data.shareUrl)
    } catch (error) {
      console.error('分享失败:', error)
      alert('分享失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('复制失败:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">📤 分享你的作品</h2>

        {!shareUrl ? (
          <>
            <p className="text-gray-600 mb-6">
              生成一个分享链接，让其他人看到你的代码和成果！
            </p>
            <button
              onClick={handleShare}
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold text-white transition ${
                loading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg'
              }`}
            >
              {loading ? '生成中...' : '🔗 生成分享链接'}
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-600 mb-4">✅ 分享链接已生成！</p>
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <code className="text-sm text-gray-700 break-all">{shareUrl}</code>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleCopy}
                className={`w-full py-3 rounded-lg font-bold transition ${
                  copied
                    ? 'bg-green-600 text-white'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {copied ? '✅ 已复制！' : '📋 复制链接'}
              </button>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=看看我在 Vibe Coding 上的作品！`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 bg-blue-400 text-white rounded-lg font-bold text-center hover:bg-blue-500 transition"
              >
                𝕏 分享到 Twitter
              </a>
            </div>
          </>
        )}

        <button
          onClick={onClose}
          className="w-full mt-6 py-2 text-gray-600 hover:text-gray-900 font-semibold"
        >
          关闭
        </button>
      </div>
    </div>
  )
}
