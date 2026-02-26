/**
 * Brave Search Skill
 * 
 * 此技能封装了 Brave Search API，提供更强大的网络搜索能力
 * 
 * 主要功能：
 * - 基础网络搜索
 * - 支持 JSON/文本/简化格式输出
 * - 自动代理支持
 * - 高级搜索选项（分页、数量控制）
 * 
 * 使用方式：
 * - 简单搜索：python3 /root/.openclaw/workspace/scripts/brave-search.py "query"
 * - JSON 输出：python3 /root/.openclaw/workspace/scripts/brave-search.py "query" -j
 * - 带描述：python3 /root/.openclaw/workspace/scripts/brave-search.py "query" -t
 * - 指定数量：python3 /root/.openclaw/workspace/scripts/brave-search.py "query" -c 5
 * 
 * 详细文档请参考 SKILL.md
 */

module.exports = {
  name: 'brave-search',
  version: '1.0.0',
  description: 'Brave Search API 集成技能',
  
  async execute(query, options = {}) {
    // 此技能主要通过 Python 脚本使用
    // 这里仅作为元数据入口
    const { count = 5, format = 'simple' } = options;
    
    return {
      script: '/root/.openclaw/workspace/scripts/brave-search.py',
      query,
      options
    };
  }
};
