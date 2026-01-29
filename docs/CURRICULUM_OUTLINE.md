# Vibe Coding MVP 课程内容框架

## 课程 1：你好，JavaScript

### 学习目标
- 理解什么是变量
- 学会使用 console.log() 输出信息
- 运行第一行代码

### 讲义内容
```
欢迎来到 Vibe Coding！

在这节课中，你将学到：
1. 什么是编程？编程就是教计算机做事情
2. 什么是变量？变量是存放信息的容器
3. 如何输出信息？使用 console.log()

让我们开始吧！
```

### 代码框架
```javascript
// 第 1 步：创建一个变量
let name = "你";

// 第 2 步：输出欢迎信息
console.log("你好，" + name + "！");
console.log("欢迎来到 Vibe Coding");

// 任务：修改 name 变量，改成你的名字，然后运行看看！
```

### 练习任务
- [ ] 修改 name 变量为你的名字
- [ ] 点击"运行"看输出结果
- [ ] 成功！🎉

### 预期输出
```
你好，小王！
欢迎来到 Vibe Coding
```

---

## 课程 2：数字的世界

### 学习目标
- 理解数字类型
- 学会基本的数学运算
- 制作一个简单计算器

### 讲义内容
```
计算机不仅能处理文字，还特别擅长处理数字！

在这节课中：
1. 认识数字类型（整数和小数）
2. 学习基本运算：+ - * /
3. 做一个简单计算器
```

### 代码框架
```javascript
// 定义两个数字
let num1 = 10;
let num2 = 5;

// 加法
let sum = num1 + num2;
console.log(num1 + " + " + num2 + " = " + sum);

// 减法
let difference = num1 - num2;
console.log(num1 + " - " + num2 + " = " + difference);

// 乘法
let product = num1 * num2;
console.log(num1 + " × " + num2 + " = " + product);

// 除法
let quotient = num1 / num2;
console.log(num1 + " ÷ " + num2 + " = " + quotient);

// 任务：改变 num1 和 num2 的值，看看计算结果如何变化
```

### 练习任务
- [ ] 修改 num1 和 num2
- [ ] 运行并查看计算结果
- [ ] 理解数学运算

### 预期输出
```
10 + 5 = 15
10 - 5 = 5
10 × 5 = 50
10 ÷ 5 = 2
```

---

## 课程 3：判断与选择

### 学习目标
- 理解条件判断（if/else）
- 学会比较操作符（>、<、===）
- 实现成绩评级系统

### 讲义内容
```
有时候，程序需要根据不同的情况做出不同的决定。
这就是"条件判断"的作用！

在这节课中：
1. if 语句：如果...就...
2. if...else：如果...就...，否则...
3. 比较操作符：> < == ===
```

### 代码框架
```javascript
// 输入一个分数
let score = 85;

// 判断等级
if (score >= 90) {
    console.log("成绩：A（优秀）");
} else if (score >= 80) {
    console.log("成绩：B（良好）");
} else if (score >= 70) {
    console.log("成绩：C（及格）");
} else {
    console.log("成绩：D（不及格）");
}

// 任务：修改 score，试试看不同分数的评级结果
```

### 练习任务
- [ ] 尝试不同的分数
- [ ] 观察评级如何变化
- [ ] 理解条件判断逻辑

### 预期输出（分数为 85）
```
成绩：B（良好）
```

---

## 课程 4：重复的力量

### 学习目标
- 理解循环概念
- 掌握 for 循环语法
- 使用循环重复执行代码

### 讲义内容
```
如果你需要重复做同一件事情 100 次，写 100 行代码吗？
不！我们可以用"循环"来解决！

在这节课中：
1. for 循环：重复执行代码
2. 循环变量 i
3. 循环条件
```

### 代码框架
```javascript
// 循环打印 1 到 10
console.log("开始倒数：");

for (let i = 1; i <= 10; i = i + 1) {
    console.log(i);
}

console.log("发射！🚀");

// 任务：修改循环条件，试试打印 1 到 20，或者 1 到 5
```

### 练习任务
- [ ] 运行代码看输出
- [ ] 修改循环终点（从 10 改成其他数字）
- [ ] 理解循环如何工作

