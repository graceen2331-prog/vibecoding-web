# 🆓 Vibe Coding 完全免费部署方案

> 本指南确保所有服务都使用免费套餐，零成本上线！

---

## 📊 免费资源总览

| 服务 | 平台 | 免费额度 | 用途 |
|------|------|----------|------|
| 前端托管 | Vercel | 100GB 带宽/月 | React 应用 |
| 后端托管 | Render | 750 小时/月 | Node.js API |
| 数据库 | Supabase | 500MB 存储 | PostgreSQL |
| 代码仓库 | GitHub | 无限制 | 版本控制 |

**总成本：$0/月** ✅

---

## 🏗️ 推荐架构

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Vercel (前端)  │────▶│  Render (后端)  │────▶│ Supabase (数据库)│
│    React App    │     │   Node.js API   │     │   PostgreSQL    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
     免费 ✅                 免费 ✅                 免费 ✅
```

---

## 📋 部署前准备

### 必需账户（全部免费注册）

- [ ] [GitHub](https://github.com) - 代码托管
- [ ] [Vercel](https://vercel.com) - 前端部署
- [ ] [Render](https://render.com) - 后端部署（⚠️ 比 Railway 更稳定的免费方案）
- [ ] [Supabase](https://supabase.com) - 数据库

### 为什么选择 Render 而不是 Railway？

| 对比项 | Render | Railway |
|--------|--------|---------|
| 免费额度 | 750 小时/月 | 5$/月 信用额度（有限） |
| 休眠策略 | 15分钟无活动休眠 | 类似 |
| 稳定性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 免费持久性 | 永久免费 | 额度用完需付费 |

---

## 🚀 部署步骤

### 第一步：推送代码到 GitHub

```bash
cd /Users/zhishijiushililiang/project/vibecoding-web

# 初始化 Git（如未初始化）
git init

# 添加所有文件
git add .
git commit -m "Initial commit: Vibe Coding Web App"

# 添加远程仓库（替换为你的用户名）
git remote add origin https://github.com/YOUR_USERNAME/vibecoding-web.git
git branch -M main
git push -u origin main
```

---

### 第二步：部署数据库到 Supabase（5分钟）

#### 2.1 创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com)
2. 点击 **Start your project**
3. 使用 GitHub 登录
4. 点击 **New project**
5. 填写信息：
   - **Name**: `vibecoding`
   - **Database Password**: 设置一个强密码（记住它！）
   - **Region**: 选择离你最近的区域
6. 点击 **Create new project**

#### 2.2 获取数据库连接字符串

1. 进入项目 Dashboard
2. 点击左侧 **Settings** → **Database**
3. 滚动到 **Connection string** 部分
4. 选择 **URI** 标签
5. 复制连接字符串，格式如下：

```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

**⚠️ 替换 `[YOUR-PASSWORD]` 为你设置的数据库密码**

#### 2.3 Supabase 免费额度

| 资源 | 免费额度 |
|------|----------|
| 数据库存储 | 500 MB |
| 带宽 | 2 GB/月 |
| API 请求 | 无限制 |
| 实时连接 | 200 并发 |

---

### 第三步：部署后端到 Render（10分钟）

#### 3.1 创建 Render 账户

