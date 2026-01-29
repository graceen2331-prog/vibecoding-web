# Vibe Coding - 前端项目初始化

## 项目设置步骤

### 1. 创建 React + Vite 项目
```bash
npm create vite@latest . -- --template react
npm install
```

### 2. 安装核心依赖

#### UI & 样式
```bash
npm install tailwindcss postcss autoprefixer
npm install clsx
npx tailwindcss init -p
```

#### 编辑器与代码运行
```bash
npm install @monaco-editor/react
npm install @stackblitz/sdk
npm install xterm xterm-addon-fit  # 终端输出
```

#### 状态管理 & 网络
```bash
npm install zustand axios
npm install react-router-dom
```

#### 分析
```bash
npm install posthog-js
```

#### 开发工具
```bash
npm install --save-dev eslint prettier eslint-config-prettier
npm install --save-dev tailwind-styled-components
```

### 3. Tailwind 配置
编辑 `tailwind.config.js`：
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        success: '#10b981',
        warning: '#f59e0b',
      },
    },
  },
  plugins: [],
}
```

### 4. Vite 配置
编辑 `vite.config.js` 以优化编辑器加载。

### 5. 文件夹结构创建
```bash
mkdir -p src/{components,pages,hooks,services,store,styles,utils}
mkdir -p src/components/{CourseEditor,Dashboard,CourseContent,Achievement}
```

### 6. 环境变量
复制 `.env.example` 到 `.env.local`，填入你的 API URL。

### 7. 启动开发服务器
```bash
npm run dev
```

访问：http://localhost:5173

## 项目依赖列表

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.x.x",
    "@monaco-editor/react": "^4.x.x",
    "@stackblitz/sdk": "^1.x.x",
    "zustand": "^4.x.x",
    "axios": "^1.x.x",
    "posthog-js": "^1.x.x",
    "clsx": "^2.x.x",
    "xterm": "^5.x.x"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.x.x",
    "vite": "^4.x.x",
    "tailwindcss": "^3.x.x",
    "postcss": "^8.x.x",
    "eslint": "^8.x.x",
    "prettier": "^3.x.x"
  }
}
```

## 关键文件模板

### src/App.jsx
```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CoursePage from './pages/CoursePage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/course/:id" element={<CoursePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
```

### src/services/api.js
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
});

// 添加 token 到请求头
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### src/store/useUserStore.js
```javascript
import { create } from 'zustand';

export const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

## 下一步

1. 编写登陆页面组件
2. 集成 WebContainers 编辑器
3. 创建课程页面布局
4. 实现成就仪表板
5. 添加分析埋点

详见：`DEVELOPMENT_ROADMAP.md`