### 预期输出
```
开始倒数：
1
2
3
...
10
发射！🚀
```

---

## 课程 5：函数的魔力

### 学习目标
- 理解函数概念
- 学会定义和调用函数
- 理解参数和返回值

### 讲义内容
```
函数是可重复使用的代码块。
把常用的代码打包成一个函数，可以随时使用！

在这节课中：
1. 函数定义
2. 函数调用
3. 参数和返回值
```

### 代码框架
```javascript
// 定义一个函数：计算正方形面积
function calculateArea(side) {
    let area = side * side;
    return area;
}

// 调用函数
let area1 = calculateArea(5);
console.log("边长为 5 的正方形面积：" + area1);

let area2 = calculateArea(10);
console.log("边长为 10 的正方形面积：" + area2);

// 任务：创建一个新函数来计算圆的面积
// 公式：π × r²（提示：使用 Math.PI）
```

### 练习任务
- [ ] 运行现有代码
- [ ] 尝试调用函数时改变参数
- [ ] 理解函数的重用性

### 预期输出
```
边长为 5 的正方形面积：25
边长为 10 的正方形面积：100
```

---

## 课程 6：列表与集合

### 学习目标
- 理解数组（列表）概念
- 学会创建和操作数组
- 使用循环遍历数组

### 讲义内容
```
有时候，我们需要存放多个相关的数据。
这就是"数组"的作用 - 它像一个容器，可以装很多东西！

在这节课中：
1. 创建数组
2. 访问数组元素
3. 遍历数组
```

### 代码框架
```javascript
// 创建一个购物清单
let shoppingList = ["苹果", "香蕉", "牛奶", "面包"];

console.log("我的购物清单：");

// 使用循环遍历数组
for (let i = 0; i < shoppingList.length; i = i + 1) {
    console.log((i + 1) + ". " + shoppingList[i]);
}

// 添加新项目
shoppingList.push("糖果");
console.log("\n添加糖果后：");
console.log(shoppingList);

// 任务：添加更多物品到购物清单
```

### 练习任务
- [ ] 运行代码
- [ ] 修改购物清单内容
- [ ] 添加新项目到列表

### 预期输出
```
我的购物清单：
1. 苹果
2. 香蕉
3. 牛奶
4. 面包

添加糖果后：
苹果,香蕉,牛奶,面包,糖果
```

---

## 课程 7：字符串变魔术

### 学习目标
- 理解字符串操作
- 学会字符串方法
- 操作和转换文本

### 讲义内容
```
文本（字符串）在编程中非常重要。
JavaScript 提供了很多方法来操作字符串！

在这节课中：
1. 字符串连接
2. 字符串长度
3. 字符串方法（大小写、包含等）
```

### 代码框架
```javascript
let text = "Hello World";

// 获取字符串长度
console.log("长度：" + text.length);

// 转换为大写
console.log("大写：" + text.toUpperCase());

// 转换为小写
console.log("小写：" + text.toLowerCase());

// 替换文字
let newText = text.replace("World", "JavaScript");
console.log("替换后：" + newText);

// 检查是否包含某个单词
if (text.includes("World")) {
    console.log("✅ 文本包含 'World'");
}

// 任务：修改文本，看看各种操作如何工作
```

### 练习任务
- [ ] 运行代码
- [ ] 修改原始文本
- [ ] 尝试不同的字符串操作

### 预期输出
```
长度：11
大写：HELLO WORLD
小写：hello world
替换后：Hello JavaScript
✅ 文本包含 'World'
```

---

## 课程 8：综合项目 - 互动小作品

### 学习目标
- 综合应用前 7 课的所有概念
- 完成一个完整的、可交互的小应用
- 学会分享你的作品

### 项目选项

