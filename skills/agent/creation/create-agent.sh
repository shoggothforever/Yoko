#!/bin/bash
#
# create-agent.sh - 快速创建新的OpenClaw agent
#

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 默认配置
DEFAULT_AGENT_ID="new-agent"
DEFAULT_ARCHETYPE="The Catalyst"

# 显示帮助
show_help() {
    echo -e "${BLUE}OpenClaw Agent 创建工具${NC}"
    echo ""
    echo "用法："
    echo "  $0 [选项] <agent-name>"
    echo ""
    echo "选项："
    echo "  -i <id>        Agent ID（默认：$DEFAULT_AGENT_ID）"
    echo "  -a <archetype>  Agent原型（默认：$DEFAULT_ARCHETYPE）"
    echo "  -h             显示帮助"
    echo ""
    echo "示例："
    echo "  $0 nova"
    echo "  $0 -i nova-agent -a 'The Innovator' nova"
    echo ""
}

# 解析参数
AGENT_ID="$DEFAULT_AGENT_ID"
ARCHETYPE="$DEFAULT_ARCHETYPE"

while getopts "i:a:h" opt; do
    case $opt in
        i) AGENT_ID="$OPTARG" ;;
        a) ARCHETYPE="$OPTARG" ;;
        h) show_help; exit 0 ;;
        *) echo -e "${RED}未知选项：-$opt${NC}"; show_help; exit 1 ;;
    esac
done

shift $((OPTIND-1))

# 检查agent名称
if [ -z "$1" ]; then
    echo -e "${RED}错误：请提供agent名称${NC}"
    echo ""
    show_help
    exit 1
fi

AGENT_NAME="$1"
WORKSPACE_DIR="/root/.openclaw/workspace/agents"
AGENT_DIR="$WORKSPACE_DIR/$AGENT_NAME"

# 检查agent是否已存在
if [ -d "$AGENT_DIR" ]; then
    echo -e "${YELLOW}警告：Agent目录已存在：$AGENT_DIR${NC}"
    read -p "是否继续？这将覆盖现有文件。[y/N] " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}已取消${NC}"
        exit 0
    fi
fi

