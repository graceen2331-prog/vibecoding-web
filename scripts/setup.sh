#!/bin/bash

# Vibe Coding - 项目初始化脚本

set -e

echo "🚀 开始初始化 Vibe Coding 项目..."

# 检查 Node.js 版本
if ! command -v node &> /dev/null; then
    echo "❌ 错误：Node.js 未安装。请先安装 Node.js 18+。"
    exit 1
fi

echo "✅ Node.js 已安装：$(node --version)"

# 创建前端项目
echo ""
echo "📦 初始化前端项目..."
cd frontend

if [ ! -d "node_modules" ]; then
    npm install
    echo "✅ 前端依赖安装完成"
else
    echo "⏭️  前端依赖已存在，跳过安装"
fi

# 创建必要的文件夹
mkdir -p src/{components,pages,hooks,services,store,styles,utils}
mkdir -p src/components/{CourseEditor,Dashboard,CourseContent,Achievement}
mkdir -p public

# 复制 .env 文件（如果不存在）
if [ ! -f ".env.local" ]; then
    cp ../.env.example .env.local
    echo "📝 前端 .env.local 已创建，请编辑以配置 API 地址"
fi

cd ..

# 创建后端项目
echo ""
echo "📦 初始化后端项目..."
cd backend

if [ ! -d "node_modules" ]; then
    npm install
    echo "✅ 后端依赖安装完成"
else
    echo "⏭️  后端依赖已存在，跳过安装"
fi

# 创建必要的文件夹
mkdir -p src/{controllers,routes,models,middleware,services,config,utils}
mkdir -p migrations seeds

# 复制 .env 文件（如果不存在）
if [ ! -f ".env" ]; then
    cp ../.env.example .env
    echo "📝 后端 .env 已创建，请编辑以配置数据库连接"
fi

cd ..

# 创建脚本文件夹中的 .gitkeep（确保文件夹存在）
touch scripts/.gitkeep

echo ""
echo "✅ 项目初始化完成！"
echo ""
echo "📋 下一步步骤："
echo "1. 编辑前端 frontend/.env.local，配置 VITE_API_URL"
echo "2. 编辑后端 backend/.env，配置数据库连接和认证密钥"
echo "3. 运行 'npm run dev' 启动开发服务器"
echo ""
echo "📚 更多信息请查看 README.md 和 docs/ 目录"
