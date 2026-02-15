#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 需要添加的功能
const readingProgress = `    <!-- 阅读进度条 -->
    <div class="reading-progress" id="reading-progress"></div>`;

const scrollTopButton = `    <!-- 回到顶部按钮 -->
    <button class="scroll-top" id="scroll-top" aria-label="回到顶部">↑</button>`;

// 页面底部需要添加的脚本初始化
const scriptInit = `    <script>
        // 阅读进度条
        window.addEventListener('scroll', function() {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            const progressBar = document.getElementById('reading-progress');
            if (progressBar) {
                progressBar.style.width = scrolled + '%';
            }
        });
        
        // 回到顶部按钮
        const scrollTopBtn = document.getElementById('scroll-top');
        if (scrollTopBtn) {
            window.addEventListener('scroll', function() {
                if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
                    scrollTopBtn.classList.add('visible');
                } else {
                    scrollTopBtn.classList.remove('visible');
                }
            });
            
            scrollTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    </script>`;

// 需要更新的文件
const filesToUpdate = [
    'index.html',
    'all-posts.html',
    'posts/memory-odyssey.html',
    'posts/kishiro-creative-universe.html',
    'posts/ghost-in-the-machine.html',
    'posts/hugo.html',
    'posts/panzer-kunst.html',
    'posts/from-scrapyard-to-zalem.html',
    'posts/between-steel-and-flesh.html',
    'posts/steel-heart.html',
    'posts/memory-echoes.html',
    'posts/cyber-ghost.html',
    'posts/gunnm-worldview.html',
    'posts/kishiro-gunnm-background.html',
    'posts/yoko-growth.html'
];

// 更新所有页面
filesToUpdate.forEach(filePath => {
    const fullPath = path.join(__dirname, 'yoko-blog', filePath);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // 添加阅读进度条（在 <head> 之后）
        if (content.includes('</head>')) {
            content = content.replace('</head>', readingProgress + '</head>');
        }
        
        // 添加回到顶部按钮（在 </body> 之前）
        if (content.includes('</body>')) {
            content = content.replace('</body>', scrollTopButton + scriptInit + '</body>');
        }
        
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ 更新了 ${filePath}`);
    } else {
        console.warn(`⚠️ 文件不存在: ${fullPath}`);
    }
});

console.log('\n🎯 所有页面功能已更新完成！');