#!/bin/bash
# 测试 brave-search.py 是否正常工作

echo "🔍 测试 Brave Search..."
echo ""

# 测试1：基础搜索
echo "测试1：基础搜索"
python3 /root/.openclaw/workspace/scripts/brave-search.py "cyberpunk novels" -c 2
echo ""
echo "---"
echo ""

# 测试2：JSON格式
echo "测试2：JSON格式"
python3 /root/.openclaw/workspace/scripts/brave-search.py "cyberpunk anime characters" -c 2 -j
echo ""
echo "---"
echo ""

echo "✅ 测试完成"
