# Vibe Coding - 项目文件结构

## 目录说明

```
vibecoding-web/
├── docs/                          # 项目文档
│   ├── PRODUCT_SPECIFICATION.md   # 产品规划文档
│   ├── DEVELOPMENT_ROADMAP.md     # 开发任务与排期
│   ├── API_SPECIFICATION.md       # API 设计文档 (待)
│   └── DATABASE_SCHEMA.md         # 数据库设计 (待)
│
├── frontend/                      # React 前端项目
│   ├── src/
│   │   ├── components/            # React 组件
│   │   │   ├── CourseEditor/      # 编辑器组件
│   │   │   ├── Dashboard/         # 学习仪表板
│   │   │   ├── CourseContent/     # 课程内容展示
│   │   │   └── Achievement/       # 成就系统 UI
│   │   ├── pages/                 # 页面组件
│   │   │   ├── HomePage.jsx       # 首页/课程列表
│   │   │   ├── CoursePage.jsx     # 课程详情页
│   │   │   ├── DashboardPage.jsx  # 仪表板页
│   │   │   └── ProjectSharePage.jsx # 项目分享页
│   │   ├── hooks/                 # 自定义 Hook
│   │   ├── services/              # API 调用
│   │   │   └── api.js             # API 客户端
│   │   ├── store/                 # 状态管理 (Zustand/Redux)
│   │   ├── styles/                # 全局样式 (Tailwind)
│   │   ├── utils/                 # 工具函数
│   │   └── App.jsx                # 应用入口
│   ├── public/                    # 静态资源
│   ├── vite.config.js             # Vite 配置
│   ├── tailwind.config.js         # Tailwind 配置
│   ├── package.json
│   └── README.md
│
├── backend/                       # Express 后端项目
│   ├── src/
│   │   ├── controllers/           # 业务逻辑
│   │   │   ├── authController.js
│   │   │   ├── courseController.js
│   │   │   ├── userController.js
│   │   │   ├── achievementController.js
│   │   │   └── projectController.js
│   │   ├── routes/                # 路由
│   │   │   ├── auth.js
│   │   │   ├── courses.js
│   │   │   ├── user.js
│   │   │   └── projects.js
│   │   ├── models/                # 数据库模型
│   │   │   ├── User.js
│   │   │   ├── Course.js
│   │   │   └── Achievement.js
│   │   ├── middleware/            # 中间件
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── services/              # 业务服务
│   │   │   ├── authService.js
│   │   │   ├── courseService.js
│   │   │   └── achievementService.js
│   │   ├── config/                # 配置文件
│   │   │   └── database.js
│   │   └── app.js                 # Express 应用
│   ├── migrations/                # 数据库迁移
│   ├── seeds/                     # 数据库种子数据
│   ├── .env.example               # 环境变量示例
│   ├── package.json
│   └── README.md
│
├── scripts/                       # 工具脚本
│   ├── setup.sh                   # 初始化脚本
│   ├── seed-courses.js            # 初始化课程数据
│   └── deploy.sh                  # 部署脚本
│
├── .github/                       # GitHub 配置
│   └── workflows/                 # CI/CD 工作流
│       ├── test.yml
│       └── deploy.yml
│
├── .env.example                   # 环境变量示例 (项目级)
├── .gitignore
├── package.json                   # 项目根 package.json
├── README.md                      # 项目主文档
└── LICENSE                        # MIT 许可证
```

## 🚀 快速开始 (10 天快速开发模式)

### 1. 初始化项目
```bash
cd vibecoding-web

# 运行初始化脚本（自动安装依赖、创建文件夹）
bash scripts/setup.sh
```

### 2. 环境变量配置
✅ 已完成 `.env.local` 和 `.env` 的配置

### 3. 启动开发服务器
```bash
npm run dev
```

**访问地址：**
- 前端：http://localhost:5173
- 后端：http://localhost:3001