#### 选项 A：交互式冒险游戏
```javascript
// 一个简单的文字冒险游戏
// 根据用户输入（通过 prompt）讲述故事

let playerName = prompt("你叫什么名字？");
console.log("欢迎，" + playerName + "！");
console.log("你发现自己在一个神秘的森林里...\n");

let choice = prompt("你看到两条路：\n1. 左边的绿色小路\n2. 右边的黑暗森林\n\n选择 1 或 2？");

if (choice === "1") {
    console.log("\n✨ 你选择了绿色小路");
    console.log("你发现了一个友好的小仙子！");
    console.log("她邀请你去她的魔法森林冒险...");
} else if (choice === "2") {
    console.log("\n🌙 你选择了黑暗森林");
    console.log("你遇到了一位智慧的老巫师");
    console.log("他答应教你魔法...");
} else {
    console.log("\n❌ 无效选择，游戏结束");
}

// 任务：扩展这个游戏，添加更多路径和故事！
```

#### 选项 B：个性化成绩分析工具
```javascript
// 学生成绩分析和建议系统

let studentName = prompt("你的名字是？");
let scores = [];
let subjects = ["数学", "英语", "物理", "化学"];

console.log(studentName + " 的成绩分析\n");

// 输入每个科目的分数
for (let i = 0; i < subjects.length; i++) {
    let score = prompt("请输入 " + subjects[i] + " 的分数：");
    scores.push(parseInt(score));
}

// 计算平均分
let total = 0;
for (let i = 0; i < scores.length; i++) {
    total = total + scores[i];
}
let average = total / scores.length;

// 分析和建议
console.log("\n--- 成绩报告 ---");
for (let i = 0; i < subjects.length; i++) {
    let score = scores[i];
    let status = "";
    
    if (score >= 90) {
        status = "⭐ 优秀！继续保持";
    } else if (score >= 80) {
        status = "👍 良好，有进步空间";
    } else if (score >= 70) {
        status = "📚 及格，需要加强";
    } else {
        status = "⚠️ 需要重点关注";
    }
    
    console.log(subjects[i] + ": " + score + " 分 " + status);
}

console.log("\n平均分：" + average.toFixed(2));

if (average >= 85) {
    console.log("🏆 总体表现优秀！你是班级中的佼佼者");
} else if (average >= 75) {
    console.log("💪 总体表现良好，再加油就能进入优秀行列");
}
```

#### 选项 C：动态艺术生成器
```javascript
// 根据参数生成不同的 ASCII 艺术

function drawSquare(size, char) {
    for (let i = 0; i < size; i++) {
        let line = "";
        for (let j = 0; j < size; j++) {
            line = line + char;
        }
        console.log(line);
    }
}

function drawTriangle(height, char) {
    for (let i = 1; i <= height; i++) {
        let line = "";
        for (let j = 0; j < i; j++) {
            line = line + char;
        }
        console.log(line);
    }
}

console.log("🎨 ASCII 艺术生成器\n");

// 生成正方形
console.log("--- 正方形 ---");
drawSquare(5, "█");

console.log("\n--- 三角形 ---");
drawTriangle(5, "▲");

// 任务：创建更多图案！
```

### 项目要求
- ✅ 使用前 7 课学到的所有概念
- ✅ 包含至少 1 个函数
- ✅ 包含至少 1 个循环
- ✅ 包含至少 1 个条件判断
- ✅ 代码能成功运行
- ✅ 输出结果清晰易懂

### 完成后
- 获得"全能开发者"徽章 🎖️
- 生成分享链接
- 邀请朋友体验你的作品
- 获得社区反馈

---

## 课程交付格式

每课包含：
1. **讲义** (Markdown)
2. **视频讲解** (5-10 分钟)
3. **代码框架** (预填充、可运行)
4. **练习任务** (清单形式)
5. **进度追踪** (自动记录完成状态)

---

## 课程难度递进

```
课程 1-2: 基础概念导入（变量、数据、运算）
课程 3-5: 核心逻辑构建（条件、循环、函数）
课程 6-7: 数据处理深化（数组、字符串）
课程 8:   综合应用与创造（独立项目）
```

---

## 教学理念

✨ **友好、鼓励的基调**
- 错误提示用"再试试"而不是"错误"
- 强调进步而不是失败
- 每一步都有成就感

🎯 **即时反馈**
- 代码一键运行
- 实时看到结果
- 明确知道是否成功

🚀 **快速成就**
- 30 秒内运行第一行代码
- 8 课后完成实际项目
- 课程结束就能分享给朋友

---

**注意**：所有课程内容需要进一步完善、美化和本地化。视频需要专业录制。
