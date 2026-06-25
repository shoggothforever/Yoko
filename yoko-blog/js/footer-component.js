/**
 * 标准页脚组件
 * 
 * 使用方法：
 * 1. 在 </body> 结束前添加 <div id="footer-component"></div>
 * 2. 在页面底部引入此
script：<script src="../js/footer-component.js"></script>
 * 
 * 或者在 <head> 中引入并自动注入：
 * <script src="../js/footer-component.js" data-auto-inject="true"></script>
 */

(function() {
    'use strict';

    // 站点根：从本组件 <script src> 反推，兼容 IP 根站（/）与 GitHub Pages 子路径（/Yoko/）
    const BASE = (function () {
        var s = document.currentScript;
        if (!s || s.src.indexOf('footer-component.js') < 0) {
            var all = document.getElementsByTagName('script');
            for (var i = 0; i < all.length; i++) {
                if (all[i].src && all[i].src.indexOf('footer-component.js') >= 0) { s = all[i]; break; }
            }
        }
        return s && s.src ? s.src.replace(/js\/footer-component\.js.*$/, '') : '/';
    })();

    // 页脚HTML模板
    const footerHTML = `
    <footer>
        <div class="container">
            <p>&copy; 2025 阳子 (Yoko). All rights reserved.</p>
            <p class="footer-links" style="margin:8px 0;">
                <a href="${BASE}feed.xml" style="color:#e94560;text-decoration:none;">📡 RSS 订阅</a>
                · <a href="${BASE}categories.html" style="color:#a9b7d0;text-decoration:none;">分类</a>
                · <a href="${BASE}archive.html" style="color:#a9b7d0;text-decoration:none;">归档</a>
                · <a href="${BASE}tags.html" style="color:#a9b7d0;text-decoration:none;">标签</a>
            </p>
            <p class="footer-quote">"在废墟中寻找希望，在战斗中寻找自我。"</p>
        </div>
    </footer>
    
    <!-- 回到顶部按钮 -->
    <button class="scroll-top" id="scroll-top" aria-label="回到顶部">↑</button>
    `;

    // 注入页脚
    function injectFooter() {
        // 查找容器
        const container = document.getElementById('footer-component');
        
        if (container) {
            container.innerHTML = footerHTML;
            initScrollTop();
        } else if (document.querySelector('script[data-auto-inject="true"]')) {
            // 如果没有容器但标记了自动注入
            const target = document.body;
            target.insertAdjacentHTML('beforeend', footerHTML);
            initScrollTop();
        }
    }

    // 初始化回到顶部按钮
    function initScrollTop() {
        const scrollTopBtn = document.getElementById('scroll-top');
        
        if (!scrollTopBtn) return;

        // 滚动时显示/隐藏按钮
        window.addEventListener('scroll', function() {
            if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        // 点击回到顶部
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 页面加载后注入
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectFooter);
    } else {
        injectFooter();
    }

})();
