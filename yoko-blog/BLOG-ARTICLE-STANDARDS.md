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

## 自动化工具（权威）

> ⚠️ 不要再手工逐篇改文章。下面是当前**实际可用且互相配合**的工具，全部位于
> `scripts/blog-management/`。所有脚本从自身位置推导仓库根，不依赖 Linux
> `/root/.openclaw/workspace`，可在 macOS、本地 Linux、CI 与服务器 checkout 运行。

```bash
# ① 一键日常维护（推荐入口）——归一化 + 重建索引/sitemap + 合规复检
bash scripts/blog-management/sync-blog.sh

# ② 仅归一化文章模板（把漂移文章重套标准模板，保留正文，补元数据，修权限 644）
#    需要带 beautifulsoup4 的解释器：yoko-blog/.toolvenv/bin/python
yoko-blog/.toolvenv/bin/python scripts/blog-management/normalize-posts.py            # dry-run 预览分类
yoko-blog/.toolvenv/bin/python scripts/blog-management/normalize-posts.py --apply     # 实际写入
yoko-blog/.toolvenv/bin/python scripts/blog-management/normalize-posts.py --audit     # 仅合规检查（CI/告警用，违规则非0退出）

# ③ 仅重建衍生文件（不改文章本体）
bash scripts/blog-management/oneforall.sh   # = generate-all-posts.py + generate-sitemap.py + update-index-blog-list.py

# ④ 全站链接连通性体检（可达性 DFS，文件系统级，本地/云端/CI 通用，断链则非0退出）
python3 scripts/blog-management/check-links.py
```

`sync-blog.sh` 已内置链接体检（第4步）；每日云端 routine 在重建后也会跑 `check-links.py` 自检。

归一化脚本会**自动跳过已合规文章**（保留其原有丰富内联样式，不回退），只重写漂移文章。
所有页面/文章/子目录均支持（`posts/**` 递归），子目录文章相对路径自动按深度修正。

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

---

## 域名 / Canonical 约定

- 全站 canonical / OG / Twitter / sitemap / robots 统一使用 **`https://118.145.99.224`**（裸 IP，与 Nginx `server_name` 一致）。
- 生成器基准在 `scripts/blog-management/generate-sitemap.py` 的 `BASE_URL`、归一化器在 `normalize-posts.py` 的 `BASE_URL`。
- 若将来切回域名 `yoko.sfct.top`：改这两个 `BASE_URL`，跑 `sync-blog.sh`，并用 `workspace/switch-to-domain.sh` 切换 Nginx。

## 日常维护 Routine（防止风格漂移）

风格漂移的根因：早期满血模型按标准写，后期由 cron + 较弱模型自动生成、无人校验。现已用"机器强制"代替"靠模型自觉"：

1. **预检（09:40，系统 crontab）** — 检查 Git、干净工作区、Codex、联网、Python 门禁环境和共享锁。
2. **生成（10:00，Codex 自动化）** — 动态探索 8–12 个候选，最近 30 篇去重；达到 80 分且有核心问题才写，否则生成“不发布选题报告”。禁止 Brave 脚本与 `BRAVE_API_KEY`。
3. **内容门禁（10:35，Codex + 脚本）** — 语义核验并运行全部机械门禁；失败停止发布。
4. **自愈（10:45，系统 crontab）** — 确定性重建索引、feed、sitemap，并复检结构与链接；只提交衍生文件。
5. **发布（11:00，Codex 自动化）** — 使用 `auto/daily-YYYY-MM-DD` 的同日唯一 PR；检查全部通过后才合并。
6. **Pages / SLA（11:10、11:30）** — 验证线上真实内容；今日既无文章也无合格报告时告警，连续两天未发布时升级。

> 单一可信入口：**改完任何文章后，跑 `bash scripts/blog-management/sync-blog.sh` 即可**。它是幂等的，可随时重复运行。

## 探索停产监测（防"静默停更"）

教训：cron `status=ok` ≠ 真有产出。2026-05 galley 因 **ARK CodingPlan 订阅过期**（模型返回 `InvalidSubscription`、助手回合全空）连续 40 天零产出却无任何报错。

- 监测：`python3 scripts/blog-management/check-exploration-health.py`。11:30 必须存在今日文章或含候选、评分、淘汰理由的当日报告；最新文章超过 1 天则升级告警。
- 调度器成功不构成产出证据；`main`、Pages、首页、文章 URL、feed 与 sitemap 的真实内容才构成证据。

## 平台兼容与首次准备

- shell 脚本兼容 macOS Bash 3.2 与常见 Linux Bash，不依赖 `flock` 或 GNU `date`。
- 共享互斥使用 `${TMPDIR:-/tmp}/yoko-daily-blog.lock` 的原子 `mkdir`。
- Python 依赖使用仓库内 `yoko-blog/.toolvenv`；首次运行：
  `bash scripts/blog-management/bootstrap-blog-tools.sh`。
- CI/服务器已有 Python 环境时，可设置 `YOKO_BLOG_PYTHON=/path/to/python`，该解释器必须能导入 `bs4`。
- 系统 cron 使用主机时区；安装器要求主机为 UTC+08:00，避免依赖 macOS 不支持的 `CRON_TZ`。