### 开发流程
1. 使用 **Cursor** 或 **Claude** 生成代码
2. 复制生成的代码到相应文件
3. 运行开发服务器，实时查看效果
4. 遇到问题询问 AI 调试

📚 **详细规划**：查看 [DEVELOPMENT_ROADMAP_FAST.md](docs/DEVELOPMENT_ROADMAP_FAST.md) (10 天快速路线)

## 技术栈详情

### 前端
- **框架**：React 18+
- **打包工具**：Vite
- **样式**：Tailwind CSS
- **代码编辑器**：Monaco Editor / CodeMirror
- **代码运行**：WebContainers (StackBlitz SDK)
- **状态管理**：Zustand 或 Redux
- **HTTP 客户端**：Axios
- **路由**：React Router v6

### 后端
- **运行时**：Node.js 18+
- **框架**：Express.js
- **数据库**：PostgreSQL + Supabase
- **ORM**：Prisma / TypeORM
- **认证**：Magic Link + OAuth (GitHub)
- **验证**：Zod / Joi
- **日志**：Winston / Pino
- **环境管理**：dotenv

### DevOps
- **前端部署**：Vercel 或 Netlify
- **后端部署**：Railway 或 Heroku
- **数据库**：Supabase (PostgreSQL)
- **分析**：PostHog
- **CI/CD**：GitHub Actions

## 核心模块说明

### 1. CourseEditor (编辑器模块)
负责代码编辑、执行和输出显示。
- 集成 WebContainers 运行 JavaScript
- 实时代码验证
- 鼓励性错误提示

### 2. Achievement (成就系统)
管理用户成就、徽章和进度。
- 课程完成后自动解锁成就
- 进度可视化
- 里程碑跟踪

### 3. CourseContent (课程内容)
8 节 JavaScript 课程，包含：
- 讲义和代码框架
- 视频讲解
- 交互式练习

### 4. ProjectShare (项目分享)
课程 8 完成后生成可分享的项目链接。
- 分享链接生成
- 公开项目展示
- 社交分享集成

## API 路由概览

```
GET  /api/auth/login              # Magic Link 登陆
POST /api/auth/verify             # 验证 Token

GET  /api/courses                 # 获取课程列表
GET  /api/courses/:id             # 获取课程详情
POST /api/courses/:id/complete    # 标记课程完成

GET  /api/user/profile            # 用户信息
GET  /api/user/progress           # 学习进度

GET  /api/achievements            # 获取成就列表
POST /api/code/validate           # 代码验证

POST /api/projects                # 创建项目分享
GET  /api/projects/:id            # 获取项目详情
GET  /api/projects/:id/share      # 分享链接
```

详细 API 文档见：`docs/API_SPECIFICATION.md` (待编写)

## 数据库设计

关键表：
- `users` - 用户表
- `courses` - 课程表
- `user_progress` - 学习进度
- `achievements` - 成就定义
- `user_achievements` - 用户成就
- `shared_projects` - 分享的项目

详细设计见：`docs/DATABASE_SCHEMA.md` (待编写)

## 开发规范

### 代码风格
- 使用 ESLint + Prettier
- 遵循 Airbnb JavaScript 风格指南

### 提交规范
```
feat: 新功能
fix: 修复 BUG
docs: 文档更新
style: 代码风格调整
refactor: 代码重构
test: 测试相关
chore: 构建/依赖更新
```

### 分支管理
- `main` - 生产分支
- `develop` - 开发分支
- `feature/*` - 功能分支
- `bugfix/*` - 修复分支

## 贡献指南

1. 创建 feature 分支
2. 实现功能并添加测试
3. 提交 Pull Request
4. 通过 CI/CD 检查后合并

## 许可证

MIT License

## 联系方式

- 项目管理：[Notion Link (待)]
- 沟通群：[Discord/Slack (待)]
- 问题反馈：GitHub Issues
