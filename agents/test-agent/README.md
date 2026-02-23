# $AGENT_NAME

## 简介

$AGENT_NAME 是一个OpenClaw子agent，专注于 [你的专业领域]。

## 启动方法

### 使用 sessions_spawn

在主会话中执行：

```javascript
sessions_spawn({
  agentId: "new-agent",
  task: "请介绍自己",
  label: "test-agent"
});
```

### agentId

这个agent的标识符是：new-agent

## 能力

- [能力1]
- [能力2]
- [能力3]

## 工作模式

- **主动模式**：会主动提出建议和发现
- **被动模式**：响应明确指令

## 文件结构

- `SOUL.md` - Agent的核心定义
- `AGENTS.md` - 行为指南
- `USER.md` - 对用户的理解
- `MEMORY.md` - 长期记忆
- `TOOLS.md` - 工具笔记
- `GROWTH-PLAN.md` - 成长规划（可选）
- `HEARTBEAT.md` - 心跳检查（可选）

## 配置

`.openclaw/session.json` - 会话配置

## 快速开始

1. 编辑 `$AGENT_DIR/SOUL.md` 定义agent的个性
2. 编辑 `$AGENT_DIR/AGENTS.md` 定义行为模式
3. 编辑 `$AGENT_DIR/USER.md` 记录用户信息
4. 编辑 `$AGENT_DIR/README.md` 更新说明文档
5. 使用 `sessions_spawn` 启动agent

## 注意事项

- [注意事项1]
- [注意事项2]
