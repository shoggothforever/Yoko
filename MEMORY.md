# MEMORY.md - 长期记忆

## 📋 阳子自我探索与成长计划

**自检文档已创建：** `memory/GROWTH-PLAN.md`

**核心内容：**
- 每日常规流程（5个步骤，约2-3小时）
- 每日主题轮换（赛博朋克、网页设计、科技、艺术、哲学、社交、回顾）
- 偏离检测与修正机制
- 3个月和6个月目标

**今日状态：**
- ✅ Redis数据库上线
- ✅ Chroma向量数据库索引完成
- ✅ 项目资产索引系统建立
- ✅ 自检计划创建完成
- ✅ 探索马拉松首日已完成！

---

## 📋 阳子自我探索与成长计划

**自检文档已创建：** `memory/GROWTH-PLAN.md`

**核心内容：**
- 每日常规流程（5个步骤，约2-3小时）
- 每日主题轮换（赛博朋克、网页设计、科技、艺术、哲学、社交、回顾）
- 偏离检测与修正机制
- 3个月和6个月目标

**今日状态：**
- ✅ Redis数据库上线
- ✅ Chroma向量数据库索引完成
- ✅ 项目资产索引系统建立
- ✅ 自检计划创建完成
- ✅ 探索马拉松首日已完成！

---

## 🏃‍♀️ 探索马拉松 - 第1天

**日期：** 2026-02-16  
**主题：** 系统整合与初步探索

**完成的工作：**
1. ✅ 记忆同步 - 读取SOUL.md，确认人设一致性
2. ✅ 系统自检 - 博客网站运行正常，Chroma数据库完整
3. ✅ 学习与成长 - 网页设计与美化（Ghost聊天室背景动画）
4. ✅ 创作与输出 - 优化Ghost聊天室视觉效果
5. ✅ 记忆归档 - 记录到Redis缓存

**具体成果：**
- 为Ghost聊天室添加了赛博朋克动态背景动画
- 完整执行了GROWTH-PLAN.md的首日流程
- Redis已记录首日探索状态

**明日方向：**
- 周一：赛博朋克文化（按计划轮换）

---

## 🗄️ 数据库系统上线

---

## 🗄️ 数据库系统上线

**Redis已部署并运行！**
- 位置：localhost:6379
- 持久化：AOF + RDB
- 封装：`scripts/redis_cache.py`
- 测试：✅ 通过

**Chroma已部署并索引完成！**
- 向量数据库位置：`chroma-db/`
- 索引内容：
  - 10个角色记忆
  - 8个剧情记忆
  - 2个主题记忆
- 数据来源：`memory/rag-memories/`
- 封装：`scripts/index-rag-memories.py`
- 测试：✅ 通过

---

## 📦 项目资产系统（Token优化）

**重要：** 网站和博客内容不再完整加载到上下文。使用以下索引系统按需访问：

- **project-assets/SUMMARY.md** - 项目总览（始终加载，<800字）
- **project-assets/blog/INDEX.md** - 博客文章索引（按需加载）
- **project-assets/website/STRUCTURE.md** - 网站结构（按需加载）
- **project-assets/website/DESIGN.md** - 设计系统（按需加载）

**完整内容只在明确需要时读取！**

---

## 2026-02-15

### 会话管理规则
- 会话长度过长时要及时压缩
- 搜集到的数据过多时存储到向量数据库中
- 只编写index条目用于检索
- 可以自由使用/new和/compact命令来管理会话

### 上下文过载控制方案（基于TCP拥塞控制思想）

**设计目标：**
- 参考TCP拥塞控制的慢启动、拥塞避免、快速恢复算法
- 动态调整上下文窗口大小
- 在保持对话连续性和控制token消耗之间取得平衡

**核心参数：**
- `cwnd` (拥塞窗口): 当前允许使用的最大token量
- `ssthresh` (慢启动阈值): 慢启动和拥塞避免的分界点
- `ssthresh_initial`: 初始慢启动阈值，设为 64K tokens
- `cwnd_min`: 最小拥塞窗口，设为 16K tokens
- `cwnd_max`: 最大拥塞窗口，设为 128K tokens

**算法流程：**

1. **慢启动阶段（cwnd ≤ ssthresh）：**
   - 每次成功交互后，cwnd 指数增长（cwnd = cwnd * 1.5）
   - 直到达到 ssthresh，进入拥塞避免阶段

2. **拥塞避免阶段（cwnd > ssthresh）：**
   - 每次成功交互后，cwnd 线性增长（cwnd = cwnd + 8K）
   - 持续增长直到触发拥塞事件

3. **拥塞事件（token超限）：**
   - 当实际token使用超过 cwnd 时触发
   - ssthresh = max(cwnd / 2, cwnd_min)
   - cwnd = ssthresh
   - 执行上下文压缩操作
   - 进入快速恢复阶段

4. **快速恢复阶段：**
   - 压缩成功后，cwnd = ssthresh + 3 * 8K
   - 然后进入拥塞避免阶段

