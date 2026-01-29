// backend/src/services/authService.js
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import prisma from '../lib/prisma.js'

// 简单邮件配置（开发环境用 ethereal，生产用真实邮箱）
let transporter

async function initTransporter() {
  if (process.env.NODE_ENV === 'production') {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  } else {
    // 开发环境：创建测试账户
    const testAccount = await nodemailer.createTestAccount()
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })
  }
}

// 初始化
await initTransporter()

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
    // 开发模式：直接返回链接给日志（便于测试）
    if (process.env.NODE_ENV !== 'production') {
      console.log(`\n${'='.repeat(80)}`)
      console.log(`📧 Magic Link for ${email}:`)
      console.log(`${magicLink}`)
      console.log(`Token: ${token}`)
      console.log(`${'='.repeat(80)}\n`)
      return { success: true, token }
    }

    // 生产模式：发送真实邮件
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@vibecoding.io',
      to: email,
      subject: '🎯 Vibe Coding - 你的登陆链接已就绪',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>🚀 欢迎来到 Vibe Coding</h1>
          <p>点击下方按钮，开始你的编程之旅：</p>
          <a href="${magicLink}" 
             style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; 
                    font-weight: bold; margin: 20px 0;">
            🔗 立即登陆
          </a>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            或复制此链接：<br/>
            <code>${magicLink}</code>
          </p>
          <p style="color: #999; font-size: 12px;">
            此链接 15 分钟后过期。
          </p>
        </div>
      `,
      text: `点击链接登陆：${magicLink}`,
    })

    console.log(`✉️ Magic Link 已发送到 ${email}`)
    if (process.env.NODE_ENV !== 'production') {
      console.log(`📧 预览链接：${nodemailer.getTestMessageUrl(info)}`)
    }

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
