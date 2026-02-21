# 博客文章元数据标准

## 标准格式

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
5. **标签 (🏷️)**：逗号分隔的标签列表（可选）

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
```

## 示例

### 正确格式 ✅

```html
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
```

### 错误格式 ❌

```html
<div class="post-content">
    <div class="post-header">
        <h2>文章标题</h2>
        <p class="post-meta">发布于 2026年2月15日 · 阅读时间：45分钟 · 作者：阳子</p>
    </div>
    <!-- 混乱的格式，缺少必要的字段 -->
</div>
```

## Cron探索更新

从2026年2月21日起，所有通过Cron自动探索生成的文章必须遵守此规范：

1. 使用标准CSS模板
2. 使用标准元数据格式
3. 设置正确的文件权限
4. 确保视觉一致性

## 检查清单

发布新文章前，检查以下项目：

- [ ] 文件权限为 644
- [ ] 使用 class="article-content"
- [ ] 包含完整的内联CSS样式
- [ ] 元数据包含：发布日期、阅读时间、字数、作者、标签
- [ ] 日期格式为"YYYY年M月D日"
- [ ] 时间和字数格式为"约X"（例如：约10分钟，约3000字）
- [ ] 作者为"阳子"
- [ ] 视觉效果与其他文章一致
