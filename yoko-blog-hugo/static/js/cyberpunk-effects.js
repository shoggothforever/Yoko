/**
 * 赛博朋克特效脚本
 * 提供：鼠标跟踪、故障效果、打字机光标等
 */

// 鼠标跟踪器
const cursorTracker = document.getElementById('cursor-tracker');
if (cursorTracker) {
    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // 更新跟踪器位置
        cursorTracker.style.left = (mouseX - 10) + 'px';
        cursorTracker.style.top = (mouseY - 10) + 'px';

        // 拖尾效果
        createTrail(mouseX, mouseY);
    });
}

// 拖尾效果
function createTrail(x, y) {
    const trail = document.createElement('div');
    trail.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(233, 69, 96, 0.5);
        pointer-events: none;
        z-index: 9998;
        transition: all 0.3s ease-out;
        transform: scale(1);
    `;
    document.body.appendChild(trail);

    requestAnimationFrame(() => {
        trail.style.transform = 'scale(0)';
        trail.style.opacity = '0';
    });

    setTimeout(() => {
        trail.remove();
    }, 300);
}

// 故障文字效果
function addGlitchEffect() {
    const titles = document.querySelectorAll('.logo, .section-title');
    titles.forEach(title => {
        title.addEventListener('mouseover', () => {
            title.classList.add('glitch-text');
        });
        title.addEventListener('mouseleave', () => {
            title.classList.remove('glitch-text');
        });
    });
}

// 终端打字机效果
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    element.innerHTML += '<span class="terminal-cursor"></span>';

    function type() {
        if (i < text.length) {
            const cursor = element.querySelector('.terminal-cursor');
            const content = text.substring(0, i + 1);
            element.innerHTML = content + '<span class="terminal-cursor"></span>';
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// 数据流动画
function createDataParticles() {
    const container = document.querySelector('.matrix-rain');
    if (!container) return;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            width: 2px;
            height: 2px;
            background: rgba(0, 255, 0, ${0.3 + Math.random() * 0.3});
            border-radius: 50%;
            animation: float ${3 + Math.random() * 5}s ease-in-out infinite;
        `;
        container.appendChild(particle);
    }
}

// 音效（赛朋克风格的点击声）
function playClickSound() {
    // 创建简单的合成音效
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
        // 音频API 不可用或被阻止
        console.log('Audio not available:', e);
    }
}

// 初始化特效
document.addEventListener('DOMContentLoaded', () => {
    addGlitchEffect();
    createDataParticles();

    // 为按钮添加音效
    document.querySelectorAll('button, a').forEach(el => {
        el.addEventListener('click', () => {
            playClickSound();
        });
    });

    // 为卡片添加全息效果
    document.querySelectorAll('.blog-post, .friend-link').forEach(card => {
        card.classList.add('card-hologram-hover');
    });

    // 滚动音
    console.log('%c[ 赛博朋克模式已激活 %c]', 'color: #e94560; font-weight: bold;');
    console.log('%c> 系统就绪，等待用户输入...', 'color: #533483;');
});

// 页面加载进度条
window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('reading-progress');
    if (scrollProgress) {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    }
});

// 键盘音效
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        playClickSound();
    }
});
