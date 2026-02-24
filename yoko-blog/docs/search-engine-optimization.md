# 网站搜索引擎优化

## 目标
实现一个强大、快速的搜索引擎，支持全文搜索、标签搜索、日期筛选和结果排序。

## 功能需求

### 基础功能
- ✅ 实时搜索（无刷新）
- ✅ 大小写不敏感
- ✅ 支持标题、摘要、标签搜索
- ✅ 搜索结果高亮
- ✅ 空键盘操作（Esc清空，Enter提交）

### 高级功能
- 🔲 按标签筛选
- 🔲 按日期范围筛选
- 🔲 搜索结果排序（相关度、日期）
- 🔲 搜索历史
- 🔲 搜索建议（自动完成）
- 🔲 搜索统计（结果数量、耗时）

### 性能要求
- 首次搜索 < 50ms
- 大量文章（100+）时 < 100ms
- 不阻塞UI
- 防抖处理（300ms）
- 使用Web Workers（未来）

---

## 实现方案

### 数据结构

```javascript
// 文章索引数据结构
{
  "posts": [
    {
      "id": "cyber-ghost",
      "title": "赛博空间的幽灵——当意识可以脱离肉体存在时",
      "excerpt": "探讨当意识可以上传到网络时的存在困境",
      "date": "2025-02-05",
      "tags": ["赛博朋克", "意识上传", "数字化存在", "哲学思考"],
      "wordCount": 1400,
      "readTime": "约8分钟",
      "author": "阳子",
      "url": "posts/cyber-ghost.html"
    }
    // ... 更多文章
  ],
  "tags": [
    { "name": "赛博朋克", "count": 15 },
    { "name": "铳梦", "count": 8 },
    { "name": "哲学思考", "count": 5 }
    // ... 更多标签
  ]
}
```

### 搜索算法

#### 相关度计算

```javascript
function calculateRelevance(query, post) {
  const queryLower = query.toLowerCase();
  
  // 标题匹配（权重：0.5）
  const titleScore = post.title.toLowerCase().includes(queryLower) ? 0.5 : 0;
  
  // 摘要匹配（权重：0.3）
  const excerptScore = post.excerpt.toLowerCase().includes(queryLower) ? 0.3 : 0;
  
  // 标签匹配（权重：0.2）
  const tagScore = post.tags.some(tag => tag.toLowerCase().includes(queryLower)) ? 0.2 : 0;
  
  return titleScore + excerptScore + tagScore;
}
```

#### 防抖处理

```javascript
let searchTimeout = null;
const SEARCH_DELAY = 300; // 300ms

function debouncedSearch(query) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    performSearch(query);
  }, SEARCH_DELAY);
}
```

### 性能优化

1. **预加载索引**：页面加载时预先生成搜索索引
2. **结果缓存**：缓存相同查询的结果
3. **虚拟滚动**：搜索结果使用虚拟滚动，提升性能
4. **Web Workers**：大量文章时使用Web Workers进行搜索

---

## UI设计

### 搜索框设计

```html
<div class="search-container">
  <input 
    type="text" 
    id="search-input"
    class="search-input"
    placeholder="搜索文章（标题、标签、内容）..."
    aria-label="搜索文章"
    autocomplete="off"
  >
  <button id="search-clear" class="search-clear" aria-label="清除搜索">
    ✕
  </button>
  <div id="search-suggestions" class="search-suggestions"></div>
</div>
```

### 搜索结果展示

```html
<div class="search-results" id="search-results">
  <div class="search-stats">
    <span id="result-count">找到 0 篇文章</span>
    <span id="search-time"></span>
  </div>
  <div id="results-list" class="results-list">
    <!-- 搜索结果动态生成 -->
  </div>
  <div class="search-filters">
    <div class="filter-group">
      <h3>标签筛选</h3>
      <div class="tag-filters" id="tag-filters">
        <!-- 标签筛选动态生成 -->
      </div>
    </div>
    <div class="filter-group">
      <h3>日期筛选</h3>
      <input type="date" id="date-from" placeholder="开始日期">
      <input type="date" id="date-to" placeholder="结束日期">
    </div>
    <div class="filter-group">
      <h3>排序方式</h3>
      <select id="sort-select">
        <option value="relevance">相关度排序</option>
        <option value="date-asc">日期（从新到旧）</option>
        <option value="date-desc">日期（从旧到新）</option>
        <option value="title">标题排序</option>
      </select>
    </div>
  </div>
</div>
```

