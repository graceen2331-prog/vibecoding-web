// backend/src/lib/prisma.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['error', 'warn'],
  errorFormat: 'minimal',
})

// 添加连接错误处理
prisma.$connect().catch((e) => {
  console.warn('⚠️ Prisma初始连接失败，将在首次查询时重试:', e.message)
})

export default prisma
