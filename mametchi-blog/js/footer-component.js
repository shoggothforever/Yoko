/**
 * まめっちブログ - フッターコンポーネント
 * えへへ～
 */
(function() {
    'use strict';

    const footerHTML = `
    <footer class="mametchi-footer">
        <div class="container">
            <div class="footer-motto">「次こそきっとうまくいきます！」 ✨</div>
            <p>&copy; 2026 まめっち (Mametchi) &amp; たまごっち星. わくわく♪</p>
            <p class="footer-quote">「失敗は成功のもと！100回失敗しても、101回目がある！」── まめっち</p>
            <div class="footer-pixels">⬜🟦⬜🟦⬜🟦⬜🟦⬜🟦⬜🟦⬜</div>
        </div>
    </footer>
    <button class="scroll-top" id="scroll-top" aria-label="トップへ">🧪↑</button>
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