### CSS样式

```css
.search-container {
    position: relative;
    margin-bottom: 20px;
}

.search-input {
    width: 100%;
    padding: 15px 20px;
    background: rgba(32, 32, 64, 0.3);
    border: 2px solid #e94560;
    border-radius: 12px;
    color: #e0e0e0;
    font-size: 1.1em;
    transition: all 0.3s ease;
    padding-right: 40px;
}

.search-input:focus {
    outline: none;
    border-color: #533483;
    box-shadow: 0 0 20px rgba(83, 52, 131, 0.3);
    background: rgba(32, 32, 64, 0.5);
}

.search-clear {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(233, 69, 96, 0.3);
    border: 1px solid #e94560;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    color: #e94560;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.search-clear:hover {
    background: #e94560;
    color: #0a0a0a0a;
}

.search-suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    background: rgba(32, 32, 64, 0.9);
    border: 1px solid #533483;
    border-radius: 8px;
    margin-top: 5px;
    padding: 10px 15px;
    z-index: 100;
    display: none;
}

.search-suggestions.show {
    display: block;
    animation: fadeIn 0.3s ease;
}

.search-suggestion {
    padding: 8px 12px;
    color: #e0e0e0;
    cursor: pointer;
    transition: background 0.2s ease;
    border-radius: 4px;
}

.search-suggestion:hover {
    background: rgba(233, 69, 96, 0.2);
}

.search-suggestion .match {
    color: #e94560;
    font-weight: bold;
}

.search-results {
    background: rgba(20, 20, 40, 0.8);
    border-radius: 12px;
    padding: 20px;
    margin-top: 20px;
    display: none;
}

.search-results.show {
    display: block;
    animation: slideUp 0.3s ease;
}

.search-stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(83, 52, 131, 0.3);
    color: #a0a0ff;
    font-size: 0.9em;
}

.search-stats strong {
    color: #e94560;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

---

## JavaScript实现

### 搜索引擎

```javascript
class BlogSearchEngine {
    constructor() {
        this.posts = [];
        this.tags = [];
        this.searchHistory = [];
        this.maxHistory = 10;
        this.cache = new Map();
        this.filters = {
            tags: new Set(),
            dateFrom: null,
            dateTo: null,
            sortBy: 'relevance'
        };
    }

    async init() {
        try {
            // 加载搜索索引
            const response = await fetch('/search-index.json');
            const indexData = await response.json();
            this.posts = indexData.posts;
            this.tags = indexData.tags;
            
            console.log(`搜索引擎初始化完成：${this.posts.length} 篇文章，${this.tags.length} 个标签`);
            return true;
        } catch (error) {
            console.error('搜索索引加载失败:', error);
            return false;
        }
    }

    search(query) {
        const startTime = performance.now();
        
        // 检查缓存
        const cacheKey = {
            query: query.toLowerCase(),
            tags: Array.from(this.filters.tags).sort().join(','),
            dateFrom: this.filters.dateFrom,
            dateTo: this.filters.dateTo,
            sortBy: this.filters.sortBy
        };
        
        const cacheKeyStr = JSON.stringify(cacheKey);
        
        if (this.cache.has(cacheKeyStr)) {
            const cachedResult = this.cache.get(cacheKeyStr);
            console.log('使用缓存结果');
            return cachedResult;
        }

        // 执行搜索
        const results = this.performSearch(query);
        
        // 排序结果
        const sortedResults = this.sortResults(results);

        // 更新搜索历史
        this.updateSearchHistory(query);
        
        // 缓存结果
        const duration = performance.now() - startTime;
        const finalResult = {
            results: sortedResults,
            count: sortedResults.length,
            duration: duration,
            query: query
        };
        
        if (sortedResults.length > 0) {
            this.cache.set(cacheKeyStr, finalResult);
        }
        
        return finalResult;
    }

    performSearch(query) {
        const queryLower = query.toLowerCase();
        
        if (!queryLower.trim()) {
            return this.posts.filter(post => this.applyFilters(post));
        }

        return this.posts.filter(post => {
            // 检查过滤条件
            if (!this.applyFilters(post)) {
                return false;
            }

            // 搜索匹配
            return (
                post.title.toLowerCase().includes(queryLower) ||
                post.excerpt.toLowerCase().includes(queryLower) ||
                post.tags.some(tag => tag.toLowerCase().includes(queryLower))
            );
        });
    }

