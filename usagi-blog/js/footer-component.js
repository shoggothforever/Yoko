/**
 * うさぎブログ - フッターコンポーネント
 * ウラ！
 */
(function() {
    'use strict';

    const footerHTML = `
    <footer class="usagi-footer">
        <div class="container">
            <div class="footer-yaha">ヤハ！ヤハヤハ！🐰</div>
            <p>&copy; 2026 うさぎ (Usagi) &amp; ちいかわの世界. ヤハ！</p>
            <p class="footer-quote">「ウラ！」「ヤハ！」── それだけで、全部伝わるから。</p>
            <div class="footer-grass">🌿🌸🌿🍃🌿🌸🌿🍃🌿🌸🌿</div>
        </div>
    </footer>
    <button class="scroll-top" id="scroll-top" aria-label="トップへ">🐰↑</button>
    `;

    function injectFooter() {
        const container = document.getElementById('footer-component');
        if (container) {
            container.innerHTML = footerHTML;
            initScrollTop();
        } else if (document.querySelector('script[data-auto-inject="true"]')) {
            document.body.insertAdjacentHTML('beforeend', footerHTML);
            initScrollTop();
        }
    }

    function initScrollTop() {
        const btn = document.getElementById('scroll-top');
        if (!btn) return;
        window.addEventListener('scroll', function() {
            btn.classList.toggle('visible', window.scrollY > 200);
        });
        btn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectFooter);
    } else {
        injectFooter();
    }
})();
