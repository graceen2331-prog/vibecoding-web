// backend/src/services/authService.js
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { Resend } from 'resend'
import prisma from '../lib/prisma.js'

// 初始化 Resend（如果配置了API Key）
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function sendMagicLink(email) {
  // 生成 token
  const token = jwt.sign(
    { email, type: 'magic_link' },
    process.env.MAGIC_LINK_SECRET || 'secret',
    { expiresIn: '15m' }
  )

  // 生成 Magic Link
  const magicLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/verify?token=${token}`

  // 发送邮件
  try {
    // 如果没有配置 Resend API Key，使用开发模式
    if (!resend) {
      console.log(`\n${'='.repeat(80)}`)
      console.log(`📧 Magic Link for ${email}:`)
      console.log(`${magicLink}`)
      console.log(`Token: ${token}`)
      console.log(`⚠️  RESEND_API_KEY 未配置，使用开发模式`)
      console.log(`${'='.repeat(80)}\n`)
      return { success: true, token }
    }

    // 使用 Resend 发送邮件
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Vibe Coding <onboarding@resend.dev>',
      to: [email],
      subject: '🎯 Vibe Coding - 你的登陆链接已就绪',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #667eea;">🚀 欢迎来到 Vibe Coding</h1>
          <p style="font-size: 16px; color: #333;">点击下方按钮，开始你的编程之旅：</p>
          <a href="${magicLink}" 
             style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; 
                    font-weight: bold; margin: 20px 0; font-size: 16px;">
            🔗 立即登陆
          </a>
          <p style="color: #666; font-size: 13px; margin-top: 30px;">
            或复制此链接到浏览器：<br/>
            <code style="background: #f5f5f5; padding: 8px; display: block; margin-top: 8px; word-break: break-all;">${magicLink}</code>
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            ⏰ 此链接 15 分钟后过期
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="color: #999; font-size: 11px;">
            如果你没有请求此链接，请忽略此邮件。
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend 发送失败:', error)
      throw new Error(error.message)
    }

    console.log(`✉️ Magic Link 已通过 Resend 发送到 ${email}`, data)
    return { success: true }
  } catch (error) {
    console.error('发送邮件失败:', error)
    throw new Error('无法发送邮件')
  }
}

export async function verifyMagicLink(token) {
  try {
    // 验证 token
    const decoded = jwt.verify(
      token,
      process.env.MAGIC_LINK_SECRET || 'secret'
    )

    if (decoded.type !== 'magic_link') {
      throw new Error('Invalid token type')
    }

    const email = decoded.email

    // 创建或获取用户
    let user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          username: email.split('@')[0], // 用邮箱前缀作为初始用户名
        },
      })
    }

    // 生成 JWT token
    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'jwt_secret',
      { expiresIn: '7d' }
    )

    return {
      success: true,
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    }
  } catch (error) {
    console.error('Token 验证失败:', error)
    throw new Error('Invalid or expired token')
  }
}

export async function getUserById(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      createdAt: true,
    },
  })
  return user
}