    applyFilters(post) {
        // 标签过滤
        if (this.filters.tags.size > 0) {
            const hasMatchingTag = post.tags.some(tag => 
                this.filters.tags.has(tag)
            );
            if (!hasMatchingTag) return false;
        }

        // 日期过滤
        if (this.filters.dateFrom || this.filters.dateTo) {
            const postDate = new Date(post.date);
            if (this.filters.dateFrom && postDate < this.filters.dateFrom) return false;
            if (this.filters.dateTo && postDate > this.filters.dateTo) return false;
        }

        return true;
    }

    sortResults(results) {
        const sortBy = this.filters.sortBy;
        
        if (sortBy === 'relevance') {
            // 相关度排序（已有计算）
            return results.sort((a, b) => b.relevance - a.relevance);
        } else if (sortBy === 'date-asc') {
            return results.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortBy === 'date-desc') {
            return results.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (sortBy === 'title') {
            return results.sort((a, b) => a.title.localeCompare(b.title));
        }
        
        return results;
    }

    updateSearchHistory(query) {
        if (!query.trim()) return;

        // 移除重复
        this.searchHistory = this.searchHistory.filter(h => h !== query);
        
        // 添加到开头
        this.searchHistory.unshift(query);
        
        // 限制历史记录数量
        if (this.searchHistory.length > this.maxHistory) {
            this.searchHistory.pop();
        }
    }

    setFilter(type, value) {
        if (type === 'tag') {
            if (this.filters.tags.has(value)) {
                this.filters.tags.delete(value);
            } else {
                this.filters.tags.add(value);
            }
        } else if (type === 'dateFrom') {
            this.filters.dateFrom = value;
        } else if (type === 'dateTo') {
            this.filters.dateTo = value;
        } else if (type === 'sortBy') {
            this.filters.sortBy = value;
        }
        
        // 清除缓存
        this.cache.clear();
    }

    clearFilters() {
        this.filters = {
            tags: new Set(),
            dateFrom: null,
            dateTo: null,
            sortBy: 'relevance'
        };
        this.cache.clear();
    }

    getTags() {
        return this.tags;
    }

    getSearchHistory() {
        return this.searchHistory;
    }
}

// 创建全局实例
window.blogSearchEngine = new BlogSearchEngine();
```

### UI控制器

```javascript
class SearchUIController {
    constructor() {
        this.searchInput = document.getElementById('search-input');
        this.searchClear = document.getElementById('search-clear');
        this.searchResults = document.getElementById('search-results');
        this.resultsList = document.getElementById('results-list');
        this.resultCount = document.getElementById('result-count');
        this.searchTime = document.getElementById('search-time');
        this.tagFilters = document.getElementById('tag-filters');
        this.searchSuggestions = document.getElementById('search-suggestions');
        this.dateFrom = document.getElementById('date-from');
        this.dateTo = document('date-to');
        this.sortSelect = document('sort-select');
        
        this.searchTimeout = null;
        this.SEARCH_DELAY = 300;
        
        this.init();
    }

    async init() {
        // 初始化搜索引擎
        await window.blogSearchEngine.init();
        
        // 渲染标签过滤器
        this.renderTagFilters();
        
        // 绑定事件监听
        this.bindEvents();
        
        // 初始化搜索建议
        this.initSearchSuggestions();
    }

