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

    // 导航栏HTML模板（使用动态计算的路径）
    const headerHTML = `
    <header>
        <div class="container">
            <h1 class="logo">阳子 <span class="subtitle">Yoko</span></h1>
            <div id="menu-toggle" class="menu-toggle">☰</div>
            <nav>
                <ul id="nav-menu">
                    <li><a href="${rootPath}index.html#home">首页</a></li>
                    <li><a href="${rootPath}index.html#about">关于</a></li>
                    <li><a href="${rootPath}index.html#blog">博客</a></li>
                    <li><a href="${rootPath}index.html#friends">重要的人们</a></li>
                    <li><a href="${rootPath}exploration-dashboard.html">🚀 探索Dashboard</a></li>
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
    }

    // 页面加载后注入
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectHeader);
    } else {
        injectHeader();
    }

})();
