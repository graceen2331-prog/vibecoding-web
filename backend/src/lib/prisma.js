// backend/src/lib/prisma.js
import { PrismaClient } from '@prisma/client'

// 在 serverless 环境中避免 prepared statement 问题
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error', 'warn'],
    errorFormat: 'minimal',
  })
}

// 使用全局变量在开发环境中缓存 Prisma 实例
const globalForPrisma = globalThis

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
