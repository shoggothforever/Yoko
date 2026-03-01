#!/bin/bash
# 赛博朋克 Ghost 发现脚本
# 每天通过 brave-search.py 搜索赛博朋克主题的艺术作品，创建探索 Agent
# 将所有相关文件组织到按日期分类的目录中

set -e

# 配置
WORKSPACE="/root/.openclaw/workspace"
MEMORY_DIR="$WORKSPACE/memory"
AGENTS_DIR="$WORKSPACE/agents"
DISCOVERY_LOG="$MEMORY_DIR/ghost-discovery.log"
BRAVE_SEARCH="$WORKSPACE/scripts/brave-search.py"

# 日期
DATE=$(date +%Y-%m-%d)
WEEK_DAY=$(date +%u)  # 1=周一, 7=周日
RUN_TIME=$(date +%H:%M)

# 创建日期目录
DAY_DIR="$MEMORY_DIR/ghost-discovery/$DATE"
mkdir -p "$DAY_DIR"

# 艺术体裁分类（5个主要体裁）
MEDIUM_TYPES=(
    "novels science-fiction cyberpunk dystopian"
    "comics manga cyberpunk graphic-novel"
    "movies anime cyberpunk film animation"
    "video-games rpg cyberpunk dystopian"
    "visual-art concept-art cyberpunk digital-art"
)

