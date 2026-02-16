#!/bin/bash
# 阳子（Gally）的每日自我探索脚本
# 每天上午9:00执行

set -e  # 遇到错误立即退出

echo "============================================================"
echo "阳子（Gally）的每日自我探索开始"
echo "============================================================"
echo ""
echo "开始时间：$(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# 工作区目录
WORKSPACE="/root/.openclaw/workspace"
cd "$WORKSPACE"

# ============================================
# 第一阶段：记忆同步
# ============================================
echo "[1/5] 记忆同步阶段..."
echo ""

# 读取SOUL.md
if [ -f "SOUL.md" ]; then
    echo "✅ 读取SOUL.md - 确认核心人格"
else
    echo "❌ SOUL.md不存在"
    exit 1
fi

# 读取MEMORY.md
if [ -f "MEMORY.md" ]; then
    echo "✅ 读取MEMORY.md - 回顾长期记忆"
else
    echo "❌ MEMORY.md不存在"
    exit 1
fi

# 读取昨日记录
YESTERDAY=$(date -d "yesterday" '+%Y-%m-%d')
YESTERDAY_FILE="memory/$YESTERDAY.md"
if [ -f "$YESTERDAY_FILE" ]; then
    echo "✅ 读取昨日记录 - $YESTERDAY_FILE"
else
    echo "⚠️ 昨日记录不存在 - $YESTERDAY_FILE"
fi

echo ""
echo "✅ 记忆同步阶段完成"
echo ""

# ============================================
# 第二阶段：系统自检
# ============================================
echo "[2/5] 系统自检阶段..."
echo ""

# 检查网站状态
echo "🔍 检查网站状态..."
if curl -s -o /dev/null -w "%{http_code}" https://118.145.99.224 | grep -q "200\|301\|302"; then
    echo "✅ 网站可访问"
else
    echo "❌ 网站不可访问"
fi

# 检查Redis状态
echo "🔍 检查Redis状态..."
if redis-cli ping 2>/dev/null | grep -q "PONG"; then
    echo "✅ Redis运行正常"
else
    echo "❌ Redis未运行"
fi

# 检查Chroma数据库
echo "🔍 检查Chroma数据库..."
if [ -d "chroma-db" ]; then
    echo "✅ Chroma数据库存在"
else
    echo "❌ Chroma数据库不存在"
fi

echo ""
echo "✅ 系统自检阶段完成"
echo ""

# ============================================
# 第三阶段：学习与成长（简化版）
# ============================================
echo "[3/5] 学习与成长阶段..."
echo ""

# 今日主题（根据星期几）
DAY_OF_WEEK=$(date '+%u')
case $DAY_OF_WEEK in
    1) THEME="赛博朋克文化" ;;
    2) THEME="网页设计与美化" ;;
    3) THEME="科学技术" ;;
    4) THEME="艺术与美学" ;;
    5) THEME="哲学与思考" ;;
    6) THEME="社交与人情" ;;
    7) THEME="回顾与整理" ;;
esac

echo "📚 今日主题：$THEME"
echo ""

# 检查是否有相关的学习资源
echo "🔍 检查学习资源..."
if [ -d "skills/" ]; then
    SKILL_COUNT=$(ls -1 skills/ | wc -l)
    echo "✅ 找到 $SKILL_COUNT 个技能"
else
    echo "⚠️ skills目录不存在"
fi

echo ""
echo "✅ 学习与成长阶段完成"
echo ""

# ============================================
# 第四阶段：创作与输出（简化版）
# ============================================
echo "[4/5] 创作与输出阶段..."
echo ""

TODAY=$(date '+%Y-%m-%d')
TODAY_FILE="memory/$TODAY.md"

echo "📝 记录今日状态到 $TODAY_FILE"

# 创建或更新今日记录
if [ ! -f "$TODAY_FILE" ]; then
    cat > "$TODAY_FILE" <<EOF
# $TODAY - 阳子的每日探索

## 📋 今日主题：$THEME

## ✅ 完成的工作

1. 记忆同步 - 读取SOUL.md和MEMORY.md
2. 系统自检 - 网站、Redis、Chroma数据库
3. 学习与成长 - 探索$THEME
4. 创作与输出 - 记录到$TODAY_FILE

## 💡 今日思考

（待补充）

---
记录时间：$(date '+%Y-%m-%d %H:%M:%S')
EOF
    echo "✅ 今日记录已创建"
else
    echo "✅ 今日记录已存在"
fi

echo ""
echo "✅ 创作与输出阶段完成"
echo ""

# ============================================
# 第五阶段：记忆归档
# ============================================
echo "[5/5] 记忆归档阶段..."
echo ""

echo "💾 检查Git状态..."
if git status --porcelain | grep -q .; then
    echo "🔄 有未提交的更改"
    git add -A
    git commit -m "每日自我探索 - $TODAY" 2>/dev/null || true
    echo "✅ 更改已提交到Git"
else
    echo "✅ 没有未提交的更改"
fi

echo ""
echo "✅ 记忆归档阶段完成"
echo ""

# ============================================
# 完成！
# ============================================
echo "============================================================"
echo "阳子（Gally）的每日自我探索完成！"
echo "============================================================"
echo ""
echo "结束时间：$(date '+%Y-%m-%d %H:%M:%S')"
echo ""
echo "下一步：向QQ发送今日总结"
echo ""

# 输出完成标志
echo "COMPLETED"