1. 访问 [render.com](https://render.com)
2. 使用 GitHub 登录

#### 3.2 创建 Web Service

1. 点击 **New +** → **Web Service**
2. 连接你的 GitHub 仓库 `vibecoding-web`
3. 配置服务：

| 设置项 | 值 |
|--------|-----|
| **Name** | `vibecoding-api` |
| **Region** | Singapore (离中国最近) |
| **Root Directory** | `backend` |
| **Runtime** | Node |
| **Build Command** | `npm install && npx prisma generate` |
| **Start Command** | `npm start` |
| **Instance Type** | **Free** ✅ |

#### 3.3 配置环境变量

在 **Environment** 部分添加以下变量：

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
MAGIC_LINK_SECRET=your-magic-link-secret-at-least-32-characters
FRONTEND_URL=https://vibecoding.vercel.app
CORS_ORIGIN=https://vibecoding.vercel.app
```

**⚠️ 注意**：
- `DATABASE_URL` 替换为 Supabase 的连接字符串
- `JWT_SECRET` 和 `MAGIC_LINK_SECRET` 使用随机字符串（至少32位）
- `FRONTEND_URL` 稍后替换为实际的 Vercel 域名

#### 3.4 生成随机密钥

在终端运行以下命令生成安全的密钥：

```bash
# 生成 JWT_SECRET
openssl rand -base64 32

# 生成 MAGIC_LINK_SECRET
openssl rand -base64 32
```

#### 3.5 部署并运行迁移

1. 点击 **Create Web Service** 开始部署
2. 等待部署完成
3. 进入 **Shell** 标签
4. 运行数据库迁移：

```bash
npx prisma migrate deploy
node scripts/seedCourses.js
```

#### 3.6 获取后端 URL

部署完成后，你会得到一个 URL：
```
https://vibecoding-api.onrender.com
```

**记住这个 URL，下一步需要用到！**

---

### 第四步：部署前端到 Vercel（5分钟）

#### 4.1 使用 Vercel 网页部署

1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 登录
3. 点击 **Add New...** → **Project**
4. 导入 `vibecoding-web` 仓库
5. 配置项目：

| 设置项 | 值 |
|--------|-----|
| **Root Directory** | `frontend` |
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

#### 4.2 配置环境变量

在 **Environment Variables** 部分添加：

```env
VITE_API_URL=https://vibecoding-api.onrender.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**获取 Supabase 凭据**：
1. 进入 Supabase Dashboard
2. **Settings** → **API**
3. 复制 **Project URL** 和 **anon public** key

#### 4.3 部署

点击 **Deploy** 按钮，等待部署完成。

你会得到一个 URL：
```
https://vibecoding.vercel.app
```

---

### 第五步：更新跨域配置（重要！）

回到 Render 更新后端环境变量：

1. 进入 Render Dashboard
2. 选择 `vibecoding-api` 服务
3. **Environment** → 编辑以下变量：

```env
FRONTEND_URL=https://vibecoding.vercel.app
CORS_ORIGIN=https://vibecoding.vercel.app
```

4. 点击 **Save Changes**
5. 服务会自动重新部署

---

## ✅ 验证部署

### 检查后端健康状态

```bash
curl https://vibecoding-api.onrender.com/api/health
```

预期响应：
```json
{"status":"OK","message":"Vibe Coding Backend is running"}
```

### 检查前端

访问 `https://vibecoding.vercel.app`，应该能看到登录页面。

### 端到端测试

1. 打开前端 URL
2. 输入邮箱登录
3. 查看后端日志获取 Magic Link（开发模式）
4. 验证课程列表是否正常显示

---

## 💡 免费方案优化技巧

### 防止 Render 服务休眠

免费服务 15 分钟无活动会休眠。使用以下方法保持活跃：

#### 方法 1：使用 Cron-job.org（推荐）

1. 访问 [cron-job.org](https://cron-job.org)
2. 创建免费账户
3. 添加新任务：
   - **URL**: `https://vibecoding-api.onrender.com/api/health`
   - **间隔**: 每 10 分钟

#### 方法 2：使用 UptimeRobot

1. 访问 [uptimerobot.com](https://uptimerobot.com)
2. 创建免费账户
3. 添加监控：
   - **Monitor Type**: HTTP(s)
   - **URL**: `https://vibecoding-api.onrender.com/api/health`
   - **Interval**: 5 minutes

---

## 🔧 常见问题解决

### 问题 1：CORS 错误

**症状**：前端控制台显示跨域错误

**解决方案**：
1. 确保后端 `CORS_ORIGIN` 设置正确
2. 检查是否包含 `https://`
3. 重新部署后端

### 问题 2：数据库连接失败

**症状**：API 返回数据库错误

**解决方案**：
1. 检查 Supabase 连接字符串
2. 确保密码中的特殊字符已 URL 编码
3. 检查 Supabase 项目是否暂停（免费项目 7 天不活跃会暂停）

### 问题 3：首次请求很慢

**原因**：Render 免费服务休眠后冷启动需要 30-60 秒

**解决方案**：
1. 使用 Cron-job 保持活跃
2. 在前端添加加载提示

### 问题 4：Supabase 项目暂停

**原因**：免费项目 7 天不活跃会自动暂停

**解决方案**：
1. 登录 Supabase Dashboard
2. 点击 **Restore project**
3. 使用 Cron-job 定期访问 API 保持活跃

---

## 📈 免费额度监控

### Vercel
- Dashboard → Usage 查看带宽使用

### Render
- Dashboard → 选择服务 → Metrics 查看使用情况

### Supabase
- Dashboard → Settings → Usage 查看存储和带宽

---

## 🎯 部署清单

```
✅ 完成部署检查清单：

[ ] 1. 代码已推送到 GitHub
[ ] 2. Supabase 数据库已创建
[ ] 3. 数据库连接字符串已获取
[ ] 4. Render 后端已部署
[ ] 5. 数据库迁移已运行
[ ] 6. 课程数据已播种
[ ] 7. Vercel 前端已部署
[ ] 8. 环境变量已正确配置
[ ] 9. CORS 已配置正确
[ ] 10. 健康检查通过
[ ] 11. Cron-job 已设置（可选）
```

---

## 🔗 部署后的服务地址

| 服务 | URL |
|------|-----|
| 🌐 前端 | https://vibecoding.vercel.app |
| 🔌 后端 API | https://vibecoding-api.onrender.com |
| 🗄️ 数据库 | Supabase Dashboard |
| 📊 监控 | Render/Vercel Dashboard |

---

## 💰 成本总结

| 服务 | 月费用 |
|------|--------|
| Vercel | $0 |
| Render | $0 |
| Supabase | $0 |
| GitHub | $0 |
| Cron-job.org | $0 |
| **总计** | **$0/月** ✅ |

---

## 🚨 免费方案限制

| 平台 | 限制 | 影响 |
|------|------|------|
| Render | 750 小时/月 | 足够单服务 24/7 运行 |
| Render | 15分钟休眠 | 首次访问较慢 |
| Supabase | 500MB 存储 | 足够小型应用 |
| Supabase | 7天暂停 | 需保持活跃 |
| Vercel | 100GB 带宽 | 足够中等流量 |

---

**🎉 恭喜！你的应用现在完全免费运行！**

有问题请查看各平台文档或提交 Issue。
