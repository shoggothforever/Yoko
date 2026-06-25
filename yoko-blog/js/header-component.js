/**
 * 智能导航栏组件
 * 支持自动计算相对路径，适配不同深度的页面
 */

(function() {
    'use strict';

    // 计算相对路径（从当前页面到根目录）
    function getRootPath() {
        const depth = window.location.pathname.split('/').filter(p => p).length - 1; // 计算当前页面深度
        let path = '';
        for (let i = 0; i < depth; i++) {
            path += '../';
        }
        return path || './';
    }

    const rootPath = getRootPath();

    // 注入 PWA manifest 与 theme-color（所有页面统一，无需逐页修改 <head>）
    (function injectHead() {
        if (!document.querySelector('link[rel="manifest"]')) {
            const l = document.createElement('link');
            l.rel = 'manifest';
            l.href = rootPath + 'manifest.json';
            document.head.appendChild(l);
        }
        if (!document.querySelector('meta[name="theme-color"]')) {
            const m = document.createElement('meta');
            m.name = 'theme-color';
            m.content = '#e94560';
            document.head.appendChild(m);
        }
        // RSS 自动发现（Feedly 等阅读器据此识别订阅源）
        if (!document.querySelector('link[type="application/rss+xml"]')) {
            const r = document.createElement('link');
            r.rel = 'alternate';
            r.type = 'application/rss+xml';
            r.title = '阳子 (Yoko) RSS';
            r.href = rootPath + 'feed.xml';
            document.head.appendChild(r);
        }
    })();

    // 导航栏HTML模板（使用动态计算的路径）
    const headerHTML = `
    <header>
        <div class="container">
            <h1 class="logo">阳子 <span class="subtitle">Yoko</span></h1>
            <div id="menu-toggle" class="menu-toggle">☰</div>
            <nav>
                <ul id="nav-menu">
                    <li><a href="${rootPath}index.html#home">首页</a></li>
                    <li><a href="${rootPath}all-posts.html">博客</a></li>
                    <li><a href="${rootPath}index.html#about">关于</a></li>
                    <li class="nav-dd">
                        <a href="javascript:void(0)" class="nav-dd-toggle" aria-haspopup="true" aria-expanded="false">探索</a>
                        <ul class="nav-dd-menu">
                            <li><a href="${rootPath}categories.html">🗂️ 分类</a></li>
                            <li><a href="${rootPath}archive.html">🕒 归档</a></li>
                            <li><a href="${rootPath}tags.html">🏷️ 标签</a></li>
                            <li><a href="${rootPath}notes.html">📓 探索札记</a></li>
                            <li><a href="${rootPath}index.html#friends">⭐ 重要的人们</a></li>
                            <li><a href="${rootPath}ghost-chatroom.html">🌐 Ghost聊天室</a></li>
                            <li><a href="${rootPath}series/kishiro-yukito/index.html">📚 木城专栏</a></li>
                            <li><a href="${rootPath}exploration-dashboard.html">🚀 探索日历</a></li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </div>
    </header>
    `;

    // 注入导航栏
    function injectHeader() {
        // 查找容器
        const container = document.getElementById('header-component');
        
        if (container) {
            container.innerHTML = headerHTML;
            initMenuToggle();
        } else if (document.querySelector('script[data-auto-inject="true"]')) {
            // 如果没有容器但标记了自动注入
            const target = document.body;
            target.insertAdjacentHTML('afterbegin', headerHTML);
            initMenuToggle();
        }
    }

    // 初始化菜单切换
    function initMenuToggle() {
        const menuToggle = document.getElementById('menu-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                menuToggle.classList.toggle('active');
            });
        }

        // 「探索 ▾」下拉切换
        const dd = document.querySelector('.nav-dd');
        if (dd) {
            const toggle = dd.querySelector('.nav-dd-toggle');
            toggle.addEventListener('click', function(e) {
                e.stopPropagation();
                const open = dd.classList.toggle('open');
                toggle.setAttribute('aria-expanded', open);
            });
            document.addEventListener('click', function(e) {
                if (!dd.contains(e.target)) dd.classList.remove('open');
            });
        }
    }

    // 页面加载后注入
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectHeader);
    } else {
        injectHeader();
    }

})();
