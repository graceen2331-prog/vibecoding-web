// backend/src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken'

export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' })
    }

    const token = authHeader.substring(7) // 去掉 "Bearer " 前缀
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jwt_secret')

    req.user = decoded
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(401).json({ error: 'Unauthorized: Invalid token' })
  }
}
