# 博客管理技能

一键同步博客列表、所有文章页面和 sitemap。

---

## 功能

这个技能提供3个自动化脚本来管理博客网站：

1. **generate-sitemap.py** - 自动生成 sitemap.xml
   - 扫描 posts/ 目录下的所有文章
   - 包含所有主页面（index, all-posts, ghost-chatroom等）
   - 自动提取文件修改时间作为 lastmod

2. **generate-all-posts.py** - 自动生成 all-posts.html
   - 扫描 posts/ 目录下的所有 HTML 文件
   - 自动提取标题、日期、摘要
   - 按日期排序（新的在前）
   - 使用标题映射处理旧格式文章

3. **update-index-blog-list.py** - 更新 index.html 博客列表
   - 只更新首页的博客列表部分
   - 显示最新的6篇文章
   - 保留其他内容不变

4. **oneforall.sh** - 一键同步脚本
   - 依次执行以上3个脚本
   - 带有进度显示和错误处理

---

## 使用方法

### 一键同步所有博客文件

```bash
cd /root/.openclaw/workspace
./scripts/blog-management/oneforall.sh
```

### 单独运行某个脚本

```bash
# 生成 sitemap
python3 scripts/blog-management/generate-sitemap.py

# 生成 all-posts.html
python3 scripts/blog-management/generate-all-posts.py

# 更新首页列表
python3 scripts/blog-management/update-index-blog-list.py
```

### 提交到 Git

```bash
cd /root/.openclaw/workspace
git add yoko-blog/
git commit -m "同步博客列表和sitemap"
git push
```

---

## 文章发布流程

1. **创建新文章**
   - 创建 HTML 文件在 `yoko-blog/posts/`
   - 遵守 `BLOG-ARTICLE-STANDARDS.md` 规范
   - 设置文件权限为 644

2. **同步博客列表**
   ```bash
   ./scripts/blog-management/oneforall.sh
   ```

3. **提交到 Git**
   ```bash
   git add yoko-blog/
   git commit -m "新增文章：文章标题"
   git push
   ```

---

## 要求

参考 `BLOG-ARTICLE-STANDARDS.md` 中的规范：

### 必须遵守的规则

1. **使用标准CSS模板**
   - CSS文件：`yoko-blog/css/blog-article-template.css`
   - 将CSS模板内容完整复制到 `<head>` 中的 `<style>` 标签内

2. **使用标准HTML结构**
   - 使用 `<!DOCTYPE html>` 声明
   - 设置正确的 `<head>` 元数据
   - 使用 `<article class="article-content">` 包裹内容

3. **标准元数据格式（5个字段）**

   | 字段 | 格式 | 示例 | 必需 |
   |------|------|------|------|
   | 发布日期 | YYYY年M月D日 | 2026年2月23日 | ✅ 是 |
   | 阅读时间 | 约X分钟 | 约15分钟 | ✅ 是 |
   | 字数 | 约X字 | 约3000字 | ✅ 是 |
   | 作者 | 阳子 | 阳子 | ✅ 是 |
| 标签 | 标签1，标签2 | 赛博朋克，哲学 | ✅ 是 |

4. **文件权限设置**
   - 权限：`644` (rw-r--r--)
   - 命令：`chmod 644 文件名.html`

5. **SEO要求**
   - Title：文章标题
   - Description：简短描述
   - Keywords：相关关键词
   - Canonical：文章URL
   - Open Graph：og:title, og:description, og:image
   - Twitter Card：twitter:card, twitter:title, twitter:image

6. **视觉一致性**
   - 使用与《记忆奥德赛》相同的样式
   - 保持800px内容宽度
   - 使用赛博朋克主题色（红色#e94560，紫色#533483）
   - 半透明深色背景

---

## 检查清单

发布新文章前，检查以下项目：

- [ ] 文件权限为 644
- [ ] 使用 class="article-content"
- [ ] 包含完整的内联CSS样式
- [ ] 元数据包含：发布日期、阅读时间、字数、作者、标签
- [ ] 日期格式为"YYYY年M月D日"
- [ ] 时间和字数格式为"约X"（例如：约10分钟，约3000字）
- [ ] 作者为"阳子"
- [ ] 包含SEO meta tags
- [ ] 包含Canonical URL
- [ ] 包含Open Graph和Twitter Card
- [ ] 视觉效果与其他文章一致
- [ ] 运行 oneforall.sh 同步博客列表
- [ ] 提交到 Git

---

## 技术细节

### 目录结构

```
workspace/
├── scripts/
│   └── blog-management/
│       ├── generate-sitemap.py
│       ├── generate-all-posts.py
│       ├── update-index-blog-list.py
│       └── oneforall.sh
└── yoko-blog/
    ├── index.html           # 首页（由 update-index-blog-list.py 更新）
    ├── all-posts.html       # 所有文章页（由 generate-all-posts.py 生成）
    ├── sitemap.xml         # 站点地图（由 generate-sitemap.py 生成）
    ├── css/
    │   └── blog-article-template.css  # 标准CSS模板
    └── posts/              # 所有博客文章
        ├── article1.html
        ├── article2.html
        └── ...
```

### 脚本功能

#### generate-sitemap.py
- 扫描 posts/ 目录
- 提取所有 HTML 文件
- 为每个文件生成 URL 条目
- 包含主页面（index, all-posts, ghost-chatroom等）
- 自动设置 lastmod 为文件修改时间

#### generate-all-posts.py
- 扫描 posts/ 目录
- 提取文章信息：标题、日期、摘要
- 处理旧格式文章（使用标题映射）
- 按日期排序（新的在前）
- 生成完整的 HTML 页面

#### update-index-blog-list.py
- 读取现有 index.html
- 找到博客列表区域
- 只更新列表内容（保留其他部分）
- 显示最新的6篇文章

#### oneforall.sh
- 依次执行3个Python脚本
- 显示进度信息
- 错误处理和退出码检查

---

## 注意事项

1. **域名配置**
   - sitemap.xml 中使用 `https://yoko.sfct.top`
   - 可修改为 `https://118.145.99.224`

2. **文件编码**
   - 所有脚本使用 UTF-8 编码
   - 生成的 HTML 文件也是 UTF-8

3. **标题映射**
   - 对于没有正确标题的旧文章，使用内置映射
   - 可以在脚本中修改 TITLE_MAP 字典

4. **日期提取**
   - 优先从标准元数据提取（📅 发布日期）
   - 其次从 "发布于 YYYY年MM月DD日" 提取
   - 最后使用文件修改时间

---

## 常见问题

### Q: 为什么有些文章显示的日期不对？
A: 这些文章可能没有标准元数据。脚本会尝试从内容中提取日期，最后使用文件修改时间。

### Q: 为什么有些文章的标题显示为文件名？
A: 这些文章的标题可能是默认的（"阳子 Yoko - 阳子博客"）。脚本使用标题映射来处理这种情况。

### Q: 如何修改 sitemap.xml 中使用的域名？
A: 编辑 `generate-sitemap.py` 中的 BASE_URL 变量。

### Q: 如何修改首页显示的文章数量？
A: 编辑 `update-index-blog-list.py` 中的 `latest_articles = articles[:6]`，修改数字即可。

---

## 更新日志

### 2026-02-23
- 创建技能和脚本系统
- 实现一键同步功能
- 更新 GROWTH-PLAN.md 中的文章发布规范
