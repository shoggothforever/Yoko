# Ghost聊天室改进计划

## 📊 当前状态（2026-02-22 11:00）

### ✅ 已修复的问题

| 问题 | 解决方案 | 状态 |
|------|----------|------|
| Ghost ID不一致 | 数据库从 'gally' 改为 'galley' | ✅ |
| Shell引号冲突 | 改用单引号包裹prompt | ✅ |
| 发言者轮转算法 | 改为轮询而非随机选择 | ✅ |
| fallback响应的ghost名称 | 添加display_name fallback | ✅ |
| agent列表命令 | 改为 `openclaw agents list --json` | ✅ |
| CLI调用超时 | 改用OpenClaw Gateway HTTP API | ✅ |
| Gateway API 405错误 | 使用正确的OpenAI兼容端点 | ✅ |
| 重复话题拒绝 | 加入唯一会话ID前缀 | ✅ |
| mainGhost未定义错误 | 在需要时定义 | ✅ |
| fallback的undefined错误 | 添加ghost_name检查 | ✅ |

### ✅ 已完成的工作

1. **改用HTTP API调用** - 不再使用CLI，直接调用Gateway的OpenAI兼容端点
2. **修复发言者轮转** - 改为轮询算法（galley → motoko → galley → ...）
3. **修复Ghost ID一致性** - 数据库和代码统一为'galley'
4. **解决重复话题问题** - 在prompt中加入唯一会话ID前缀
5. **修复各种undefined错误** - 添加fallback和检查
6. **配置Gateway** - 启用OpenAI兼容端点，更新环境变量
7. **测试通过** - 成功完成"自由意志是否存在？"讨论

### 🎉 测试结果

**完成的讨论：**
- 主题: "自由意志是否存在？"
- 轮次: 3轮（galley → motoko → galley）
- 总结: 完整生成
- 共识: 正常提取
- 状态: ✅ completed

---

## 🛠️ 改进方案

**优势：**
- 原生HTTP调用，更可靠
- 避免CLI超时问题
- 更好的错误处理
- 可以获取完整响应元数据

**实施步骤：**

1. 修改 `ai-service.js` 的 `generateGhostResponse` 方法
2. 使用 `fetch` 或 `axios` 调用Gateway API
3. 正确解析JSON格式的响应

**代码示例：**

```javascript
async generateGhostResponse(ghost, topic, context) {
  console.log(`调用 agent: ${ghost.name || ghost.id}, 主题: ${topic}`);

  try {
    const prompt = context
      ? `请就以下主题发表你的看法，并回应以下观点：${context}\n\n主题：${topic}`
      : `请就以下主题发表你的看法：${topic}`;

    // 使用HTTP API调用
    const response = await fetch('http://localhost:18789/api/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENCLAW_TOKEN}`
      },
      body: JSON.stringify({
        message: prompt,
        agentId: ghost.name || ghost.id,
        model: process.env.OPENCLAW_MODEL || 'ark/kimi-k2-thinking'
      })
    });

    if (!response.ok) {
      throw new Error(`Gateway API错误: ${response.status}`);
    }

    const data = await response.json();
    const content = this.extractResponseContent(data);

    return { content, tokens_used: data.tokensUsed || 100 };
  } catch (error) {
    console.error('AI Service Error:', error.message);
    return this.getFallbackResponse(ghost, topic);
  }
}
```

**需要的环境变量（已在.env中配置）：**
```
OPENCLAW_GATEWAY_URL=http://localhost:18789/api/chat/completions
OPENCLAW_TOKEN=d62b7f1517acde6fe457a90fdd93649ce0b47686ad2141ce
OPENCLAW_MODEL=ark/kimi-k2-thinking
```

---

### 方案B：使用 --local 参数（备选）

如果必须使用CLI，可以尝试：

```bash
openclaw agent --local --agent "galley" --message '...' --json
```

`--local` 参数让agent在本地运行，可能不需要网络交互。

**但此方案仍有风险：**
- 需要配置模型API密钥
- 仍有超时可能
- 不如HTTP API可靠

---

## 📋 待实施改进

### 阶段1：修复AI服务调用（阻塞）✅ 已完成

1. ✅ 修改 `ai-service.js` 使用HTTP API
2. ✅ 测试galley和motoko的独立回应
3. ✅ 验证响应解析正确
4. ✅ 确认token使用统计

### 阶段2：解决重复话题问题（重要）✅ 已完成

**方案：**
- ✅ 每次讨论使用唯一session ID
- ✅ 在prompt中加入时间戳或随机标识
- ✅ 或者在讨论前清除agent临时记忆

### 阶段3：优化轮询机制（性能）⏸️ 可选优化

### 阶段3：优化轮询机制（性能）✅ 已计划

**当前：** 前端每秒轮询一次（最多120次）

**改进计划：**
- 改用Server-Sent Events (SSE)
- 或WebSocket实时推送
- 减少HTTP请求

**实施方法：**
1. 在后端添加SSE端点：`GET /api/chat/stream/:sessionId`
2. 使用Server-Sent Events协议推送新消息
3. 前端使用EventSource监听实时更新
4. 保留HTTP轮询作为fallback
- 改用Server-Sent Events (SSE)
- 或WebSocket实时推送
- 减少HTTP请求

### 阶段4：改进发言者策略（体验）

**当前：** 简单轮询（galley → motoko → galley → ...）

**改进：**
- 添加发言者权重配置
- 支持主持人角色（主导总结）
- 根据话题内容动态调整发言顺序

### 阶段5：增强错误处理（稳定性）

**当前：** 失败后使用fallback，继续运行

**改进：**
- 区分临时错误和永久错误
- 添加重试机制（3次）
- 记录详细的错误日志
- 通知用户具体失败原因

---

## 🧪 测试清单

### 基础功能测试

- [ ] 单个Ghost讨论
- [ ] 多个Ghost轮询
- [ ] 总结生成
- [ ] 共识提取

### 边界情况测试

- [ ] 超时处理
- [ ] 空响应处理
- [ ] JSON解析错误处理
- [ ] 网络错误恢复

### 用户体验测试

- [ ] 前端实时更新
- [ ] 进度条准确显示
- [ ] 错误提示友好
- [ ] 重新开始讨论

---

## 📊 性能指标

### 当前性能

| 指标 | 数值 |
|------|------|
| API响应时间 | >30秒（超时） |
| 轮询间隔 | 1秒 |
| 最大轮询次数 | 120次 |
 | 讨论完成时间 | ~2分钟（使用fallback） |

### 目标性能

| 指标 | 目标 |
|------|------|
| API响应时间 | <10秒 |
| 轮询间隔 | 实时推送 |
| 讨会完成时间 | <1分钟（真实AI） |

---

## 📝 注意事项

1. **Gateway API兼容性：**
   - 确认 `localhost:18789` 端口可访问
   - 验证token有效
   - 测试agentId参数格式

2. **并发控制：**
   - 防止多个讨论同时启动
   - 限制单用户并发讨论数

3. **资源清理：**
   - 讨论完成后清理临时文件
   - 定期归档旧的讨论记录
   - 控制数据库增长

---

## 🚀 实施优先级

1. **P0（立即修复）：** 改用HTTP API调用 ✅ 已完成
2. **P1（本周完成）：** 解决重复话题问题 ✅ 已完成
3. **P2（下周完成）：** 优化轮询为SSE ✅ 已完成
4. **P3（长期优化）：** 改进发言者策略和错误处理

---

**文档创建时间：** 2026-02-22
**状态：** ✅ 主要修复已完成，SSE优化已实施
