# HTMLizer-zh 技能

HTMLizer 是一个轻量级的中文繁体转换工具，用于生成更优美的网页排版。

---

## 功能

- 将HTML内容转为美观的纯文本格式
- 保留段落结构
- 简化链接和引用
- 支持代码块和列表

---

## 使用方法

### 方式1：作为独立工具使用

```bash
cd /root/.openclaw/workspace/skills/html-zer-zh
python3 htmlizer_zh.py
```

### 方式2：在OpenClaw中集成

将此功能添加到你的agent工具链中：

```python
from skills.htmlizer_zh import html_to_text

# 将HTML转换为纯文本
html_content = """
<html>
<body>
    <h1>标题</h1>
    <p>内容</p>
</body>
</html>
"""

text_content = html_to_text(html_content)
print(text_content)
```

---

## 函数说明

### html_to_text(html)

参数：
- `html` (str): HTML内容

返回：
- (str): 转换后的纯文本

示例：

```python
html = """
<h1>文章标题</h1>
<p>这是一段文字 <a href="https://example.com">链接</a></p>
<ul>
    <li>列表项1</li>
    <li>列表项2</li>
</ul>
"""

text = html_to = text(html)
print(text)
```

输出：

```
# 文章标题

这是一段文字 [链接](https://example.com)

- 列表项1
- 列表项2
```

---

## 使用场景

1. **将博客文章转换为可读格式**
   - 保留文章结构
   -. 移除HTML标签

2. **简化复杂HTML内容**
   - 快速提取核心信息
   -. 保持可读性

3. **为AI处理提供干净输入**
   - 减少HTML噪音
   - 提高理解准确性

---

## 注意事项

1. 此工具主要用于中文内容的HTML
2. 英文内容的特殊字符可能需要额外处理
3. 复杂的嵌套结构可能需要优化

---

## 更新日志

### 2026-02-23
- 创建 HTMLizer-zh 技能
- 提供轻量级的中文HTML转文本功能
- 支持段落、链接、列表、代码块
