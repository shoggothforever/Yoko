/**
 * 文章增强组件 — 自动注入「目录(TOC) + 上一篇/下一篇 + 相关文章」
 *
 * 用法（在文章页 footer 组件之前）：
 *   <script src="../blog-posts-data.js"></script>
 *   <script src="../js/article-enhancements.js" data-auto-inject="true"></script>
 *
 * 全部基于 BLOG_POSTS（blog-posts-data.js）客户端计算，新增文章自动生效，无需重建文章。
 */
(function () {
    'use strict';

    function rootPath() {
        const depth = window.location.pathname.split('/').filter(Boolean).length - 1;
        return depth > 0 ? '../'.repeat(depth) : './';
    }

    function injectStyleOnce() {
        if (document.getElementById('article-enh-style')) return;
        const css = `
        .post-toc{background:rgba(15,15,30,.6);border:1px solid rgba(233,69,96,.25);
            border-radius:10px;padding:16px 20px;margin:0 0 32px;}
        .post-toc summary{cursor:pointer;color:#e94560;font-weight:bold;letter-spacing:1px;}
        .post-toc ul{list-style:none;margin:12px 0 0;padding:0;}
        .post-toc li{margin:6px 0;}
        .post-toc li.lvl-3{padding-left:18px;font-size:.95em;}
        .post-toc a{color:#a9b7d0;text-decoration:none;transition:color .2s;}
        .post-toc a:hover{color:#e94560;}
        .article-content h2,.article-content h3{scroll-margin-top:90px;}
        .related-posts{margin-top:48px;padding-top:28px;border-top:1px solid rgba(233,69,96,.25);}
        .related-posts h3{color:#533483;margin-bottom:18px;}
        .related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;}
        .related-card{display:block;background:rgba(102,126,234,.07);border:1px solid rgba(102,126,234,.18);
            border-radius:10px;padding:16px;text-decoration:none;transition:transform .25s,box-shadow .25s;}
        .related-card:hover{transform:translateY(-3px);box-shadow:0 6px 18px rgba(233,69,96,.25);}
        .related-card .rc-cat{color:#667eea;font-size:.8em;letter-spacing:1px;}
        .related-card .rc-title{color:#e0e0e0;font-weight:bold;margin:6px 0;line-height:1.5;}
        .related-card .rc-date{color:#7a7a8c;font-size:.8em;}
        .post-nav{display:flex;justify-content:space-between;gap:16px;margin-top:40px;flex-wrap:wrap;}
        .post-nav a{flex:1 1 45%;min-width:200px;background:linear-gradient(135deg,#e94560 0%,#533483 100%);
            color:#fff;padding:14px 18px;border-radius:8px;text-decoration:none;transition:transform .25s,box-shadow .25s;}
        .post-nav a:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(233,69,96,.4);}
        .post-nav .pn-dir{font-size:.8em;opacity:.85;}
        .post-nav .pn-next{text-align:right;}
        @media(max-width:600px){.post-nav a{flex-basis:100%;}}
        `;
        const s = document.createElement('style');
        s.id = 'article-enh-style';
        s.textContent = css;
        document.head.appendChild(s);
    }

    // 定位当前文章在 BLOG_POSTS 中的记录
    function findCurrent(posts) {
        const path = decodeURIComponent(window.location.pathname).replace(/^\//, '');
        return posts.find(p => path === p.url || path.endsWith('/' + p.url) || path.endsWith(p.url.split('/').pop()));
    }

    function slugify(text, i) {
        const base = (text || '').trim().toLowerCase()
            .replace(/[^\w一-龥]+/g, '-').replace(/^-+|-+$/g, '');
        return 'sec-' + (base || 'h') + '-' + i;
    }

    function buildTOC(article) {
        const heads = article.querySelectorAll('h2, h3');
        if (heads.length < 3) return null;
        const details = document.createElement('details');
        details.className = 'post-toc';
        details.open = window.innerWidth > 900;
        const ul = document.createElement('ul');
        heads.forEach((h, i) => {
            if (!h.id) h.id = slugify(h.textContent, i);
            const li = document.createElement('li');
            li.className = 'lvl-' + (h.tagName === 'H3' ? 3 : 2);
            const a = document.createElement('a');
            a.href = '#' + h.id;
            a.textContent = h.textContent;
            li.appendChild(a);
            ul.appendChild(li);
        });
        const sm = document.createElement('summary');
        sm.textContent = '目录 / Contents';
        details.appendChild(sm);
        details.appendChild(ul);
        return details;
    }

    function card(p, root) {
        const tags = (p.tags || []).slice(0, 3).join(' · ');
        return `<a class="related-card" href="${root}${p.url}">
            <div class="rc-cat">${p.category || ''}</div>
            <div class="rc-title">${p.title}</div>
            <div class="rc-date">${p.date || ''}${tags ? ' · ' + tags : ''}</div>
        </a>`;
    }

    function build() {
        if (typeof BLOG_POSTS === 'undefined' || !Array.isArray(BLOG_POSTS)) return;
        const article = document.querySelector('article.article-content');
        if (!article) return;
        injectStyleOnce();
        const root = rootPath();
        const posts = BLOG_POSTS.slice().sort((a, b) => (b.dateISO || '').localeCompare(a.dateISO || ''));
        const cur = findCurrent(posts);

        // 1) TOC —— 插到 article-meta 之后
        const toc = buildTOC(article);
        if (toc) {
            const meta = article.querySelector('.article-meta');
            if (meta && meta.nextSibling) meta.parentNode.insertBefore(toc, meta.nextSibling);
            else article.insertBefore(toc, article.children[1] || null);
        }

        if (!cur) return; // 不在数据集中（极少数静态页），仅 TOC

        // 2) 相关文章 —— 同分类+标签重合度打分
        const curTags = new Set(cur.tags || []);
        const related = posts.filter(p => p.url !== cur.url).map(p => {
            let score = (p.category === cur.category) ? 2 : 0;
            (p.tags || []).forEach(t => { if (curTags.has(t)) score += 1; });
            return { p, score };
        }).filter(x => x.score > 0).sort((a, b) => b.score - a.score).slice(0, 4);

        // 3) 上一篇/下一篇（按时间；next=更新, prev=更早）
        const idx = posts.findIndex(p => p.url === cur.url);
        const newer = idx > 0 ? posts[idx - 1] : null;
        const older = idx >= 0 && idx < posts.length - 1 ? posts[idx + 1] : null;

        const frag = document.createElement('div');
        if (related.length) {
            frag.innerHTML += `<section class="related-posts"><h3>🔗 相关探索</h3>
                <div class="related-grid">${related.map(x => card(x.p, root)).join('')}</div></section>`;
        }
        let nav = '';
        if (older) nav += `<a class="pn-prev" href="${root}${older.url}"><div class="pn-dir">← 上一篇</div>${older.title}</a>`;
        if (newer) nav += `<a class="pn-next" href="${root}${newer.url}"><div class="pn-dir">下一篇 →</div>${newer.title}</a>`;
        if (nav) frag.innerHTML += `<nav class="post-nav">${nav}</nav>`;

        // 插到 article 末尾（仍在卡片内，视觉统一）
        while (frag.firstChild) article.appendChild(frag.firstChild);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', build);
    } else {
        build();
    }
})();
