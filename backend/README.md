# Vibe Coding - 后端项目初始化

## 项目设置步骤

### 1. 初始化 Node.js 项目
```bash
npm init -y
```

### 2. 安装核心依赖

#### Web 框架 & 中间件
```bash
npm install express cors dotenv helmet
npm install express-async-errors
```

#### 数据库
```bash
npm install pg
npm install prisma @prisma/client
npm install -D @types/node
```

#### 认证 & 安全
```bash
npm install jsonwebtoken bcrypt nodemailer
npm install magic-link  # 或自实现
npm install axios  # 用于 OAuth
```

#### 验证 & 数据处理
```bash
npm install zod
npm install joi  # 或选择 zod
```

#### 日志 & 监控
```bash
npm install winston
npm install posthog  # 后端分析
```

#### 开发工具
```bash
npm install --save-dev nodemon
npm install --save-dev eslint prettier
npm install --save-dev jest supertest  # 测试
```

### 3. 项目结构创建
```bash
mkdir -p src/{controllers,routes,models,middleware,services,config,utils}
mkdir -p migrations seeds
```

### 4. 环境变量
复制 `.env.example` 到 `.env`，填入数据库连接信息和 API 密钥。

### 5. TypeScript 配置 (可选但推荐)
```bash
npm install --save-dev typescript ts-node @types/express @types/node
npx tsc --init
```

编辑 `tsconfig.json`：
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

### 6. Prisma 数据库设置
```bash
npx prisma init
```

编辑 `.env`，填入 `DATABASE_URL`。

编辑 `prisma/schema.prisma`，定义数据模型。

```bash
# 创建数据库
npx prisma migrate dev --name init
```

### 7. 启动开发服务器
```bash
npm run dev
```

服务器将运行在：http://localhost:3001

## 项目依赖列表

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "helmet": "^7.0.0",
    "pg": "^8.11.0",
    "@prisma/client": "^5.x.x",
    "jsonwebtoken": "^9.0.0",
    "bcrypt": "^5.1.0",
    "nodemailer": "^6.9.0",
    "axios": "^1.6.0",
    "zod": "^3.x.x",
    "winston": "^3.10.0",
    "posthog": "^2.x.x"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "prisma": "^5.x.x",
    "eslint": "^8.x.x",
    "prettier": "^3.x.x",
    "jest": "^29.x.x",
    "supertest": "^6.x.x",
    "typescript": "^5.x.x",
    "ts-node": "^10.x.x"
  }
}
```

## 关键文件模板

### src/app.js
```javascript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';

import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courses.js';
import userRoutes from './routes/user.js';
import projectRoutes from './routes/projects.js';

const app = express();

// 中间件
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/user', userRoutes);
app.use('/api/projects', projectRoutes);

// 错误处理
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
```

### src/config/database.js
```javascript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
```

### prisma/schema.prisma
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String?
  createdAt DateTime @default(now())
  
  progress  UserProgress[]
  achievements UserAchievement[]
  projects  SharedProject[]
}

model UserProgress {
  id        String   @id @default(cuid())
  userId    String
  courseId  String
  status    String   @default("not_started")
  codeSubmission String?
  completedAt DateTime?
  
  user   User   @relation(fields: [userId], references: [id])
}

model Achievement {
  id        String   @id @default(cuid())
  name      String
  description String?
  icon      String?
  
  users  UserAchievement[]
}

model UserAchievement {
  id        String   @id @default(cuid())
  userId    String
  achievementId String
  unlockedAt DateTime @default(now())
  
  user   User   @relation(fields: [userId], references: [id])
  achievement Achievement @relation(fields: [achievementId], references: [id])
}

model SharedProject {
  id        String   @id @default(cuid())
  userId    String
  courseId  String
  projectData Json
  shareToken String   @unique
  createdAt DateTime @default(now())
  
  user   User   @relation(fields: [userId], references: [id])
}
```

### src/controllers/authController.js
```javascript
import prisma from '../config/database.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export async function sendMagicLink(email) {
  // 生成 token
  const token = jwt.sign({ email }, process.env.MAGIC_LINK_SECRET, {
    expiresIn: process.env.MAGIC_LINK_EXPIRES_IN || '15m'
  });
  
  // 发送邮件 (实现邮件发送逻辑)
  // ...
  
  return { success: true };
}

export async function verifyMagicLink(token) {
  try {
    const decoded = jwt.verify(token, process.env.MAGIC_LINK_SECRET);
    
    // 创建或获取用户
    let user = await prisma.user.findUnique({
      where: { email: decoded.email }
    });
    
    if (!user) {
      user = await prisma.user.create({
        data: { email: decoded.email }
      });
    }
    
    // 生成 JWT
    const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
    
    return { token: jwtToken, user };
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}
```

### src/middleware/auth.js
```javascript
import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
```

### src/routes/courses.js
```javascript
import express from 'express';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// 获取课程列表
router.get('/', async (req, res) => {
  // 实现逻辑
});

// 获取课程详情
router.get('/:id', async (req, res) => {
  // 实现逻辑
});

// 标记课程完成
router.post('/:id/complete', authMiddleware, async (req, res) => {
  // 实现逻辑
});

export default router;
```

## npm 脚本

编辑 `package.json`：
```json
{
  "scripts": {
    "dev": "nodemon src/index.js",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "lint": "eslint src"
  },
  "type": "module"
}
```

## 下一步

1. 完成 Prisma 数据模型设计
2. 实现认证 API (Magic Link)
3. 实现课程管理 API
4. 实现成就系统后端逻辑
5. 添加代码验证逻辑
6. 实现项目分享功能

详见：`DEVELOPMENT_ROADMAP.md`

## 部署

### 使用 Railway 部署
1. 连接 GitHub 仓库
2. 添加 PostgreSQL 插件
3. 配置环境变量
4. 自动部署

### 使用 Heroku 部署
```bash
heroku create vibecoding-api
heroku addons:create heroku-postgresql:standard-0
git push heroku main
```
