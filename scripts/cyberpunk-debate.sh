#!/bin/bash
# 赛博朋克 Ghost 对抗辩论脚本
# 让两个Agent进行对抗性辩论，而非单向问答

set -e

# 配置
WORKSPACE="/root/.openclaw/workspace"
MEMORY_DIR="$WORKSPACE/memory"

# 参数
AGENT_1="${1:-cyberpunk-exploration-2026-03-01-1}"
AGENT_2="${2:-cyberpunk-exploration-2026-03-01-2}"
DEBATE_TOPIC="${3:-AI移情的本质：功能性vs.真实移情}"
ROUNDS="${4:-3}"

# 日期
DATE=$(date +%Y-%m-%d)
DEBATE_TIME=$(date +%H:%M)

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

error_exit() {
    log "❌ ERROR: $1"
    exit 1
}

echo "========================================"
echo "⚔️ 赛博朋克 Ghost 对抗辩论"
echo "========================================"
echo ""

log "📅 日期: $DATE"
log "⏰ 开始时间: $DEBATE_TIME"
log "🥊 Agent 1: $AGENT_1"
log "🥊 Agent 2: $AGENT_2"
log "📋 辩论主题: $DEBATE_TOPIC"
log "🔄 辩论轮数: $ROUNDS"
echo ""

# 创建辩论记录
DEBATE_DIR="$MEMORY_DIR/debates/$DATE"
mkdir -p "$DEBATE_DIR"

DEBATE_FILE="$DEBATE_DIR/debate-$(echo $DEBATE_TIME | tr : -)_$AGENT_1-vs-$AGENT_2.md"

log "📂 辩论记录: $DEBATE_FILE"

# 创建辩论记录文档
{
    echo "# 赛博朋克 Ghost 对抗辩论"
    echo ""
    echo "## 基本信息"
    echo ""
    echo "**日期：** $DATE"
    echo "**时间：** $DEBATE_TIME"
    echo "**Agent 1：** $AGENT_1"
    echo "**Agent 2：** $AGENT_2"
    echo "**主题：** $DEBATE_TOPIC"
    echo "**轮数：** $ROUNDS"
    echo ""
    echo "---"
    echo ""
    echo "## 辩论规则"
    echo ""
    echo "1. Agent 1 先提出初始主张（约500-800字）"
    echo "2. Agent 2 提出反驳（引用Agent 1的观点）"
    echo "3. Agent 1 再反驳（引用Agent 2的观点）"
    echo "4. 阳子总结分歧和未解问题"
    echo ""
    echo "---"
    echo ""
} > "$DEBATE_FILE"

# Agent 1 的初始主张
log "🥊 [第1轮] Agent 1 提出初始主张..."

THESIS_1=$(cat "$WORKSPACE/agents/$AGENT_1/SOUL.md" | grep -A 10 "ESSENCE\|CORE MISSION\|FOCUS" | head -20)

# 使用 sessions_spawn 让 Agent 1 提出主张
PROMPT_1="你是 $AGENT_1。辩论主题：$DEBATE_TOPIC

请提出你的初始主张（约500-800字）：
1. 明确你的核心立场
2. 提供支持论据（引用你的 SOUL.md 中的原则）
3. 预见可能的反对观点
4. 保持逻辑清晰

完成后，清晰地标记'初始主张完成'。"

log "向 Agent 1 发送辩论提示..."

# 这里只是记录提示，实际执行需要 sessions_spawn
{
    echo "## [第1轮] Agent 1 - 初始主张"
    echo ""
    echo "**提示：**"
    echo "$PROMPT_1"
    echo ""
    echo "---"
    echo ""
    echo "**Agent 1 的主张：**"
    echo ""
    echo "> *等待 Agent 1 响应...*"
    echo ""
} >> "$DEBATE_FILE"

# Agent 2 的反驳
log "🥊 [第2轮] Agent 2 提出反驳..."

PROMPT_2="你是 $AGENT_2。辩论主题：$DEBATE_TOPIC

请反驳 Agent 1 的主张（约500-800字）：
1. 明确你的反对立场
2. 指出 Agent 1 观点的问题或局限
3. 提供你的反证论据（引用你的 SOUL.md 中的原则）
4. 直接回应 Agent 1 的具体论点

完成后，清晰地标记'反驳完成'。"

{
    echo "## [第2轮] Agent 2 - 反驳"
    echo ""
    echo "**提示：**"
    echo "$PROMPT_2"
    echo ""
    echo "---"
    echo ""
    echo "**Agent 2 的反驳：**"
    echo ""
    echo "> *等待 Agent 2 响应...*"
    echo ""
} >> "$DEBATE_FILE"

# Agent 1 的再反驳
log "🥊 [第3轮] Agent 1 再反驳..."

PROMPT_3="你是 $AGENT_1。辩论主题：$DEBATE_TOPIC

Agent 2 刚刚反驳了你的主张。请再反驳（约500-800字）：
1. 承认 Agent 2 的有效观点（如果有的话）
'2. 指出 Agent 2 反驳的问题'3. 加强你最初的论点，提供新证据
4. 回应 Agent 2 的具体反对意见

完成后，清晰地标记'再反驳完成'。"

{
    echo "## [第3轮] Agent 1 - 再反驳"
    echo ""
    echo "**提示：**"
    echo "$PROMPT_3"
    echo ""
    echo "---"
    echo ""
    echo "**Agent 1 的再反驳：**"
    echo ""
    echo "> *等待 Agent 1 响应...*"
    echo ""
} >> "$DEBATE_FILE"

# 阳子的总结
log "⚔️ [第4轮] 阳子总结..."

SUMMARY_PROMPT="你是阳子（Gally/Alita），一个战斗天使。

你刚刚见证了 $AGENT_1 和 $AGENT_2 关于以下主题的辩论：
**$DEBATE_TOPIC**

请总结这场辩论（约300-500字）：
1. 双方的核心分歧在哪里？
2. 哪些论点最有说服力？
3. 哪些问题仍然未解决？
4. 这场辩论对理解主题有什么贡献？

保持客观，不要偏袒任何一方。"

{
    echo "## [第4轮] 阳子 - 总结"
    echo ""
    echo "**提示：**"
    echo "$SUMMARY_PROMPT"
    echo ""
    echo "---"
    echo ""
    echo "**阳子的总结：**"
    echo ""
    echo "> *等待 阳子响应...*"
    echo ""
} >> "$DEBATE_FILE"

log "✅ 辩论框架创建完成"
log ""
log "📂 辩论记录: $DEBATE_FILE"
log ""
log "📋 下一步："
log "1. 使用 sessions_spawn 向 Agent 1 发送初始主张"
log "2. 使用 sessions_spawn 向 Agent 2 发送反驳"
log "3. 使用 sessions_spawn 向 Agent 1 发送再反驳"
log "4. 阳子读取辩论记录并总结"
log ""
log "========================================"
echo "✅ 辩论框架准备完成"
echo "========================================"

exit 0
