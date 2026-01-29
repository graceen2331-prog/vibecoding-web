# 🚀 Vibe Coding 快速部署指南（5分钟上线）

## 📋 前置条件

你需要：
- [ ] GitHub 账户 (免费)
- [ ] Vercel 账户 (免费) - https://vercel.com
- [ ] Railway 账户 (免费) - https://railway.app
- [ ] 本项目代码已提交到 GitHub

---

## 🔥 部署步骤（按顺序执行）

### 步骤 1️⃣：将代码推送到 GitHub (2分钟)

```bash
# 创建 GitHub 仓库后，执行：
cd /Users/zhishijiushililiang/project/vibecoding-web

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/vibecoding-web.git
git branch -M main
git push -u origin main
```

**替换 `YOUR_USERNAME` 为你的 GitHub 用户名**

---

### 步骤 2️⃣：部署前端到 Vercel (2分钟)

#### 方式 A：使用 Vercel CLI (推荐快速)
```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 从前端目录部署
cd frontend
vercel --prod
```

#### 方式 B：使用 Vercel 网页界面
1. 访问 https://vercel.com/new
2. 导入 GitHub 仓库
3. 选择 `frontend` 目录作为根目录
4. 点击部署

#### 配置前端环境变量

在 Vercel 仪表板中，进入项目 Settings → Environment Variables，添加：

```
VITE_API_URL=https://vibecoding-api.railway.app
VITE_SUPABASE_URL=https://xwmwhfjjdehucvjdekto.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_OfKwyBqFgwA-Dbo6OeZ61g_qLCTPlFj
```

**重新部署以应用环境变量**

---

### 步骤 3️⃣：部署后端到 Railway (1分钟)

1. 访问 https://railway.app
2. 点击 "New Project"
3. 选择 "Deploy from GitHub"
4. 授权 GitHub 并选择你的仓库
5. 选择 `backend` 目录
6. 点击部署

#### 配置后端环境变量

在 Railway 仪表板中，进入项目 → Variables，添加：

```
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:password@host/vibecoding
JWT_SECRET=your-very-long-random-secret-key-here-at-least-32-chars
MAGIC_LINK_SECRET=your-magic-link-secret-at-least-32-chars
FRONTEND_URL=https://your-vercel-app.vercel.app
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

**关键：将 `your-vercel-app.vercel.app` 替换为你的 Vercel 域名**

---

### 步骤 4️⃣️：配置数据库 (1分钟)

#### 选项 A：使用 Railway 内置 PostgreSQL（推荐）

在 Railway 项目中：
1. 点击 "+ Create" → PostgreSQL
2. 自动生成 DATABASE_URL
3. 复制 DATABASE_URL 到环境变量中

#### 选项 B：使用 Supabase PostgreSQL

1. 访问 https://supabase.com
2. 创建新项目
3. 获取连接字符串
4. 设置为 DATABASE_URL

---

### 步骤 5️⃣️：运行数据库迁移 (1分钟)

在 Railway 终端中执行：

```bash
# 进入项目
cd backend

# 运行迁移
npx prisma migrate deploy

# 播种初始数据
node scripts/seedCourses.js
```

或者在 Railway 仪表板的 Shell 中执行

---

## ✅ 验证部署

### 检查前端
访问你的 Vercel 域名：
```
https://vibecoding.vercel.app
```

应该看到登陆页面 ✅

### 检查后端
```bash
curl https://vibecoding-api.railway.app/api/health
```

应该返回：
```json
{"status":"OK","message":"Vibe Coding Backend is running"}
```

### 端到端测试
1. 打开前端 URL
2. 输入邮箱
3. 应该能看到课程列表 ✅

---

## 🔗 部署后的 URLs

| 服务 | URL |
|------|-----|
| 前端 | `https://vibecoding.vercel.app` |
| 后端 API | `https://vibecoding-api.railway.app` |
| 首页 | `https://vibecoding.vercel.app` |
| 登陆 | `https://vibecoding.vercel.app/login` |

---

## 🚨 常见问题排查

### 问题 1：CORS 错误
**症状**：前端无法调用后端 API  
**解决**：
1. 检查后端的 `CORS_ORIGIN` 环境变量
2. 确保设置为你的 Vercel 域名
3. 重新部署后端

### 问题 2：数据库连接失败
**症状**：无法加载课程列表  
**解决**：
1. 验证 `DATABASE_URL` 是否正确
2. 检查数据库防火墙允许连接
3. 运行迁移：`npx prisma migrate deploy`

### 问题 3：邮件发送失败
**症状**：登陆时无法发送 Magic Link  
**解决**：
- 在开发环境查看后端日志中打印的 Magic Link
- 在生产环境配置 SMTP 服务器（SendGrid、AWS SES 等）

### 问题 4：部署卡住
**解决**：
- Railway/Vercel 日志查看部署进度
- 检查 package.json 中的 build 脚本
- 确保依赖安装成功

---

## 📊 部署完成后

### 配置域名 (可选)
```bash
# Vercel
访问 Settings → Domains → Add Domain
输入你的域名（例如 vibecoding.app）

# Railway  
访问 Settings → Networking → Add Custom Domain
输入 API 域名（例如 api.vibecoding.app）
```

### 监控应用
- **Vercel**：Dashboard → Deployments 查看日志
- **Railway**：Dashboard → Monitoring 查看性能

### 启用 HTTPS
- Vercel 和 Railway 都自动启用 HTTPS ✅

---

## 🎉 完成！

你的应用现在上线了！🚀

**分享链接**：https://vibecoding.vercel.app

下一步可以：
1. 邀请朋友测试
2. 配置自定义域名
3. 添加分析和错误追踪
4. 持续优化和添加功能

---

## 📞 技术支持

遇到问题？
1. 查看错误日志：Vercel/Railway 仪表板
2. 检查 `.env` 文件中的环境变量
3. 确保数据库迁移成功运行
4. 查看 [DEPLOYMENT.md](../DEPLOYMENT.md) 了解详细信息

---

**部署时间**：约 5-10 分钟  
**成本**：完全免费（Vercel 和 Railway 都有免费配额）