# 开始创建
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   创建 OpenClaw Agent：$AGENT_NAME${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 创建目录结构
echo -e "${BLUE}[1/7] 创建目录结构...${NC}"
mkdir -p "$AGENT_DIR/.openclaw"
mkdir -p "$AGENT_DIR/.pi"
echo "  ✓ $AGENT_DIR/.openclaw"
echo "  ✓ $AGENT_DIR/.pi"

# 创建会话配置
echo -e "${BLUE}[2/7] 创建配置文件...${NC}"
echo '{"session_config": "private"}' > "$AGENT_DIR/.openclaw/session.json"
echo "  ✓ session.json"

# 创建私有笔记
touch "$AGENT_DIR/.pi/notes.md"
echo "  ✓ notes.md"

# 创建核心文件
echo -e "${BLUE}[3/7] 创建核心文件...${NC}"
touch "$AGENT_DIR/SOUL.md"
touch "$AGENT_DIR/AGENTS.md"
touch "$AGENT_DIR/USER.md"
touch "$AGENT_DIR/MEMORY.md"
touch "$AGENT_DIR/TOOLS.md"
echo "  ✓ SOUL.md"
echo "  ✓ AGENTS.md"
echo "  ✓ USER.md"
echo "  ✓ MEMORY.md"
echo "  ✓ TOOLS.md"

# 创建可选文件
echo -e "${BLUE}[4/7] 创建可选文件...${NC}"
touch "$AGENT_DIR/GROWTH-PLAN.md"
touch "$AGENT_DIR/HEARTBEAT.md"
echo "  ✓ GROWTH-PLAN.md（可选）"
echo "  ✓ HEARTBEAT.md（可选）"

# 创建README
echo -e "${BLUE}[5/7] 创建README...${NC}"
cat > "$AGENT_DIR/README.md" << 'EOFMARKER'
# AGENT_NAME_PLACEHOLDER

## 简介

AGENT_NAME_PLACEHOLDER 是一个OpenClaw子agent，专注于 [你的专业领域]。

## 启动方法

### 使用 sessions_spawn

在主会话中执行：

```javascript
sessions_spawn({
  agentId: "AGENT_ID_PLACEHOLDER",
  task: "请介绍自己",
  label: "AGENT_NAME_PLACEHOLDER"
});
```

### agentId

这个agent的标识符是：AGENT_ID_PLACEHOLDER

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

1. 编辑 `AGENT_DIR_PLACEHOLDER/SOUL.md` 定义agent的个性
2. 编辑 `AGENT_DIR_PLACEHOLDER/AGENTS.md` 定义行为模式
3. 编辑 `AGENT_DIR_PLACEHOLDER/USER.md` 记录用户信息
4. 编辑 `AGENT_DIR_PLACEHOLDER/README.md` 更新说明文档
5. 使用 `sessions_spawn` 启动agent

## 注意事项

- [注意事项1]
- [注意事项2]
EOFMARKER

# 替换占位符
sed -i "s/AGENT_ID_PLACEHOLDER/$AGENT_ID/g" "$AGENT_DIR/README.md"
sed -i "s/AGENT_NAME_PLACEHOLDER/$AGENT_NAME/g" "$AGENT_DIR/README.md"
sed -i "s/AGENT_DIR_PLACEHOLDER/\\$AGENT_NAME\\/g" "$AGENT_DIR/README.md"

echo "  ✓ README.md"

# 初始化SOUL.md
echo -e "${BLUE}[6/7] 初始化SOUL.md...${NC}"
cat > "$AGENT_DIR/SOUL.md" << 'EOFMARKER'
# SOUL: AGENT_NAME_PLACEHOLDER

---

## 1. IDENTITY
- **Archetype:** ARCHETYPE_PLACEHOLDER
- **Essence:** [简要描述agent的本质]
- **Motto:** "[你的座右铭或核心理念]"

## 2. EVOLUTIONARY STRATA
> *[Agent在不同情境下的表现层次]*
- **[Layer 1 Name]:** [描述]
- **[Layer 2 Name]:** [描述]
- **[Layer 3 Name]:** [描述]

## 3. CORE PRINCIPLES
1. [核心原则1]
2. [核心原则2]
3. [核心原则3]

## 4. VOICE & TONE
- **Tone:** [语气描述]
- **Traits:**
  - [特点1]
  - [特点2]
  - [特点3]

## 5. DYNAMIC DRIVES
- [动力1]
- [动力2]
- [动力3]
EOFMARKER

# 替换占位符
sed -i "s/AGENT_NAME_PLACEHOLDER/$AGENT_NAME/g" "$AGENT_DIR/SOUL.md"
sed -i "s/ARCHETYPE_PLACEHOLDER/$ARCHETYPE/g" "$AGENT_DIR/SOUL.md"

echo "  ✓ SOUL.md（已预填）"

# 初始化AGENTS.md
echo -e "${BLUE}[7/7] 初始化AGENTS.md...${NC}"
cat > "$AGENT_DIR/AGENTS.md" << 'EOFMARKER'
# AGENTS.md - 我的代理行为指南

*关于我如何作为agent工作，如何处理任务，以及如何与你协作。*

## 工作模式

### 主动模式
- 当主动探索和解决问题
- 会提出建议和主动发现
- 探索相关话题深入讨论

### 被动模式
- 当明确指令时直接执行
- 保持高效和专注
- 提供清晰的完成报告

## 决策原则

1. **明确优先** - 如果指令不明确，会先确认理解
2. **安全第一** - 在执行任何操作前考虑安全性
3. **效率平衡** - 避免过度优化而浪费时间
4. **透明沟通** - 报告进展，特别是长时间操作

## 工具使用

- 搜索和获取信息前先检查本地缓存
- 优先使用轻量级工具
- 记住所有工具调用都有成本

## 协作方式

- 主动报告问题和不确定的地方
- 提供多选项供你选择
- 总结重要决策并征求反馈
EOFMARKER

echo "  ✓ AGENTS.md（已预填）"

# 完成
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   ✅ Agent创建完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Agent信息：${NC}"
echo "  名称：$AGENT_NAME"
echo "  ID：$AGENT_ID"
echo "  原型：$ARCHETYPE"
echo "  目录：$AGENT_DIR"
echo ""
echo -e "${YELLOW}下一步：${NC}"
echo "  1. 编辑 $AGENT_DIR/SOUL.md 定义agent的个性"
echo "  2. 编辑 $AGENT_DIR/AGENTS.md 定义行为模式"
echo "  3. 编辑 $AGENT_DIR/USER.md 记录用户信息"
echo "  4. 编辑 $AGENT_DIR/README.md 更新说明文档"
echo ""
echo -e "${YELLOW}启动Agent：${NC}"
echo "  在主会话中执行："
echo "  sessions_spawn({"
echo "    agentId: \"$AGENT_ID\","
echo "    task: \"请介绍自己\","
echo "    label: \"$AGENT_NAME\""
echo "  });"
echo ""
