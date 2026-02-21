// 博客交互功能脚本
document.addEventListener('DOMContentLoaded', function() {
    // 导航菜单平滑滚动
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 博客文章搜索功能
    const searchInput = document.getElementById('search-input');
    const blogList = document.getElementById('blog-list');
    const blogPosts = blogList ? blogList.querySelectorAll('.blog-post') : [];

    if (searchInput && blogPosts.length > 0) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            
            blogPosts.forEach(post => {
                const title = post.getAttribute('data-title')?.toLowerCase() || '';
                const excerpt = post.getAttribute('data-excerpt')?.toLowerCase() || '';
                
                if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
                    post.style.display = 'block';
                    post.style.animation = 'fadeIn 0.3s ease';
                } else {
                    post.style.display = 'none';
                }
            });
        });
    }
    
    // 页面加载动画
    const animatedElements = document.querySelectorAll('.blog-post, .trait, .friend-link');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // 移动端菜单
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.querySelector('nav ul');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // 动态时间显示
    const dateElements = document.querySelectorAll('.post-date');
    dateElements.forEach(element => {
        const dateString = element.textContent;
        const date = new Date(dateString);
        
        if (!isNaN(date.getTime())) {
            const relativeTime = getRelativeTime(date);
            element.setAttribute('title', dateString);
            element.textContent = relativeTime;
        }
    });
    
    // 生成炫酷的背景粒子效果
    function createParticles() {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;
        
        // 粒子类型
        const particleTypes = ['⚡', '🔍', '🌸', '⚔️', '🔥', '🌟', '💎'];
        
        for (let i = 0; i < 100; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // 随机位置
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            
            // 随机大小和颜色
            const size = Math.random() * 2 + 1;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            // 随机颜色（红色、紫色、蓝色渐变）
            const colors = ['rgba(233, 69, 96, 0.8)', 'rgba(83, 52, 131, 0.8)', 'rgba(15, 52, 96, 0.8)'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            // 随机动画延迟和持续时间
            particle.style.animationDelay = Math.random() * 10 + 's';
            particle.style.animationDuration = (Math.random() * 15 + 5) + 's';
            
            // 随机粒子类型
            particle.textContent = particleTypes[Math.floor(Math.random() * particleTypes.length)];
            particle.style.fontSize = (Math.random() * 12 + 8) + 'px';
            
            heroSection.appendChild(particle);
        }
    }
    
    createParticles();
});

// 相对时间格式化函数
function getRelativeTime(date) {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 365) {
        return Math.floor(days / 365) + '年前';
    } else if (days > 30) {
        return Math.floor(days / 30) + '个月前';
    } else if (days > 0) {
        return days + '天前';
    } else if (hours > 0) {
        return hours + '小时前';
    } else if (minutes > 0) {
        return minutes + '分钟前';
    } else {
        return '刚刚';
    }
}

// 添加粒子样式
const style = document.createElement('style');
style.textContent = `
    .particle {
        position: absolute;
        border-radius: 50%;
        animation: float 15s infinite ease-in-out;
        pointer-events: none;
        text-shadow: 0 0 10px currentColor;
        animation-fill-mode: both;
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0) translateX(0) scale(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
            transform: translateY(-20px) translateX(10px) scale(1);
        }
        20% {
            transform: translateY(-40px) translateX(-20px) scale(1.2);
        }
        40% {
            transform: translateY(-80px) translateX(30px) scale(1);
        }
        60% {
            transform: translateY(-120px) translateX(-40px) scale(1.1);
        }
        80% {
            transform: translateY(-160px) translateX(20px) scale(1);
        }
        90% {
            opacity: 1;
            transform: translateY(-180px) translateX(-10px) scale(0.8);
        }
        100% {
            transform: translateY(-200px) translateX(0) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* 响应式导航 */
    @media (max-width: 768px) {
        nav ul {
            display: none;
            position: absolute;
            top: 60px;
            left: 0;
            width: 100%;
            background: rgba(10, 10, 10, 0.95);
            padding: 20px;
            border-top: 1px solid rgba(233, 69, 96, 0.2);
            z-index: 1000;
        }
        
        nav ul.active {
            display: block;
        }
        
        nav ul li {
            margin: 10px 0;
            text-align: center;
        }
        
        #menu-toggle {
            display: block;
            cursor: pointer;
        }
    }
`;
document.head.appendChild(style);

// ========================================
// 性能优化：图片懒加载
// ========================================
(function() {
    'use strict';

    // 检测浏览器是否原生支持 Intersection Observer
    if ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window) {
        const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // 如果有 data-src，加载图片
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    // 添加 loaded 类
                    img.classList.add('loaded');
                    
                    // 停止观察
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '0px 0px 200px 0px', // 提前200px开始加载
            threshold: 0.01
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // 回退：简单的延迟加载
        setTimeout(() => {
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                }
            });
        }, 3000);
    }

    // 为所有 <img> 标签自动添加 loading="lazy" 属性（如果不支持 data-src）
    const allImages = document.querySelectorAll('img:not([loading])');
    allImages.forEach(img => {
        img.setAttribute('loading', 'lazy');
    });
})();