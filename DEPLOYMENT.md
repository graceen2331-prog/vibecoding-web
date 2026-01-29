# Vibe Coding 部署指南

## 快速开始

### 本地开发

```bash
# 后端
cd backend
npm install
npm run dev  # 运行在 http://localhost:3001

# 前端 (新终端)
cd frontend
npm install
npm run dev  # 运行在 http://localhost:5173
```

## 生产部署

### 前端 - Vercel 部署

1. **推送到 GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git push -u origin main
```

2. **在 Vercel 上导入项目**
   - 访问 https://vercel.com
   - 导入 GitHub 仓库
   - 选择 `frontend` 目录作为根目录
   - 设置环境变量：
     - `VITE_API_URL`: 后端 API URL（例如 https://vibecoding-api.railway.app）
     - `VITE_SUPABASE_URL`: 你的 Supabase URL
     - `VITE_SUPABASE_ANON_KEY`: 你的 Supabase 匿名密钥

3. **部署**
   - Vercel 会自动部署，每次 push 到 main 分支都会触发

### 后端 - Railway 部署

1. **在 Railway 上创建新项目**
   - 访问 https://railway.app
   - 创建新项目
   - 选择"从 GitHub 部署"

2. **配置环境变量**
   在 Railway 仪表板中设置：
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret_key
   MAGIC_LINK_SECRET=your_magic_link_secret
   FRONTEND_URL=https://your-vercel-app.vercel.app
   CORS_ORIGIN=https://your-vercel-app.vercel.app
   ```

3. **数据库配置**
   - 使用 Railway 内置的 PostgreSQL（推荐），或
   - 连接到 Supabase PostgreSQL

4. **运行迁移**
   - 在 Railway 终端中运行：
   ```bash
   npx prisma migrate deploy
   node scripts/seedCourses.js
   ```

5. **部署**
   - Railway 会自动部署，每次 push 都会触发

## 环境变量配置

### 前端 (.env)
```dotenv
VITE_API_URL=https://vibecoding-api.railway.app
VITE_APP_URL=https://vibecoding.vercel.app
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 后端 (.env)
```dotenv
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:password@host:5432/vibecoding
FRONTEND_URL=https://vibecoding.vercel.app
CORS_ORIGIN=https://vibecoding.vercel.app
JWT_SECRET=your_very_long_random_secret_key
MAGIC_LINK_SECRET=your_magic_link_secret
```

## 故障排查

### CORS 错误
- 检查后端 `.env` 中的 `CORS_ORIGIN` 是否与前端 URL 匹配
- 确保前端发送的请求使用正确的 API URL

### 数据库连接失败
- 验证 `DATABASE_URL` 是否正确
- 确保数据库可以从你的部署平台访问
- 检查防火墙规则

### 邮件发送失败
- 在生产环境中配置真实的 SMTP 服务器（SendGrid、AWS SES等）
- 更新 `authService.js` 中的邮件配置

## 监控和日志

- **Vercel**: 在仪表板的"Deployments"标签中查看日志
- **Railway**: 在项目的"Monitoring"标签中查看日志

## 下一步

1. 配置域名指向 Vercel/Railway
2. 设置 HTTPS 证书（自动完成）
3. 配置 CDN 加速
4. 设置 CI/CD 流程
5. 添加错误追踪（Sentry）
6. 添加分析（PostHog）
