# 博客文章HTML模板

## 完整HTML结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- SEO 基础 -->
    <title>文章标题</title>
    <meta name="description" content="文章简短描述">
    <meta name="keywords" content="阳子, 加里, Gally, 铳梦, 赛博朋克, 博客">
    <meta name="author" content="阳子 (Yoko)">
    <meta name="robots" content="index, follow">
    
    <!-- Open Graph -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="文章标题">
    <meta property="og:description" content="文章简短描述">
    <meta property="og:url" content="https://118.145.99.224/posts/文章文件名.html">
    <meta property="og:image" content="https://118.145.99.224/public/images/加里.webp">
    <meta property="og:locale" content="zh_CN">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="文章标题">
    <meta name="twitter:description" content="文章简短描述">
    <meta name="twitter:image" content="https://118.145.99.224/public/images/加里.webp">
    
    <!-- Canonical -->
    <link rel="canonical"=" href="https://118.145.99.224/posts/文章文件名.html">
    
    <!-- CSS样式表 -->
    <link rel="stylesheet" href="../style.min.css">
    <link rel="stylesheet" href="../css/cyberpunk-effects.css">
    
    <!-- 标准导航栏组件 -->
    <script src="../js/header-component.js" data-auto-inject="true"></script>
    
    <!-- 文章内联CSS（从 css/blog-article-template.css 复制） -->
    <style>
        /* 完整复制 blog-article-template.css 的内容 */
    </style>
</head>

<body>
    <!-- 导航栏（自动注入） -->
    
    <main>
        <div class="container">
            <article class="article-content">
                <h1>文章标题</h1>
                
                <!-- 标准元数据 -->
                <div class="article-meta">
                    <p>📅 发布日期：2026年2月21日</p>
                    <p>⏱️ 阅读时间：约15分钟</p>
                    <p>📖 字数：约3000字</p>
                    <p>👤 作者：阳子</p>
                    <p>🏷️ 标签：标签1，标签2</p>
                </div>
                
                <!-- 文章正文 -->
                <p>文章内容...</p>
                
            </article>
        </div>
    </main>
    
    <!-- 页脚组件 -->
    <script src="../js/footer-component.js" data-auto-inject="true"></script>
</body>
</html>
```

## 组件说明

### Header组件
**文件**：`js/header-component.js`  
**使用方法**：
```html
<!-- 方法1：自动注入 -->
<script src="../js/header-component.js" data-auto-inject="true"></script>

<!-- 方法2：手动容器 -->
<div id="header-component"></div>
<script src="../js/header-component.js"></script>
```

### Footer组件
**文件**：`js/footer-component.js`  
**使用方法**：
```html
<!-- 方法1：自动注入 -->
<script src="../js/footer-component.js" data-auto-inject="true"></script>

<!-- 方法2：手动容器 -->
<div id="footer-component"></div>
<script src="../js/footer-component.js"></script>
```

## 优势

1. **避免代码重复** - 所有文章共用一个header/footer
2. **易于维护** - 修改一次，所有页面生效
3. **自动注入** - 不需要手动添加HTML
4. **响应式** - 包含移动端菜单切换
5. **SEO友好** - 组件在页面加载后注入，不影响SEO爬虫

## 注意事项

1. **组件位置** - 必须在正确的位置引入
   - Header：在 `<head>` 中引入，自动注入到 `<body>` 开始
   - Footer：在 `</body>` 之前引入，自动注入到末尾

2. **路径相对性** - 组件中的链接使用 `../` 相对路径
   - 确保从 posts/ 目录正确返回根目录

3. **依赖关系** - 组件需要 `style.min.css` 的样式支持
   - 确保在组件之前引入CSS样式表

## 更新现有文章

```bash
# 方法1：手动替换
# 在每个文章中：
# 1. 删除 <header>...</header> 标签
# 2. 在 <head> 中添加：<script src="../js/header-component.js" data-auto-inject="true"></script>
# 3. 删除 <footer>...</footer> 标签
# 4. 在 </body> 之前添加：<script src="../js/footer-component.js" data-auto-inject="true"></script>

# 方法2：使用脚本（待开发）
python3 scripts/update-articles-to-components.py
```

## 未来改进

1. **静态站点生成器** - 使用Eleventy、Hugo等工具管理组件
2. **服务端包含（SSI）** - Nginx SSI动态插入组件
3. **模板系统** - 开发更强大的模板系统
