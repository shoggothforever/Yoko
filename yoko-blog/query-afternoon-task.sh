#!/bin/bash

# 查询下午任务会话历史的脚本
# 会话信息：agent:main:qqbot:dm:cf11a5219cb2f98d56f297a0465d23f9
# 会话文件：/root/.openclaw/agents/main/sessions/dd71a757-47ae-4274-b497-454a7cc39df1.jsonl

SESSION_FILE="/root/.openclaw/agents/main/sessions/dd71a757-47ae-4274-b497-454a7cc39df1.jsonl"
OUTPUT_FILE="session-history.txt"

echo "=== OpenClaw 会话历史查询 ==="
echo "会话：下午任务 - QQ Bot"
echo "时间：$(date)"
echo "----------------------------"
echo ""

# 检查会话文件是否存在
if [ ! -f "$SESSION_FILE" ]; then
    echo "错误：会话文件不存在：$SESSION_FILE"
    echo "请检查会话路径是否正确"
    exit 1
fi

# 使用 openclaw sessions 命令查询会话信息
echo "=== 会话基本信息 ==="
openclaw sessions list --kinds "agent:main:qqbot:dm:cf11a5219cb2f98d56f297a0465d23f9" 2>/dev/null || echo "无法获取会话列表信息"
echo ""

echo "=== 会话历史记录 ==="
echo "会话文件路径：$SESSION_FILE"
echo "会话文件大小：$(stat -c%s "$SESSION_FILE" 2>/dev/null || stat -f%z "$SESSION_FILE" 2>/dev/null) 字节"
echo "消息数量：$(wc -l < "$SESSION_FILE" 2>/dev/null)"
echo ""

# 提取和显示会话历史
echo "=== 会话历史内容 ==="
echo "----------------------"
cat "$SESSION_FILE" | jq -r '
    if .text then
        "[" + (if .createdAt then (.createdAt | strptime("%Y-%m-%dT%H:%M:%S.%fZ") | strftime("%m-%d %H:%M:%S")) else "未知时间" end) + "] " +
        (if .role == "user" then "用户" else "系统" end) + ": " + 
        (.text | gsub("\n"; " "))
    else
        "[" + (if .createdAt then (.createdAt | strptime("%Y-%m-%dT%H:%M:%S.%fZ") | strftime("%m-%d %H:%M:%S")) else "未知时间" end) + "] " +
        (if .role == "user" then "用户" else "系统" end) + ": " + 
        (.toolCalls // .toolResults // "工具调用")
    end
' 2>/dev/null || cat "$SESSION_FILE"
echo ""

# 检查是否安装了 jq
if ! command -v jq &> /dev/null; then
    echo "警告：未安装 jq 工具，无法进行详细的 Token 分析"
    echo ""
else
    # Token 使用分析
    echo "=== Token 使用分析 ==="
    echo "----------------------"
    
    # 计算总 Token 使用
    TOTAL_TOKENS=$(jq -r '.usage // {} | .promptTokens + .completionTokens' "$SESSION_FILE" | awk '{sum += $1} END {print sum}')
    PROMPT_TOKENS=$(jq -r '.usage // {} | .promptTokens' "$SESSION_FILE" | awk '{sum += $1} END {print sum}')
    COMPLETION_TOKENS=$(jq -r '.usage // {} | .completionTokens' "$SESSION_FILE" | awk '{sum += $1} END {print sum}')
    
    echo "总 Token 使用：${TOTAL_TOKENS}"
    echo "提示词 Token：${PROMPT_TOKENS}"
    echo "完成 Token：${COMPLETION_TOKENS}"
    echo ""
    
    # 检查是否有 Token 超标（超过 8k）
    OVER_8K=$(jq -r '
        if (.usage // {} | .promptTokens + .completionTokens > 8000) then
            "[" + (if .createdAt then (.createdAt | strptime("%Y-%m-%dT%H:%M:%S.%fZ") | strftime("%m-%d %H:%M:%S")) else "未知时间" end) + "] " +
            "Token 超标：" + (.usage.promptTokens + .usage.completionTokens | tostring) + " (提示词:" + (.usage.promptTokens | tostring) + ", 完成:" + (.usage.completionTokens | tostring) + ")"
        else
            empty
        end
    ' "$SESSION_FILE")
    
    if [ -n "$OVER_8K" ]; then
        echo "⚠️  Token 超标阶段："
        echo "$OVER_8K"
    else
        echo "✅ Token 使用正常，未发现超标阶段"
    fi
fi

# 保存到输出文件
echo "=== 会话历史查询结果 ===" > "$OUTPUT_FILE"
echo "会话：下午任务 - QQ Bot" >> "$OUTPUT_FILE"
echo "查询时间：$(date)" >> "$OUTPUT_FILE"
echo "----------------------------" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "=== 会话基本信息 ===" >> "$OUTPUT_FILE"
openclaw sessions list --kinds "agent:main:qqbot:dm:cf11a5219cb2f98d56f297a0465d23f9" 2>&1 >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "=== 会话历史记录 ===" >> "$OUTPUT_FILE"
echo "会话文件路径：$SESSION_FILE" >> "$OUTPUT_FILE"
echo "会话文件大小：$(stat -c%s "$SESSION_FILE" 2>/dev/null || stat -f%z "$SESSION_FILE" 2>/dev/null) 字节" >> "$OUTPUT_FILE"
echo "消息数量：$(wc -l < "$SESSION_FILE" 2>/dev/null)" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "=== Token 使用分析 ===" >> "$OUTPUT_FILE"
echo "总 Token 使用：${TOTAL_TOKENS}" >> "$OUTPUT_FILE"
echo "提示词 Token：${PROMPT_TOKENS}" >> "$OUTPUT_FILE"
echo "完成 Token：${COMPLETION_TOKENS}" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

if [ -n "$OVER_8K" ]; then
    echo "⚠️  Token 超标阶段：" >> "$OUTPUT_FILE"
    echo "$OVER_8K" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
else
    echo "✅ Token 使用正常，未发现超标阶段" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
fi

echo "=== 会话历史内容 ===" >> "$OUTPUT_FILE"
echo "----------------------" >> "$OUTPUT_FILE"
cat "$SESSION_FILE" >> "$OUTPUT_FILE"

echo ""
echo "=== 查询完成 ==="
echo "完整结果已保存到：$OUTPUT_FILE"
echo ""
echo "使用以下命令查看更详细的分析："
echo "  jq .usage ${SESSION_FILE} | head -20"
echo "  cat ${OUTPUT_FILE}"
