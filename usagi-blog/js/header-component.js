/**
 * うさぎポータル - ナビゲーションコンポーネント
 * ヤハ！冒険広場へようこそ！
 */
(function() {
    'use strict';

    function getRootPath() {
        const depth = window.location.pathname.split('/').filter(p => p).length - 1;
        let path = '';
        for (let i = 0; i < depth; i++) { path += '../'; }
        return path || './';
    }

    const r = getRootPath();

    const headerHTML = `
    <header class="usagi-header">
        <div class="container">
            <h1 class="logo">
                <img src="${r}public/usagi.webp" alt="うさぎ" class="logo-avatar" onerror="this.style.display='none'">
                <span class="logo-text">うさぎ</span>
                <span class="logo-yaha">ヤハ！</span>
            </h1>
            <div id="menu-toggle" class="menu-toggle">☰</div>
            <nav>
                <ul id="nav-menu">
                    <li><a href="${r}index.html#hero">🏠 ホーム</a></li>
                    <li><a href="${r}index.html#links">📺 コンテンツ</a></li>
                    <li><a href="${r}index.html#profile">🐰 プロフィール</a></li>
                    <li><a href="${r}index.html#friends">💛 なかまたち</a></li>
                    <li><a href="#" id="chat-nav-btn" class="chat-nav-btn">💬 おしゃべり</a></li>
                </ul>
            </nav>
        </div>
    </header>
    `;

    function injectHeader() {
        const container = document.getElementById('header-component');
        if (container) {
            container.innerHTML = headerHTML;
            initMenu();
        } else if (document.querySelector('script[data-auto-inject="true"]')) {
            document.body.insertAdjacentHTML('afterbegin', headerHTML);
            initMenu();
        }
    }

    function initMenu() {
        const toggle = document.getElementById('menu-toggle');
        const menu = document.getElementById('nav-menu');
        if (toggle && menu) {
            toggle.addEventListener('click', function() {
                menu.classList.toggle('active');
                toggle.classList.toggle('active');
            });
        }
        // Chat button opens floating chat
        const chatBtn = document.getElementById('chat-nav-btn');
        if (chatBtn) {
            chatBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (window.toggleGhostChat) window.toggleGhostChat();
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectHeader);
    } else {
        injectHeader();
    }
})();
