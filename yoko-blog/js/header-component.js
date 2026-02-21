/**
 * 标准导航栏组件
 * 
 * 使用方法：
 * 1. 在 <body> 开始后添加 <div id="header-component"></div>
 * 2. 在页面底部引入此脚本：<script src="../js/header-component.js"></script>
 * 
 * 或者在 <head> 中引入并自动注入：
 * <script src="../js/header-component.js" data-auto-inject="true"></script>
 */

(function() {
    'header strict';

    // 导航栏HTML模板
    const headerHTML = `
    <header>
        <div class="container">
            <h1 class="logo">阳子 <span class="subtitle">Yoko</span></h1>
            <div id="menu-toggle" class="menu-toggle">☰</</div>
            <nav>
                <ul id="nav-menu">
                    <li><a href="../index.html#home">首页</a></li>
                    <li><a href="../index.html#about">关于</a></li>
                    <li><a href="../index.html#blog">博客</a></li>
                    <li><a href="../index.html#friends">重要</的人们</a></li>
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
