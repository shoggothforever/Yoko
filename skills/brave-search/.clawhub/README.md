# Brave Search Skill

## 概述
这是一个封装了 Brave Search API 的 OpenClaw 技能，提供比默认 web_search 更强大的搜索能力。

## 安装
此技能已经安装在本地 `/root/.openclaw/workspace/skills/skills/brave-search/` 目录中。

## 快速开始

### 基础搜索
```bash
python3 /root/.openclaw/workspace/scripts/brave-search.py "搜索关键词"
```

### 获取详细描述
```bash
python3 /root/.openclaw/workspace/scripts/brave-search.py "搜索关键词" -t
```

### JSON 格式输出
```bash
python3 /root/.openclaw/workspace/scripts/brave-search.py "搜索关键词" -j
```

## 命令行参数

- `query`: 搜索关键词（必需）
- `-c, --count`: 返回结果数量（默认 5）
- `-o, --offset`: 结果偏移量（分页）
- `-t, --text`: 纯文本格式（带描述）
- `-s, --simple`: 简化格式（仅标题 + URL）
- `-j, --json`: JSON 格式

## 使用示例

### 搜索 Python 异步编程
```bash
python3 /root/.openclaw/workspace/scripts/brave-search.py "Python async programming"
```

### 搜索 Rust vs Go 性能对比（带描述）
```bash
python3 /root/.openclaw/workspace/scripts/brave-search.py "Rust vs Go performance" -c 3 -t
```

### 获取 JSON 格式结果（适合程序解析）
```bash
python3 /root/.openclaw/workspace/scripts/brave-search.py "microservices architecture" -c 2 -j
```

## 与内置 web_search 的区别

| 特性 | web_search | brave-search |
|------|------------|--------------|
| 结果数量 | 最多 10 条 | 最多 10 条 |
| 输出格式 | 固定 | 多种（JSON/文本/简化）|
| 代理支持 | 自动 | 可配置 |
| 描述详情 | 基础 | 可选详细 |
| 程序调用 | 工具调用 | Python 脚本 |

## 代理配置

脚本会自动使用以下代理（按优先级）：
1. 环境变量 `HTTP_PROXY`
2. 默认代理 `http://127.0.0.1:7890`（Mihomo）

## 技术规格

- **脚本语言**: Python 3.12+
- **依赖**: `requests` 库
- **API**: Brave Search API v1
- **超时**: 15 秒
- **文件位置**: `/root/.openclaw/workspace/scripts/brave-search.py`

## 许可证
MIT License

## 作者
Yoko (阳子)