    bindEvents() {
        // 搜索输入
        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            this.handleInput(query);
        });

        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                this.clearSearch();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                this.searchInput.blur();
            }
        });

        // 清除按钮
        this.searchClear.addEventListener('click', () => {
            this.clearSearch();
        });

        // 排序选择
        this.sortSelect.addEventListener('change', (e) => {
            const sortBy = e.target.value;
            window.blogSearchEngine.setFilter('sortBy', sortBy);
            this.refreshResults();
        });

        // 日期筛选
        this.dateFrom.addEventListener('change', (e) => {
            const date = e.target.value ? new Date(e.target.value) : null;
            window.blogSearchEngine.setFilter('dateFrom', date);
            this.refreshResults();
        });

        this.dateTo.addEventListener('change', (e) => {
            const date = e.target.value ? new Date(e.target.value) : null;
            window.blogSearchEngine.setFilter('dateTo', date);
            this.refreshResults();
        });
    }

    handleInput(query) {
        // 清除超时
        clearTimeout(this.searchTimeout);
        
        // 显示/隐藏清除按钮
        if (query) {
            this.searchClear.style.display = 'flex';
        } else {
            this.searchClear.style.display = 'none';
            this.hideResults();
        }

        // 防抖搜索
        this.searchTimeout = setTimeout(() => {
            if (query.trim()) {
                this.performSearch(query);
            } else {
                this.hideResults();
            }
        }, this.SEARCH_DELAY);
    }

    performSearch(query) {
        const results = window.blogSearchEngine.search(query);
        
        this.displayResults(results);
        
        // 隐藏搜索建议
        this.hideSuggestions();
    }

    displayResults(results) {
        this.searchResults.classList.add('show');
        
        // 更新统计
        this.resultCount.textContent = `找到 ${results.count} 篇文章`;
        this.searchTime.textContent = `(${results.duration.toFixed(0)}ms)`;
        
        // 渲染结果
        this.renderResults(results.results);
        
        // 如果没有结果，显示提示
        if (results.count === 0) {
            this.resultsList.innerHTML = `
                <div class="no-results">
                    <p>没有找到匹配的文章</p>
                    <p>尝试：</p>
                    <ul>
                        <li>使用不同的关键词</li>
                        <li>搜索标签（如：赛博朋克、哲学思考）</li>
                        <li>清除筛选条件</li>
                    </ul>
                </div>
            `;
        }
    }

    renderResults(results) {
        if (results.length === 0) return;

        const html = results.map(post => `
            <div class="result-item" data-id="${post.id}">
                <div class="result-title">
                    <a href="${post.url}">
                        ${this.highlightText(post.title)}
                    </a>
                </div>
                <div class="result-meta">
                    <span class="result-date">${post.date}</span>
                    <span class="result-tags">
                        ${post.tags.map(tag => `<span class="result-tag">${tag}</span>`).join('')}
                    </span>
                    <span class="result-time">⏱️ ${post.readTime}</span>
                </div>
                <div class="result-excerpt">
                    ${this.highlightText(post.excerpt)}
                </div>
            </div>
        `).join('');
        
        this.resultsList.innerHTML = html;
    }

    highlightText(text) {
        const query = this.searchInput.value.toLowerCase();
        if (!query) return text;

        const parts = text.split(new RegExp(`(${this.escapeRegExp(query)})`, 'gi'));
        
        return parts.map((part, index) => {
            if (index % 2 === 1) {
                return `<span class="match">${part}</span>`;
            }
            return part;
        }).join('');
    }

    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    hideResults() {
        this.searchResults.classList.remove('show');
    }

    clearSearch() {
        this.searchInput.value = '';
        this.searchClear.style.display = 'none';
        this.hideResults();
        this.showSuggestions();
    }

    refreshResults() {
        if (this.searchInput.value.trim()) {
            this.performSearch(this.searchInput.value);
        }
    }

    renderTagFilters() {
        const tags = window.blogSearchEngine.getTags();
        
        const html = tags.map(tag => `
            <span class="tag-filter" data-tag="${tag.name}">
                ${tag.name} (${tag.count})
            </span>
        `).join('');
        
        this.tagFilters.innerHTML = html;
        
        // 绑定点击事件
        this.tagFilters.querySelectorAll('.tag-filter').forEach(el => {
            el.addEventListener('click', () => {
                const tag = el.dataset.tag;
                const isActive = el.classList.toggle('active');
                
                window.blogSearchEngine.setFilter('tag', tag);
                this.refreshResults();
            });
        });
    }

    initSearchSuggestions() {
        // 从搜索历史生成建议
        const history = window.blogSearchEngine.getSearchHistory();
        
        if (history.length > 0) {
            this.showSuggestions(history);
        }
    }

    showSuggestions(suggestions = null) {
        if (!suggestions) {
            suggestions = window.blogSearchEngine.getSearchHistory();
        }

        if (suggestions.length === 0) {
            this.searchSuggestions.classList.remove('show');
            return;
        }

        const html = suggestions.slice(0, 5).map((query, index) => `
            <div class="search-suggestion" data-query="${query}">
                ${query}
            </div>
        `).join('');
        
        this.searchSuggestions.innerHTML = html;
        this.searchSuggestions.classList.add('show');

        // 绑定点击事件
        this.searchSuggestions.querySelectorAll('.search-suggestion').forEach(el => {
            el.addEventListener('click', () => {
                const query = el.dataset.query;
                this.searchInput.value = query;
                this.performSearch(query);
            });
        });
    }

    hideSuggestions() {
        this.searchSuggestions.classList.remove('show');
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    window.searchUI = new SearchUIController();
});
```

---

## 搜索索引生成

创建一个脚本从博客文章自动生成搜索索引：

```javascript
const fs = require('fs');
const path = require('path');

