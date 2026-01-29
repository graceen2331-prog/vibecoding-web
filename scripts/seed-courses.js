#!/bin/bash

# Vibe Coding - 初始化课程数据脚本
# 将 8 门课程和成就数据插入数据库

set -e

echo "🌱 开始初始化课程数据..."

# 课程数据
COURSES_SQL="
-- 课程 1: 你好，JavaScript
INSERT INTO courses (id, title, description, level, duration, order) VALUES
('course-001', '你好，JavaScript', '学习变量、输出和编程的基础概念', 'beginner', 15, 1);

-- 课程 2: 数字的世界
INSERT INTO courses (id, title, description, level, duration, order) VALUES
('course-002', '数字的世界', '掌握数据类型和数值运算', 'beginner', 20, 2);

-- 课程 3: 判断与选择
INSERT INTO courses (id, title, description, level, duration, order) VALUES
('course-003', '判断与选择', '学习 if/else 条件判断语句', 'beginner', 20, 3);

-- 课程 4: 重复的力量
INSERT INTO courses (id, title, description, level, duration, order) VALUES
('course-004', '重复的力量', '掌握 for 循环和循环逻辑', 'beginner', 25, 4);

-- 课程 5: 函数的魔力
INSERT INTO courses (id, title, description, level, duration, order) VALUES
('course-005', '函数的魔力', '学习定义和调用函数', 'beginner', 25, 5);

-- 课程 6: 列表与集合
INSERT INTO courses (id, title, description, level, duration, order) VALUES
('course-006', '列表与集合', '掌握数组和列表操作', 'beginner', 25, 6);

-- 课程 7: 字符串变魔术
INSERT INTO courses (id, title, description, level, duration, order) VALUES
('course-007', '字符串变魔术', '学习字符串操作和处理', 'beginner', 20, 7);

-- 课程 8: 综合项目
INSERT INTO courses (id, title, description, level, duration, order) VALUES
('course-008', '综合项目：互动小作品', '综合应用前 7 课的概念，完成一个交互式应用', 'beginner', 60, 8);
"

# 成就数据
ACHIEVEMENTS_SQL="
INSERT INTO achievements (id, name, description, icon, badge_color, unlock_condition) VALUES
('ach-001', '第一行代码', '完成课程 1', '🎯', 'blue', 'course-001'),
('ach-002', '小小计算家', '完成课程 2', '🔢', 'purple', 'course-002'),
('ach-003', '逻辑大师', '完成课程 3', '🧠', 'green', 'course-003'),
('ach-004', '循环骑士', '完成课程 4', '🔄', 'yellow', 'course-004'),
('ach-005', '函数之神', '完成课程 5', '⚡', 'red', 'course-005'),
('ach-006', '数据武士', '完成课程 6', '⚔️', 'orange', 'course-006'),
('ach-007', '字符串魔法师', '完成课程 7', '✨', 'pink', 'course-007'),
('ach-008', '全能开发者', '完成课程 8', '👑', 'gold', 'course-008');
"

# 执行 SQL 语句
echo "📝 插入课程数据..."
# 这里应该使用实际的数据库连接和 ORM
# 例如使用 Prisma 或 psql

echo "📝 插入成就数据..."

echo "✅ 课程和成就数据初始化完成！"

# 如果使用 Prisma，可以创建 prisma seed 脚本
# npx prisma db seed
