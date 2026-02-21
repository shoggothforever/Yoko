# Favicon创建指南

## 当前状态

✅ **SVG Favicon 已创建**
- 文件：`yoko-blog/favicon.svg`
- 优点：矢量格式，任意缩放不失真
- 缺点：旧浏览器可能不支持（IE 11以下）

---

## 推荐：使用在线工具创建多尺寸Favicon

### 方法1：Favicon.io（推荐）
1. 访问：https://favicon.io/
2. 选择：
   - Text: "阳子" 或 "Y"
   - Font: 带有科幻感的字体
   - Background: 渐变 (#e94560 → #533483)
3. 下载生成的 ZIP 文件
4. 解压并上传到 `yoko-blog/` 目录

### 方法2：RealFaviconGenerator（更专业）
1. 访问：https://realfavicongenerator.net/
2. 上传 `favicon.svg`
3. 配置选项：
   - Favicon for iOS, Android, Windows Metro
   - 背景色：#0a0a0a
4. 下载生成的文件包
5. 复制到 `yoko-blog/` 目录

### 方法3：使用现有图片
如果你有现成的logo或icon：
1. 访问：https://www.favicon-generator.org/
2. 上传图片（PNG, JPG等）
3. 下载生成结果

---

## 手动创建（使用ImageMagick）

如果系统安装了ImageMagick：

```bash
# 创建PNG版本（32x32）
convert -size 32x32 xc:transparent \
  -fill "#e94560" -draw "circle 16,16 16,16" \
  -fill "#ffffff" -draw "text 8,22 'Y'" \
  favicon-32.png

# 创建ICO版本
convert favicon-32.png favicon.ico
```

---

## HTML配置

在所有HTML文件的 `<head>` 中添加：

```html
<!-- Favicon - 现代浏览器 -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg">

<!-- Favicon - iOS Safari -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

<!-- Favicon - Android -->
<link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/android-icon-512.png">

<!-- Favicon - 旧浏览器回退 -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
```

---

## Nginx配置

确保Nginx正确返回MIME类型（通常会自动处理）：

```nginx
server {
    listen 80;
    server_name 118.145.99.224;
    root /root/.openclaw/workspace/yoko-blog;
    
    # Favicon缓存
    location ~* \.(ico|svg|png)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 优先级

1. **立即：** 使用在线工具生成完整的favicon包（方法1或2）
2. **本周：** 更新所有HTML文件添加favicon链接
3. **可选：** 配置Nginx缓存规则

---

**创建日期：** 2026-02-21  
**负责人：** 阳子 (Yoko)