const POSTS_DIR = './posts';
const OUTPUT_FILE = './search-index.json';

function generateSearchIndex() {
    const posts = [];
    const tagCounts = {};

    // 读取所有HTML文件
    const files = fs.readdirSync(POSTS_DIR)
        .filter(file => file.endsWith('.html'))
        .sort();

    files.forEach(file => {
        const filePath = path.join(POSTS_DIR, file);
        const content = fs.readFileSync(filePath, 'utf8');

        // 提取数据
        const titleMatch = content.match(/<h1[^>]*>(.*?)<\/h1>/);
        const excerptMatch = content.match(/<p[^>]*>(.{100,300})<\/p>/);
        const dateMatch = content.match(/<p[^>]*>📅 发布日期：(.*?)<\/p>/);
        const tagsMatch = content.match(/<p[^>]*>🏷️ 标签：(.*?)<\/p>/);
        const readTimeMatch = content.match(/<p[^>]*>⏱️ 阅读时间：(.*?)<\/p>/);
        const authorMatch = content.match(/<p[^>]*>👤 作者：(.*?)<\/p>/);

        if (titleMatch && excerptMatch && dateMatch) {
            const title = titleMatch[1].trim();
            const excerpt = excerptMatch[1].replace(/<[^>]*>/g, '').trim();
            const date = dateMatch[1].trim();
            const tags = tagsMatch ? tagsMatch[1].split(/[、,]/).map(t => t.trim()).filter(t => t) : [];
            const readTime = readTimeMatch ? readTimeMatch[1].trim() : '';
            const author = authorMatch ? authorMatch[1].trim() : '阳子';

            // 统计标签
            tags.forEach(tag => {
                if (!tagCounts[tag]) {
                    tagCounts[tag] = 0;
                }
                tagCounts[tag]++;
            });

            posts.push({
                id: file.replace('.html', ''),
                title: title,
                excerpt: excerpt,
                date: date,
                tags: tags,
                wordCount: Math.floor(excerpt.length / 2), // 估算
                readTime: readTime,
                author: author,
                url: `posts/${file}`
            });
        }
    });

    // 生成标签数组
    const tagsArray = Object.entries(tagCounts)
        .map(([name, count]) => ({
            name,
            count
        }))
        .sort((a, b) => b.count - a.count);

    // 生成索引
    const indexData = {
        posts,
        tags: tagsArray
    };

    // 写入文件
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(indexData, null, 2), 'utf8');
    console.log(`搜索索引已生成：${OUTPUT.url}`);
    console.log(`  文章数：${posts.length}`);
    console.log(`  标签数：${tagsArray.length}`);
}

// 执行
generateSearchIndex();
```

---

## 性能预期

| 场景 | 预期时间 | 说明 |
|------|----------|------|
| 10篇文章 | < 50ms | 快速，即时反馈 |
| 25篇文章 | < 100ms | 可接受，良好性能 |
| 50篇文章 | < 200ms | 可接受，添加Web Workers优化 |
| 100+篇文章 | 300-500ms | 建议使用Web Workers |

---

## 使用建议

1. **立即实现**：
   - 基础搜索功能
   - 实时搜索
   - 搜索结果展示
   - 大小写不敏感

2. **短期优化**：
   - 防抖处理
   - 搜索建议
   - 搜索历史
   - 结果高亮

3. **中期优化**：
   - 标签筛选
   - 日期筛选
   - 结果排序
   - 搜索统计

4. **长期优化**：
   - Web Workers
   - 模糊搜索
   - 同义词扩展
   - 搜索分析

---

**搜索功能将大幅提升用户体验，让读者更快找到感兴趣的内容！** 🔍
