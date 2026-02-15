#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 导航菜单模板
const navTemplate = `    <header>
        <div class="container">
            <h1 class="logo">阳子 <span class="subtitle">Yoko</span></h1>
            <div id="menu-toggle" class="menu-toggle">☰</div>
            <nav>
                <ul id="nav-menu">
                    <li><a href="index.html#home">首页</a></li>
                    <li><a href="index.html#about">关于</a></li>
                    <li><a href="index.html#blog">博客</a></li>
                    <li><a href="index.html#friends">重要的人们</a></li>
                </ul>
            </nav>
        </div>
    </header>`;

// 需要更新的文件
const filesToUpdate = [
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

// 更新导航菜单
filesToUpdate.forEach(filePath => {
    const fullPath = path.join(__dirname, 'yoko-blog', filePath);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // 替换导航菜单
        content = content.replace(/<header>.*?<\/header>/s, navTemplate);
        
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ 更新了 ${filePath}`);
    } else {
        console.warn(`⚠️ 文件不存在: ${fullPath}`);
    }
});

console.log('\n🎯 所有导航菜单已更新完成！');