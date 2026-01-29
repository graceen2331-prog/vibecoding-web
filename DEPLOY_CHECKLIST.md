# 🚀 部署 Checklist

完成以下步骤即可将 Vibe Coding 部署到生产环境。

---

## 📋 部署前准备 (5分钟)

- [ ] **GitHub 账户**  
  创建账户：https://github.com/signup

- [ ] **Vercel 账户**  
  创建账户：https://vercel.com (用 GitHub 账户登陆)

- [ ] **Railway 账户**  
  创建账户：https://railway.app (用 GitHub 账户登陆)

- [ ] **生成安全密钥** (打开终端执行)
  ```bash
  # 生成 JWT Secret
  openssl rand -base64 32
  
  # 生成 Magic Link Secret  
  openssl rand -base64 32
  ```
  **保存这两个密钥，稍后需要**

---

## 🔧 第 1 步：推送代码到 GitHub (2分钟)

- [ ] 在 GitHub 创建新仓库 `vibecoding-web`
  
- [ ] 执行以下命令：
  ```bash
  cd /Users/zhishijiushililiang/project/vibecoding-web
  
  git remote add origin https://github.com/YOUR_USERNAME/vibecoding-web.git
  git branch -M main
  git push -u origin main
  ```
  
  **将 `YOUR_USERNAME` 替换为你的 GitHub 用户名**

- [ ] 验证代码已推送到 GitHub  
  访问：https://github.com/YOUR_USERNAME/vibecoding-web

---

## 🌐 第 2 步：部署前端到 Vercel (3分钟)

### 方法 A：自动部署 (推荐)

- [ ] 访问 https://vercel.com/new
  
- [ ] 导入你的 GitHub 仓库 `vibecoding-web`

- [ ] 配置项目：
  - Root Directory: `frontend`
  - Framework Preset: `Vite`

- [ ] 添加环境变量，点击 "Add Environment Variable"：
  ```
  VITE_API_URL = https://vibecoding-api.railway.app
  VITE_SUPABASE_URL = https://xwmwhfjjdehucvjdekto.supabase.co
  VITE_SUPABASE_ANON_KEY = sb_publishable_OfKwyBqFgwA-Dbo6OeZ61g_qLCTPlFj
  ```

- [ ] 点击 "Deploy"，等待部署完成 (通常 1-2 分钟)

- [ ] 获取前端 URL：  
  Vercel 会显示类似 `https://vibecoding.vercel.app`，**记录这个 URL**

- [ ] 验证前端：
  ```bash
  curl https://vibecoding.vercel.app | head -5
  ```

### 方法 B：使用 CLI
```bash
npm install -g vercel
vercel login
cd frontend
vercel --prod
```

---

## 🛠️ 第 3 步：部署后端到 Railway (2分钟)

- [ ] 访问 https://railway.app

- [ ] 新建项目：
  - 点击 "New Project"
  - 选择 "Deploy from GitHub"
  - 授权 GitHub
  - 选择 `vibecoding-web` 仓库
  - 选择部署根目录为 `backend`

- [ ] 等待初始部署 (1-2 分钟)

- [ ] 添加 PostgreSQL 数据库：
  - 在项目中点击 "+ Create"
  - 选择 "PostgreSQL"
  - 自动生成 DATABASE_URL

- [ ] 配置环境变量，点击 "Variables"，添加：
  ```
  NODE_ENV = production
  PORT = 3001
  
  # 从前面生成的密钥
  JWT_SECRET = [你生成的 JWT Secret]
  MAGIC_LINK_SECRET = [你生成的 Magic Link Secret]
  
  # 前端 URL (从 Vercel 复制)
  FRONTEND_URL = https://your-frontend.vercel.app
  CORS_ORIGIN = https://your-frontend.vercel.app
  ```
  **注意：替换 `your-frontend.vercel.app` 为实际的 Vercel 域名**

- [ ] 获取后端 API URL：
  - 进入 Railway 项目的 "Settings" → "Domains"
  - 复制自动生成的域名，如 `https://vibecoding-api.railway.app`
  - **记录这个 URL**

- [ ] 验证后端：
  ```bash
  curl https://vibecoding-api.railway.app/api/health
  ```
  应该返回：`{"status":"OK",...}`

---

## 🗄️ 第 4 步：初始化数据库 (2分钟)

在 Railway 仪表板中：

- [ ] 打开 "Shell" 标签

- [ ] 执行数据库迁移：
  ```bash
  cd backend
  npx prisma migrate deploy
  ```

- [ ] 导入初始数据：
  ```bash
  node scripts/seedCourses.js
  ```

- [ ] 验证数据：
  ```bash
  curl https://vibecoding-api.railway.app/api/courses | head -50
  ```
  应该看到 8 门课程

---

## 🔗 第 5 步：连接前后端 (1分钟)

- [ ] 更新前端环境变量：
  
  在 Vercel 仪表板中：
  - 项目 Settings → Environment Variables
  - 编辑 `VITE_API_URL`，改为你的 Railway API URL
  - 例如：`https://vibecoding-api.railway.app`

- [ ] 重新部署前端：
  - Vercel 会自动部署
  - 或手动触发：Settings → Deployments → Redeploy

---

## ✅ 验证部署 (2分钟)

### 测试前端
- [ ] 访问 https://your-frontend.vercel.app
- [ ] 应该看到登陆页面
- [ ] 输入邮箱，点击发送
- [ ] 检查后端日志看是否收到请求

### 测试 API
- [ ] 获取课程列表：
  ```bash
  curl https://api.railway.app/api/courses
  ```

- [ ] 获取成就：
  ```bash
  curl https://api.railway.app/api/achievements
  ```

- [ ] 测试健康检查：
  ```bash
  curl https://api.railway.app/api/health
  ```

### 端到端测试
- [ ] 访问前端 → 输入邮箱 → 查看后端日志中的 Magic Link
- [ ] 手动访问验证 URL → 应该登陆成功
- [ ] 看到课程列表 ✅

---

## 🎉 部署完成！

你的应用现在在线了！

| 组件 | URL |
|------|-----|
| 🌐 **前端** | `https://your-frontend.vercel.app` |
| 🔌 **API** | `https://api.railway.app` |
| 📊 **数据库** | Railway PostgreSQL (私有) |

---

## 📝 后续步骤

### 配置自定义域名 (可选)
- **前端**：Vercel Settings → Domains → Add Domain
- **后端**：Railway Settings → Networking → Add Custom Domain

### 配置邮件 (可选但推荐)
- 注册 SendGrid 账户
- 获取 API Key
- 在后端环境变量中配置 SMTP

### 启用监控 (可选)
- **错误追踪**：Sentry
- **分析**：PostHog  
- **日志**：Datadog

---

## 🆘 故障排查

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 前端加载失败 | Vercel 部署问题 | 检查 Vercel 构建日志 |
| API 连接失败 | CORS 或 URL 错误 | 检查 CORS_ORIGIN 和 VITE_API_URL |
| 数据库错误 | 迁移未运行 | 在 Railway 执行 prisma migrate deploy |
| 邮件未发送 | SMTP 未配置 | 检查后端日志中是否有打印的 Magic Link |

---

## 📞 需要帮助？

1. 查看 [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - 快速部署指南
2. 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) - 详细部署说明
3. 查看 [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - 项目概览

---

**预计总时间**：15-20 分钟  
**成本**：完全免费 (Vercel 和 Railway 都有免费配额)

🚀 **现在开始部署吧！**
