# Brave Search Skill

## 描述
使用 Brave Search API 进行网络搜索的技能。提供比默认 web_search 更强的搜索能力，支持代理配置、JSON 输出等多种格式。

## 适用场景
当用户需要进行以下操作时使用此技能：
- 网络搜索和信息查询
- 获取实时资讯
- 查找特定主题的资料
- 搜索技术文档或教程

## 核心能力

### 1. 基础搜索
- 使用 `python3 /root/.openclaw/workspace/scripts/brave-search.py` 执行命令
- 支持中文和英文搜索
- 自动清理 HTML 标签，返回纯文本

### 2. 输出格式

**简化格式（默认）：**
```bash
python3 /root/.openclaw/workspace/scripts/brave-search.py "搜索关键词" -c 5
```
返回：标题 + URL

**纯文本格式：**
```bash
python3 /root/.openclaw/workspace/scripts/brave-search.py "搜索关键词" -c 5 -t
```
返回：标题 + URL + 描述

**JSON 格式：**
```bash
python3 /root/.openclaw/workspace/scripts/brave-search.py "搜索关键词" -c 5 -j
```
返回：结构化 JSON 数据（适合解析）

### 3. 高级选项

- `-c N`: 返回结果数量（默认 5，最多 10）
- `-o N`: 结果偏移量（用于分页）
- `-t`: 纯文本格式（带描述）
- `-s`: 简化格式（仅标题和 URL）
- `-j`: JSON 格式

### 4. 代理配置
脚本自动使用环境变量 `HTTP_PROXY` 或默认代理 `http://127.0.0.1:7890`

## 使用示例

### 示例 1：基础搜索
```bash
python3 /root/.openclaw/workspace/scripts/brave-search.py "Python async programming"
```

### 示例2：带描述的搜索
```bash
python3 /root/.openclaw/workspace/scripts/brave-search.py "Rust vs Go performance" -c 3 -t
```

### 示例 3：JSON 格式（适合解析）
```bash
python3 /root/.openclaw/workspace/scripts/brave-search.py "microservices architecture" -c 2 -j
```

## 最佳实践

1. **优先使用默认工具：** 对于简单搜索，优先使用 OpenClaw 内置的 `web_search` 工具
2. **使用此技能的场景：**
   - 需要更多结果（超过 10 条）
   - 需要特定的输出格式（JSON）
   - 需要通过代理访问
   - 需要更详细的描述信息

3. **搜索词优化：**
   - 使用具体的关键词组合
   - 添加引号进行精确匹配：`"machine learning" "deep learning"`
   - 使用排除符：`python -django`

## API 配置

API Key 通过环境变量 `BRAVE_API_KEY` 获取，避免硬编码在代码中。

## 技术细节

- 脚本位置：`/root/.openclaw/workspace/scripts/brave-search.py`
- Python 版本：Python 3.12+
- 依赖：`requests` 库
- 超时设置：15 秒
- 支持的分页：通过 offset 参数实现

## 注意事项

1. 每次搜索最多返回 10 条结果（API 限制）
2. 代理失败时会自动回退到直连
3. HTML 描述会被自动清理，避免 XSS 风险
4. 返回的 URL 可能包含追踪参数，使用时需注意隐私
