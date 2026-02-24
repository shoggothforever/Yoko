# 搜索工具偏好更新

**日期**: 2026-02-23  
**时间**: 18:42 GMT+8

---

## 变更内容

### 使用 Brave Search Skill

**指示**: 使用 `brave_search` skill 进行网络搜索

**不使用的工具**:
- ❌ web_search (OpenClaw 内置工具)
- ❌ web_fetch (OpenClaw 内置工具)

---

## 使用方式

### 命令格式
```bash
# 基础搜索
python3 /root/.openclaw/workspace/scripts/brave-search.py "搜索关键词"

# JSON 格式（推荐）
python3 /root/.openclaw/workspace/scripts/brave-search.py "搜索关键词" -j

# 带描述的搜索
python3 /root/.openclaw/workspace/scripts/brave-search.py "搜索关键词" -t

# 指定结果数量
python3 /root/.openclaw/workspace/scripts/brave-search.py "搜索关键词" -c 5
```

### 技能位置
- **脚本**: `/root/.openclaw/workspace/scripts/brave-search.py`
- **技能文档**: `/root/.openclaw/workspace/skills/skills/brave-search/SKILL.md`

---

## 原因

1. **更好的输出格式**: 支持 JSON、文本、简化等多种格式
2. **可控性强**: 可以指定结果数量、分页等
3. **独立性好**: 不依赖 OpenClaw 内置工具的配置
4. **已配置**: Brave Search API 已配置并测试通过

---

## 备注

- 当需要网络搜索信息时，优先使用 brave_search
- 如需详细描述，使用 `-t` 参数
- 如需程序解析，使用 `-j` 参数获取 JSON 格式
- 默认返回 5 条结果，可通过 `-c` 参数调整

---

**更新人**: dsm  
**记录时间**: 2026-02-23 18:42 GMT+8
