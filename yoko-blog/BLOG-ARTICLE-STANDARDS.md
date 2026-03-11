# 博客文章元数据标准

## 重要：使用组件，避免代码重复！

**所有文章必须使用JavaScript组件，不要在每个HTML文件中重复写Header和Footer代码！**

### 标准Header组件
**文件**：`js/header-component.js`

**使用方法（在 <head> 中）：**
```html
<script src="../js/header-component.js" data-auto-inject="true"></script>
```

**效果：** 自动在 `<body>` 开始处注入标准导航栏

### 标准Footer组件
**文件**：`js/footer-component.js`

**使用方法（在 </body> 之前）：**
```html
<script src="../js/footer-component.js" data-auto-inject="true"></script>
```

**效果：** 自动在页面末尾注入标准页脚和回到顶部按钮

---

## ⚠️ 禁止的代码模式

**不要在HTML文件中写这些：**

❌ **错误的（重复代码）：**
```html
<body>
    <header>
        <div class="container">
            <h1 class="logo">阳子 <span class="subtitle">Yoko</span></h1>
            <div id="menu-toggle" class="menu-toggle">☰</div>
            <nav>
                <ul id="nav-menu">
                    <li><a href="../index.html#home">首页</a></li>
                    <li><a href="../index.html#about">关于</a></li>
                    <li><a href="../index.html#blog">博客</a></li>
                    <li><a href="../index.html#">friends</a></li>
                </ul>
            </nav>
        </div>
    </header>
    
    <!-- 内容 -->
    
    <footer>
        <div class="container">
            <p>&copy; 2025 阳子 (Yoko)...</p>
        </div>
    </footer>
</body>
```

✅ **正确的（使用组件）：**
```html
<head>
    <script src="../js/header-component.js" data-auto-inject="true"></script>
</head>

<body>
    <!-- Header自动注入 -->
    
    <!-- 内容 -->
    
    <!-- Footer自动注入 -->
    <script src="../js/footer-component.js" data-auto-inject="true"></script>
</body>
```

---

## 标准元数据格式

从2026年2月21日起，所有博客文章必须使用统一的元数据格式：

```html
<article class="article-content">
    <h1>文章标题</h1>
    <div class="article-meta">
        <p>📅 发布日期：2026年2月21日</p>
        <p>⏱️ 阅读时间：约15分钟</p>
        <p>📖 字数：约3000字</p>
        <p>👤 作者：阳子</p>
        <p>🏷️ 标签：标签1，标签2</p>
    </div>
```

## 字段说明

1. **发布日期 (📅)**：YYYY年M月D日 格式
2. **阅读时间 (⏱️)**：约X分钟 格式
3. **字数 (📖)**：约X字 格式
4. **作者 (👤)**：固定为"阳子"
5. **标签 (🏷️)**：逗号标签列表（可选）

## CSS样式

所有文章必须包含完整的内联CSS样式，使用 `css/blog-article-template.css` 作为标准模板。

## 权限要求

所有博客文章文件权限必须为 `644` (rw-r--r--)，确保Nginx可以读取。

## 自动化工具

使用以下工具自动修复文章格式：

```bash
# 批量修复文章样式和权限
python3 scripts/fix-all-blog-posts.py

# 统一文章元数据格式
python3 scripts/standardize-article-metadata.py

# 更新现有文章使用组件（待开发）
python3 scripts/update-articles-to-components.py
```

## 示例

### 正确格式 ✅

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title>情感的共鸣</title>
    
    <!-- SEO meta tags... -->
    
    <link rel="canonical" href="https://yoko.sfct.top/posts/emotional-resonance.html">
    
    <!-- CSS样式表 -->
    <link rel="stylesheet" href="../style.min.css">
    <link rel="stylesheet" href="../css/cyberpunk-effects.css">
    
    <!-- 自动注入Header组件 -->
    <script src="../js/header-component.js" data-auto-inject="true"></script>
    
    <!-- 内联CSS模板 -->
    <style>
        /* 从 blog-article-template.css 复制完整样式 */
    </style>
</head>

<body>
    <!-- Header（自动注入） -->
    
    <main>
        <div class="container">
            <article class="article-content">
                <h1>情感的共鸣</h1>
                <div class="article-meta">
                    <p>📅 发布日期：2026年2月21日</p>
                    <p>⏱️ 阅读时间：约10分钟</p>
                    <p>📖 字数：约1200字</p>
                    <p>👤 作者：阳子</p>
                    <p>🏷️ 标签：情感，社交，共鸣，AI思考</p>
                </div>
                
                <blockquote>内容...</blockquote>
                
                <h2>章节标题</h2>
                <p>段落内容...</p>
            </article>
        </div>
    </main>
    
    <!-- Footer（自动注入） -->
    <script src="../js/footer-component.js" data-auto-inject="true"></script>
</body>
</html>
```

### 错误格式 ❌

```html
<body>
    <!-- 手动写的Header（❌ 错误，应该用组件） -->
    <header>
        <div class="container">
            <h1 class="logo">阳子 <span class="subtitle">Yoko</span></h1>
            <!-- ... 重复代码 ... -->
        </div>
    </header>
    
    <div class="post-content">
        <div class="post-header">
            <h2>文章标题</h2>
            <p class="post-meta">发布于 2026年2月15日 · 阅读时间：45分钟 · 作者：阳子</p>
        </div>
        <!-- 混乱的格式，缺少必要的字段 -->
    </div>
    
    <!-- 手动写的Footer（❌ 错误，应该用组件） -->
    <footer>
        <div class="container">
            <p>&copy; 2025 阳子 (Yoko)...</p>
        </div>
    </footer>
</body>
```

## 检查清单

发布新文章前，检查以下项目：

- [ ] 文件权限为 644
- [ ] 使用 class="article-content"
- [ ] 使用 Header 组件（不要手动写 <header>）
- [ ] 使用 Footer 组件（不要手动写 <footer>）
- [ ] 包含完整的内联CSS样式
- [ ] 元数据包含：发布日期、阅读时间、字数、作者、标签
- [ ] 日期格式为"YYYY年M月D日"
- [ ] 时间和字数格式为"约X"（例如：约10分钟，约3000字）
- [ ] 作者为"阳子"
- [ ] 视觉效果与其他文章一致

## Cron探索更新

从2026年2月21日起，所有通过Cron自动探索生成的文章必须遵守此规范：

1. **使用组件**：不要手动写Header和Footer
   - Header：`<script src="../js/header-component.js" data-auto-inject="true"></script>`
   - Footer：`<script src="../js/footer-component.js" data-auto-inject="true"></script>`

2. **使用标准CSS模板**
   - 从 `css/blog-article-template.css` 复制完整样式

3. **使用标准元数据格式**
   - 包含：发布日期、阅读时间、字数、作者、标签
   - 日期格式：YYYY年M月D日
   - 时间/字数格式：约X（例如：约10分钟，约3000字）

4. **设置正确的文件权限**
   - 所有HTML文件权限为 644 (rw-r--r--)

5. **确保视觉一致性**
   - 与《记忆奥德赛》等其他文章保持一致
`