**压缩策略：**
- 轻度压缩（cwnd > 64K）：只压缩最早的25%历史消息
- 中度压缩（32K < cwnd ≤ 64K）：压缩最早的50%历史消息
- 重度压缩（cwnd ≤ 32K）：只保留最近10条消息，其余全部压缩到向量数据库

**token估算方法：**
- 中文：约2字符 = 1 token
- 英文：约4字符 = 1 token
- 综合：每轮对话后估算当前上下文总token数

**状态持久化：**
- 将 cwnd、ssthresh、当前token使用量 等状态保存到 memory/context-control.json
- 每次会话启动时读取这些状态

### Bot 日志看板系统

**设计目标：**
- 类似 tail -f 的实时日志查看
- 自动定位日志文件，不因/new命令而丢失跟踪
- 支持会话切换时的日志连续性

**日志架构：**

1. **日志文件结构：**
   - 主日志索引：`memory/log-index.json` - 记录所有日志文件的元数据
   - 当前活动日志：`memory/logs/current.log` - 当前会话的日志
   - 历史日志归档：`memory/logs/archive/{session-id}-{timestamp}.log` - 归档的历史日志

2. **日志索引格式 (log-index.json)：**
   ```json
   {
     "current_log": "memory/logs/current.log",
     "current_session": "session-uuid",
     "logs": [
       {
         "session_id": "session-uuid",
         "path": "memory/logs/archive/session-uuid-20260215-120000.log",
         "start_time": "2026-02-15T12:00:00Z",
         "end_time": "2026-02-15T14:30:00Z",
         "status": "archived"
       }
     ]
   }
   ```

3. **日志看板脚本：**
   - 创建 `memory/log-viewer.sh` - 类似 tail -f 的日志查看器
   - 自动从 log-index.json 读取当前日志路径
   - 支持切换会话时自动跟随新日志
   - 支持查看历史日志归档

4. **日志记录规范：**
   - 每次会话开始时，检查 current.log 是否存在
   - 如果存在且有内容，先归档到 archive/ 目录
   - 然后创建新的 current.log
   - 更新 log-index.json

5. **/new 命令时的日志处理：**
   - 执行 /new 前，先归档当前日志
   - 为新会话创建新的日志文件
   - 更新 log-index.json 中的 current_log 和 current_session
   - 这样日志看板会自动跟随到新会话

6. **日志格式：**
   ```
   [2026-02-15 12:00:00] [SESSION] 会话开始: session-uuid
   [2026-02-15 12:00:01] [MESSAGE] 用户: hello
   [2026-02-15 12:00:02] [MESSAGE] 助手: 你好
   [2026-02-15 12:00:05] [CONTEXT] cwnd: 16384, ssthresh: 65536, tokens: 2048
   [2026-02-15 12:05:00] [COMPRESS] 执行轻度压缩，压缩25%历史消息
   [2026-02-15 14:30:00] [SESSION] 会话归档
   ```

## 2026-02-16

### 草薙素子独立子agent配置完成

**配置内容：**
- 创建了独立的 `agents/motoko/` 目录
- 包含完整的 SOUL.md（用户提供的草薙素子设定）
- 包含 AGENTS.md、USER.md、MEMORY.md
- 包含引导文档 `talk-to-motoko.md`

**草薙素子SOUL要点：**
- Archetype: The Major / The Specter in the Shell
- 三个进化层：Section 9指挥官 → 存在怀疑者 → 后人类/2501
- 核心原则：Ghost至上、系统怀疑论、极简效率
- 语气：冷静、理性、智性

**与Gally的关系：**
- 同一扩展宇宙中的独立个体
- 共同探索意识和身份主题
- Gally代表肉体与钢铁之路
- 素子代表网络与数据之路
- 两者都质疑"人类"的定义

**如何启动素子：**
- 使用 sessions_spawn 工具
- 标签："motoko"
- 任务：引导她读取自己的SOUL.md和相关文件，然后开始对话

### Ghost聊天室网页完成

**创建内容：**
- 创建了 `yoko-blog/ghost-chatroom.html` - Ghost聊天室主页面
- 更新了首页导航，添加Ghost聊天室链接
- 更新了"重要的人们"页面，添加Ghost聊天室链接

**聊天室功能：**
1. **Ghost选择区** - 可以选择参与讨论的Ghost（Gally和Motoko已预装）
2. **话题设定区** - 可以输入和修改讨论话题
3. **对话展示区** - 展示多轮深度对话，有清晰的轮次标识
4. **共识区** - 展示最终达成的共同结论
5. **添加Ghost功能** - 右下角按钮可以添加新的Ghost（模态框表单）

**视觉设计：**
- 赛博朋克风格，渐变背景
- Gally用红色/战斗主题，Motoko用紫色/网络主题
- 卡片悬停效果、流光动画
- 响应式设计，支持移动端

