# Brave Search API 配置说明

## 问题

当使用 `web_search`` 工具时，遇到错误：

```
web_search needs a Brave Search API key. Run `openclaw configure --section web` to store it, or set BRAVE_API_KEY in Gateway environment.
```

## 解决方案

有两种方法配置 Brave Search API Key：

### 方法1：使用 OpenClaw 配置（推荐）

```bash
openclaw configure --section web
```

这会启动交互式配置向导，按提示输入 Brave Search API Key。

### 方法2：设置环境变量

在启动 Gateway 的环境中设置 `BRAVE_API_KEY` 环境变量：

```bash
export BRAVE_API_KEY="你的API密钥"
```

或在 `~/.bashrc` 或 `~/.zshrc` 中添加：

```bash
export BRAVE_API_KEY="你的API密钥"
```

## 获取 Brave Search API Key

1. 访问 https://brave.com/search/api/
2. 注册并获取 API Key
3. 使用上面的方法之一配置

## 验证配置

配置后，重启 Gateway 或使用 web_search 工具测试：

```bash
# 在主会话中测试
web_search("测试", count=1)
```

## 当前状态

未配置 Brave Search API Key，因此 web_search 工具无法使用。

如需进行网络搜索，请先配置 API Key。