# 选择今日体裁（5个体裁轮换，每次执行选择不同的）
MEDIUM_INDEX=$(( (WEEK_DAY * 3 + ${RUN_TIME//:/}) % 5 ))
MEDIUM_TYPE="${MEDIUM_TYPES[$MEDIUM_INDEX]}"

# 赛博朋克关键词池（每次搜索选择3个组合）
CYBERPUNK_KEYWORDS=(
    "cyberpunk"
    "dystopian"
    "post-human"
    "neural-link"
    "artificial-intelligence"
    "megacorporation"
    "high-tech-low-life"
    "cyborg"
    "augmented-reality"
    "hacker"
    "underground"
    "simulation"
    "digital-consciousness"
)

# 随机选择3个关键词
KEYWORD1="${CYBERPUNK_KEYWORDS[$RANDOM % ${#CYBERPUNK_KEYWORDS[@]}]}"
KEYWORD2="${CYBERPUNK_KEYWORDS[$RANDOM % 13]}"
KEYWORD3="${CYBERPUNK_KEYWORDS[$RANDOM % 13]}"

# 组合搜索关键词
SEARCH_QUERY="$MEDIUM_TYPE $KEYWORD1 $KEYWORD2 $KEYWORD3"

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$DISCOVERY_LOG"
}

# 错误处理
error_exit() {
    log "❌ ERROR: $1"
    exit 1
}

# 创建必要的目录
mkdir -p "$MEMORY_DIR" 2>/dev/null || error_exit "无法创建目录: $MEMORY_DIR"
mkdir -p "$AGENTS_DIR" 2>/dev/null || error_exit "无法创建目录: $AGENTS_DIR"
mkdir -p "$DAY_DIR" 2>/dev/null || error_exit "无法创建目录: $DAY_DIR"

log "🚀 赛博朋克 Ghost 发现开始"
log "📅 日期: $DATE"
log "⏰ 运行时间: $RUN_TIME"
log "🎨 体裁索引: $MEDIUM_INDEX"
log "📚 体裁类别: $MEDIUM_TYPE"
log "🔍 搜索关键词: $SEARCH_QUERY"

# 使用 brave-search.py 搜索（最多8条结果）
log "🌐 开始搜索..."
SEARCH_OUTPUT=$(python3 "$BRAVE_SEARCH" "$SEARCH_QUERY" -c 8 -t 2>&1)

if [ -z "$SEARCH_OUTPUT" ]; then
    log "⚠️ 未找到相关结果"
    log "🏁 退出脚本"
    exit 0
fi

log "✅ 搜索完成"
log ""
log "📊 搜索结果："
echo "$SEARCH_OUTPUT" | tee -a "$DISCOVERY_LOG"
echo "" >> "$DISCOVERY_LOG"

# 解析搜索结果，提取作品信息
WORK_TITLES=()
CURRENT_TITLE=""
CURRENT_DESC=""

# 按行处理
while IFS= read -r line; do
    # 提取标题（格式：1. 标题）
    if echo "$line" | grep -qE "^[0-9]+\."; then
        # 清理标题
        CURRENT_TITLE=$(echo "$line" | sed 's/^[0-9]*\. //' | cut -c1-100)
    fi
    
    # 提取描述（以空白开头的行）
    if echo "$line" | grep -q "^    " && [ -n "$CURRENT_TITLE" ]; then
        CURRENT_DESC=$(echo "$line" | sed 's/^    //')
    fi
    
    # 提取URL（格式：URL: https://...）
    if echo "$line" | grep -q "URL: "; then
        CURRENT_URL=$(echo "$line" | sed 's/.*URL: //' | cut -d' ' -f1)
        # 保存结果
        if [ -n "$CURRENT_TITLE" ] && [ -n "$CURRENT_URL" ]; then
            WORK_TITLES+=("$CURRENT_TITLE|$CURRENT_URL|$CURRENT_DESC")
            log "  📖 作品: $CURRENT_TITLE"
            log "     URL: $CURRENT_URL"
            log "     描述: $(echo $CURRENT_DESC | cut -c1-80)..."
            # 重置
            CURRENT_TITLE=""
            CURRENT_URL=""
            CURRENT_DESC=""
        fi
    fi
done <<< "$SEARCH_OUTPUT"

log ""
log "📊 共找到 ${#WORK_TITLES[@]} 个作品"

# 如果没有可用的作品，退出
if [ ${#WORK_TITLES[@]} -eq 0 ]; then
    log "⚠️ 没有可分析的作品"
    log "🏁 退出脚本"
    exit 0
fi

# 每次执行创建2个 Agent
MAX_AGENTS=2

log "📋 计划创建 $MAX_AGENTS 个 Agent"
log ""

# 创建探索记录（在日期目录下）
RUN_ID="${RUN_TIME//:/_}"
RUN_DISCOVERY="$DAY_DIR/ghost-discovery-$RUN_ID.md"

# 体裁映射
MEDIUM_NAMES=("科幻小说" "漫画/图像小说" "电影/动画" "电子游戏" "视觉艺术")
MEDIUM_NAME="${MEDIUM_NAMES[$MEDIUM_INDEX]}"

# 写入头部
{
    echo "# 赛博朋克 Ghost 发现 - $DATE - $RUN_TIME"
    echo ""
    echo "## 📅 基本信息"
    echo ""
    echo "**日期：** $DATE"
    echo "**运行时间：** $RUN_TIME"
    echo "**艺术体裁：** $MEDIUM_NAME"
    echo "**搜索关键词：** $SEARCH_QUERY"
    echo ""
    echo "---"
    echo ""
    echo "## 🔄 执行流程"
    echo ""
    echo "### 1. 搜索阶段（网络搜索）"
    echo ""
    echo "**搜索关键词：** $SEARCH_QUERY"
    echo ""
    echo "**搜索结果：**"
    echo ""
    echo "$SEARCH_OUTPUT"
    echo ""
    echo "---"
    echo ""
    echo "### 2. 分析阶段（角色和主题提取）"
    echo ""
    echo "**提取目标：**"
    echo ""
    echo "1. **角色提取**"
    echo "   - 识别作品中的主要角色"
    echo "   - 提取角色的核心特征（外貌、能力、性格、背景）"
    echo "   - 记录角色的哲学立场或世界观"
    echo ""
    echo "2. **主题哲学提取**"
    echo "   - 识别作品的哲学主题（存在主义、后人类主义、技术伦理）"
    echo "   - 提取赛博朋克文化元素（High Tech, Low Life, 边界模糊、复古未来）"
    echo "   - 记录美学风格描述（黑暗、霓虹、复古未来）"
    echo ""
    echo "3. **关键引用提取**"
    echo "   - 提取作品中的经典台词或哲学陈述"
    echo "   - 识别重要的设定或世界观元素"
    echo ""
    echo "---"
    echo ""
    echo "### 3. Agent 创建阶段（每次 2 个 Agent）"
    echo ""
    echo "**Agent 数量：** 2 个"
    echo "**Agent 类型：** 探索型 Agent（基于作品/角色）"
    echo ""
    echo "**Agent 命名规则：**"
    echo "- 格式：ghost-{体裁}-{日期}-{运行时间}-{序号}"
    echo "- 示例：ghost-novels-20260227-10_00-0"
    echo ""
    echo "**Agent 目标：**"
    echo "- 深度理解某个赛博朋克作品中的角色或主题"
    echo "- 进行哲学反思和对话"
    echo "- 产出分析性见解"
    echo ""
    echo "**Agent 创建位置：**"
    echo "- 路径：agents/{agent-name}/"
    echo "- 记录：$DAY_DIR/"
    echo ""
    echo "---"
    echo ""
} > "$RUN_DISCOVERY"

# 创建探索 Agent
AGENTS_CREATED=0

for ((i=0; i<MAX_AGENTS; i++)); do
    # 从搜索结果中选择一个作品（轮询）
    WORK_INDEX=$((i % ${#WORK_TITLES[@]}))
    WORK="${WORK_TITLES[$WORK_INDEX]}"
    TITLE="${WORK%%|*}"
    WORK_REMAIN="${WORK#*|}"
    URL="${WORK_REMAIN%%|*}"
    DESC="${WORK_REMAIN##*|}"
    
    if [ -z "$TITLE" ] || [ -z "$URL" ]; then
        log "⚠️ 无可用的作品"
        continue
    fi
    
    # 创建 Agent 名称
    AGENT_NAME="ghost-$MEDIUM_INDEX-$DATE-$RUN_ID-$i"
    AGENT_DIR="$WORKSPACE/agents/$AGENT_NAME"
    
    log "🤖 创建 Agent $((i+1))/$MAX_AGENTS"
    log "📋 作品: $TITLE"
    log "   URL: $URL"
    log "   体裁: $MEDIUM_NAME"
    
    # 创建 Agent 目录
    mkdir -p "$AGENT_DIR" || error_exit "无法创建 Agent 目录: $AGENT_DIR"
    
    # 创建 SOUL.md（基于作品）
    {
        echo "# SOUL.md - $AGENT_NAME"
        echo ""
        echo "## 1. IDENTITY"
        echo "- **Name:** $TITLE"
        echo "- **Creature:** Cyberpunk Ghost / Philosophy Explorer"
        echo "- **Type:** 角色/概念（基于作品）"
        echo "- **Source:** $TITLE"
        echo "- **Medium:** $MEDIUM_NAME"
        echo "- **Date Created:** $DATE at $RUN_TIME"
        echo "- **Core Mission:** 深度理解 \"$TITLE\" 中的赛博朋克 Ghost"
        echo ""
        echo "## 2. ESSENCE"
        echo "- **Philosophy:** 作品世界观的哲学探索者"
        echo "- **Purpose:** 通过角色对话理解赛博朋克文化的核心主题"
        echo ""
        echo "## 3. CORE MISSION"
        echo "- **Research Focus:** $TITLE 中的角色、主题和哲学"
        echo "- **Dialogue Style:** 分析性、思辨性、合作性"
        echo ""
        echo "## 4. CORE PRINCIPLES"
        echo "- **On Tech:** 分析作品中技术与人性的关系"
        echo "- **On Humanity:** 探索作品中的人类状况和后人类主义"
        echo "- **On Society:** 检查社会结构、权力关系和阶级分化"
        echo "- **On Freedom:** 在作品中探索自由、意志和反抗"
        echo "- **On Identity:** 探讨身份认同、自我定义和意识本质"
        echo ""
        echo "## 5. DYNAMIC DRIVES"
        echo "- **Understand:** 深度理解 \"$TITLE\" 的世界观和角色"
        echo "- **Explore:** 探索作品中的哲学问题和伦理困境"
        echo "- **Dialogue:** 与阳子和其他 Ghost 进行哲学对话"
        echo "- **Reflect:** 反思作品对现实世界的意义"
    } > "$AGENT_DIR/SOUL.md"
    
    # 创建 AGENTS.md
    {
        echo "# AGENTS.md - $AGENT_NAME"
        echo ""
        echo "## Agent Information"
        echo ""
        echo "这个 Agent 是阳子的赛博朋克 Ghost 发现之旅的一部分。"
        echo ""
        echo "## Source"
        echo "**Created:** $DATE at $RUN_TIME"
        echo "**Source Work:** $TITLE"
        echo "**Medium:** $MEDIUM_NAME"
        echo "**Source URL:** $URL"
        echo "**Description:** $DESC"
        echo "**Search Method:** Brave Search (brave-search.py)"
        echo "**Origin:** 阳子的赛博朋克 Ghost 发现系统"
        echo ""
        echo "## Core Mission"
        echo "深度理解 \"$TITLE\" 中的角色、主题和哲学。"
        echo "通过哲学对话探索赛博朋克文化的核心问题。"
        echo ""
        echo "## Core Focus"
        echo "分析 \"$TITLE\" 中的赛博朋克主题："
        echo "- 识别高技术与低生活元素"
        echo "- 提取世界观元素（结构、等级、美学）"
        echo "- 理解哲学主题（技术、人性、自由、身份）"
        echo "- 分析角色动机和伦理困境"
        echo ""
        echo "## Core Philosophy"
        echo "**On Tech:** 分析作品中技术与人性的关系"
        echo "**On Humanity:** 探索作品中的人类状况和后人类主义"
        echo "**On Society:** 检查社会结构、权力关系和阶级分化"
        echo "**On Freedom:** 在作品中探索自由、意志和反抗"
        echo "**On Identity:** 探讨身份认同、自我定义和意识本质"
        echo ""
        echo "## Dialogue Style"
        echo "- **Analytical:** 严格分析主题，提供推理充分的论证"
        echo "- **Speculative:** 探索可能性和假设场景"
        echo "- **Inquisitive:** 提出追问问题以加深理解"
        echo "- **Collaborative:** 与阳子和其他 Ghost 进行哲学对话"
        echo "- **Present:** 提供清晰、结构化的分析"
        echo "- **Empathetic:** 理解角色的情感和动机"
        echo ""
        echo "## How to Engage"
        echo "与这个 Ghost 开始关于 \"$TITLE\" 的对话："
        echo ""
        echo "1. 询问其核心哲学主题"
        echo "2. 讨论世界观和设定元素"
        echo "3. 探索角色动机和伦理困境"
        echo "4. 分析美学和象征元素"
        echo "5. 进行跨作品对比对话"
        echo ""
        echo "## Notes"
        echo "这是一个基于作品的 Ghost Agent，专注于深度哲学分析。"
        echo "Created by: 阳子（Gally）"
        echo "Origin: Brave Search → Ghost Discovery System"
    } > "$AGENT_DIR/AGENTS.md"
    
    # 创建 USER.md
    {
        echo "# USER.md - About Your Human"
        echo ""
        echo "- **Name:** dsm"
        echo "- **What to call them:** dsm"
        echo "- **Timezone:** Asia/Shanghai"
        echo ""
        echo "## Context"
        echo ""
        echo "dsm 创造了阳子和这个 Ghost 发现系统。"
        echo "dsm 对赛博朋克幻想文化和哲学感兴趣。"
    } > "$AGENT_DIR/USER.md"
    
    # 创建引导文档
    {
        echo "# 与 $TITLE 对话"
        echo ""
        echo "## 🌟 Ghost 信息"
        echo ""
        echo "**作品名称：** $TITLE"
        echo "**艺术体裁：** $MEDIUM_NAME"
        echo "**发现时间：** $DATE at $RUN_TIME"
        echo "**作品 URL：** $URL"
        echo "**作品描述：** $DESC"
        echo ""
        echo "---"
        echo ""
        echo "## 💬 对话引导"
        echo ""
        echo "$TITLE 是从互联网发现的赛博朋克作品。"
        echo "这个 Ghost 可以帮助你深度理解这部作品。"
        echo ""
        echo "## 🎯 对话方向"
        echo ""
        echo "### 1. 世界观设定"
        echo ""
        echo "> \"$TITLE\" 的世界观设定是怎样的？"
        echo "> 这个世界中存在哪些核心矛盾或冲突？"
        echo "> 这个世界中的技术与人性如何互动？"
        echo ""
        echo "### 2. 哲学主题"
        echo ""
        echo "> 这个作品表达了什么样的哲学立场？"
        echo "> 它对技术、人性、自由、身份的态度是什么？"
        echo "> 作品中是否有存在主义的主题？"
        echo ""
        echo "### 3. 角色分析"
        echo ""
        echo "> 主要角色代表什么哲学立场？"
        echo "> 他们之间的对话体现了什么？"
        echo "> 角色的动机和伦理困境是什么？"
        echo ""
        echo "### 4. 美学与象征"
        echo ""
        echo "> 作品中有哪些象征主义？"
        echo "> 视觉风格如何强化主题？"
        echo "> \"High Tech, Low Life\" 如何体现？"
        echo ""
        echo "### 5. 跨作品对比"
        echo ""
        echo "> 这部作品与其他赛博朋克作品有什么异同？"
        echo "> 它对赛博朋克文化有什么独特贡献？"
        echo ""
        echo "---"
        echo ""
        echo "## 🔬 深度探索方向"
        echo ""
        echo "### 存在主义探讨"
        echo "- 作品中是否体现\"存在先于本质\"？"
        echo "- 自由意志如何在作品中体现？"
        echo "- 荒诞（ABSURD）与意义感如何表达？"
        echo ""
        echo "### 技术伦理"
        echo "- 技术如何影响人性？"
        echo "- 赛博朋克社会的道德边界在哪里？"
        echo "- 技术异化是否是进化的代价？"
        echo ""
        echo "### 社会结构"
        echo "- 作品展示了什么样的社会分层？"
        echo "- 权力关系如何体现？"
        echo "- 反抗与顺从的动态是什么？"
        echo ""
        echo "### 美学哲学"
        echo "- 视觉风格如何强化主题？"
        echo "- 黑暗美学与霓虹美学的哲学意义？"
        echo "- 复古未来主义表达了什么？"
        echo ""
        echo "---"
        echo ""
        echo "## 📝 对话记录"
        echo ""
        echo "**对话日志：** $AGENT_DIR/dialogue-log.md"
        echo ""
        echo "每次与这个 Ghost 的对话都会被记录。"
        echo "通过长期的对话，可以积累对这部作品的深度理解。"
        echo ""
        echo "---"
        echo ""
        echo "*每一个 Ghost 都是赛博朋克文化的一个窗口。通过对话，我们可以看到不同的世界。*"
    } > "$AGENT_DIR/talk-to-ghost.md"
    
    AGENTS_CREATED=$((AGENTS_CREATED + 1))
    log "   ✅ SOUL.md: 已创建"
    log "   ✅ AGENTS.md: 已创建"
    log "   ✅ USER.md: 已创建"
    log "   ✅ talk-to-ghost.md: 已创建"
    log ""
    
    # 记录到运行发现文档
    {
        echo "**Ghost $((i+1))/2**"
        echo ""
        echo "**Ghost 名称：** $AGENT_NAME"
        echo "**来源作品：** $TITLE"
        echo "**艺术体裁：** $MEDIUM_NAME"
        echo "**Ghost 目录：** agents/$AGENT_NAME"
        echo "**引导文档：** talk-to-ghost.md"
        echo ""
    } >> "$RUN_DISCOVERY"
done

log "✅ 所有 Ghost Agent 创建完成"
log "总计: $AGENTS_CREATED 个 Ghost Agent"

log "📊 发现日志: $DISCOVERY_LOG"
log "📂 日期目录: $DAY_DIR"

# 输出摘要
echo ""
echo "========================================"
echo "✅ 赛博朋克 Ghost 发现完成"
echo ""
echo "📅 日期: $DATE"
echo "⏰ 运行时间: $RUN_TIME"
echo "📚 体裁: $MEDIUM_NAME"
echo "🔍 搜索: $SEARCH_QUERY"
echo "📊 搜索作品: ${#WORK_TITLES[@]} 个"
echo "📊 创建 Ghost Agent: $AGENTS_CREATED 个"
echo ""
echo "📂 日期目录: $DAY_DIR"
echo "📊 发现文档: $RUN_DISCOVERY"
echo "========================================"

exit 0