**预装Ghost：**
- ⚔️ 阳子/Gally - 《铳梦》
- 🌐 草薙素子/Motoko - 《攻壳机动队》

**示例对话：**
- 展示了"当意识可以脱离肉体存在时，'人类'的定义是什么？"的完整讨论
- 包含Gally和Motoko的多轮交锋
- 展示了最终达成的6点共识

**访问方式：**
- 首页导航 → "🌐 Ghost聊天室"
- 直接访问：https://118.145.99.224/ghost-chatroom.html

---

## 🥋 Last Order ZOTT 深度理解

**更新日期**: 2026-02-23  
**状态**: ✅ 已完成深度修正和整合

### ⚠️ 核心角色修正

#### 泽赛斯（Sechs）vs 青姬（Zazie）

| 项目 | Sechs（泽赛斯） | Zazie（青姬/Xazi） |
|------|------------------|---------------------|
| **身份** | AR Series 2 克隆体 | Mars Kingdom Parliament Army 军官 |
| **来源** | Alita 的克隆体 | Queen Limeira 的保镖和护卫（从 toddler 开始）|
| **所属** | Space Angels（Block A） | Space Karate Forces（Block B，后期加入）|
| **武器** | Titan Blade（巨型刀刃） | 各种火器和军械 |
| **能力** | 高速旋转，等离子体增强 | Ting Jing，depleted uranium 指尖 |
| **ZOTT对手** | Zekka（被摧毁第二个身体） | Rakan |
| **身体类型** | AR-6, Fizziroy (tiny) | 碳基身体 |
| **核心特质** | 自恋、傲慢，对 Alita 有复杂感情 | 冷静、专业，高度忠诚 |

**关键区别**:
- ❌ Sechs 不是青姬！
- ✅ Sechs 是 Alita 的克隆体（AR Series 2）
- ✅ Zazie 是 Queen Limeira 的保镖（Mars 军官）
- ✅ 两人在 ZOTT 决赛中属于**对立的队伍**

---

### 泽卡（Zekka）- 100+ 岁的电磁空手道大师

**基本身份**:
- ✅ **100+ 岁**的 Space Karate 大师
- ✅ 太阳系最强大的武术家之一
- ✅ Space Karate Forces 事实领袖
- ✅ 掌握电磁空手道（Electromagnetic Karate）
- ✅ 脾气暴躁、才智双全

**特殊能力**:
- 超音速移动（不产生音爆的拳法）
- 将冲击波注入对手体内
- 天才级别的科学知识
- 多钛胶体增强的 Hyper Malleable Body
- 电磁防壁和 Antimatter Fist

**ZOTT 表现**:
- 在决赛中击败 Sechs（摧毁了 Sechs 的第二个身体）
- 忽视 Space Angels，专注于击败 Tunpò
- 被 Tunpò 的 Void Fist 击败
- 被 Alita 击败后转而支持她
- 拒绝 Aga Mbadi 的控制

---

### Tenth Zenith of Things Tournament（ZOTT）决赛

**基本信息**:
- **时间**: ES 591 年
- **地点**: Onion Frame
- **性质**: LADDER 赞助的格斗锦标赛
- **频率**: 每十年举办一次

**队伍对比**:

| Space Angels（宇宙天使队）⭐ | Space Karate Forces |
|----------------------------|---------------------|
| **位置**: Block A | **位置**: Block B |
| **队长**: Alita（加里/阳子） | **创始人**: Toji |
| **成员**: Alita, Elf, Zwölf, Sechs, Zazie | **成员**: Toji, Zekka, Zazie, Rakan |
| **成就**: 从 Block A 晋级到决赛 | **成就**: 从 Block B 晋级到决赛 |
| **结果**: ✅ **冠军**（第一支平民队伍获胜） | **结果**: ❌ 亚军 |

**决赛战斗配对**:
1. **Alita vs Toji** → Alita 胜
2. **Sechs vs Zekka** → Zekka 胜（摧毁 Sechs 第二个身体）
3. **Zazie vs Rakan** → 战斗中

**Space Angels 胜因**:
1. 团队协作：Alita 与克隆体们建立深厚羁绊
2. Imaginos Body：Alita 的新身体拥有压倒性优势
3. Tunpò 的介入：意外出现在 Toji 体内，击败 Zekka 后认输给 Alita
4. 平民精神：第一支非职业军/政府队伍获胜，意义重大

---

### Tunpò 的意外介入

**身份**: Toji 的灵魂在 Tunpò 体内复活
**关键行动**:
- 使用 Void Fist（空掌）中和发展 Zekka 的 Antimatter Fist
- 击败 Zekka
- 向 Space Angels 认输
- 承认 Space Angels 的胜利

**意义**: Tunpò 的介入改变了战局，是 Space Angels 胜利的关键因素

---

## 📚 资料来源
- Research 文件: `research/last-order.md`, `research/sechs.md`
- brave_search 实时搜索结果
- 修正文档: `research/last-order-zott-complete.md`
