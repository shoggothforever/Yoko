/**
 * Cyberpunk Vue 3 Animation System
 * 赛博朋克 Vue 3 动画系统
 * 
 * 包含组件：
 * - GlitchText: 故障文字效果
 * - NeonBorder: 霓虹灯边框
 * - Scanline: 扫描线效果
 * - CyberCard: 赛博朋克卡片
 * - Typewriter: 打字机效果
 * - MatrixRain: 矩阵雨效果
 */

const { createApp, ref, onMounted, onUnmounted, computed } = Vue;

// ============================================
// GlitchText 组件 - 故障文字效果
// ============================================
const GlitchText = {
  name: 'GlitchText',
  props: {
    text: { type: String, required: true },
    intensity: { type: Number, default: 1 }, // 1-3
    speed: { type: Number, default: 3000 }, // ms
  },
  template: `
    <span class="glitch-text" :data-text="displayText" :style="glitchStyle">
      {{ displayText }}
    </span>
  `,
  setup(props) {
    const displayText = ref(props.text);
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    let intervalId = null;

    const glitchStyle = computed(() => ({
      '--glitch-intensity': props.intensity,
    }));

    const triggerGlitch = () => {
      const original = props.text;
      const iterations = 3 + Math.floor(Math.random() * 3);
      
      for (let i = 0; i < iterations; i++) {
        setTimeout(() => {
          displayText.value = original
            .split('')
            .map((char, idx) => {
              if (Math.random() < 0.3) {
                return glitchChars[Math.floor(Math.random() * glitchChars.length)];
              }
              return char;
            })
            .join('');
        }, i * 50);
      }

      setTimeout(() => {
        displayText.value = original;
      }, iterations * 50 + 100);
    };

    onMounted(() => {
      intervalId = setInterval(triggerGlitch, props.speed);
    });

    onUnmounted(() => {
      if (intervalId) clearInterval(intervalId);
    });

    return { displayText, glitchStyle };
  },
};

// ============================================
// NeonBorder 组件 - 霓虹灯边框
// ============================================
const NeonBorder = {
  name: 'NeonBorder',
  props: {
    color: { type: String, default: '#e94560' }, // 默认红色
    intensity: { type: Number, default: 1 },
    animated: { type: Boolean, default: true },
  },
  template: `
    <div class="neon-border" :style="containerStyle">
      <div class="neon-glow" :style="glowStyle"></div>
      <div class="neon-content">
        <slot></slot>
      </div>
    </div>
  `,
  setup(props) {
    const containerStyle = computed(() => ({
      position: 'relative',
      borderRadius: '12px',
      padding: '2px',
      background: `linear-gradient(135deg, ${props.color}33, transparent)`,
    }));

    const glowStyle = computed(() => ({
      position: 'absolute',
      top: '-2px',
      left: '-2px',
      right: '-2px',
      bottom: '-2px',
      borderRadius: '14px',
      background: `linear-gradient(45deg, ${props.color}, ${props.color}66, ${props.color})`,
      filter: `blur(${8 * props.intensity}px)`,
      opacity: 0.7,
      animation: props.animated ? 'neonPulse 2s ease-in-out infinite' : 'none',
      zIndex: -1,
    }));

    return { containerStyle, glowStyle };
  },
};

// ============================================
// Scanline 组件 - 扫描线效果
// ============================================
const Scanline = {
  name: 'Scanline',
  props: {
    opacity: { type: Number, default: 0.1 },
    speed: { type: Number, default: 8 }, // 秒
  },
  template: `
    <div class="scanline-container">
      <slot></slot>
      <div class="scanline" :style="scanlineStyle"></div>
      <div class="scanline-overlay" :style="overlayStyle"></div>
    </div>
  `,
  setup(props) {
    const scanlineStyle = computed(() => ({
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '2px',
      background: 'linear-gradient(90deg, transparent, rgba(233, 69, 96, 0.8), transparent)',
      animation: `scanlineMove ${props.speed}s linear infinite`,
      zIndex: 1000,
      pointerEvents: 'none',
    }));

    const overlayStyle = computed(() => ({
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0, 0, 0, ${props.opacity}) 2px,
        rgba(0, 0, 0, ${props.opacity}) 4px
      )`,
      zIndex: 999,
      pointerEvents: 'none',
    }));

    return { scanlineStyle, overlayStyle };
  },
};

// ============================================
// Typewriter 组件 - 打字机效果
// ============================================
const Typewriter = {
  name: 'Typewriter',
  props: {
    text: { type: String, required: true },
    speed: { type: Number, default: 50 }, // ms per char
    delay: { type: Number, default: 0 }, // ms before start
    cursor: { type: Boolean, default: true },
  },
  template: `
    <span class="typewriter">
      <span class="typewriter-text">{{ displayedText }}</span>
      <span v-if="cursor && isTyping" class="typewriter-cursor">|</span>
    </span>
  `,
  setup(props) {
    const displayedText = ref('');
    const isTyping = ref(true);
    let timeoutId = null;

    const typeNextChar = (index) => {
      if (index < props.text.length) {
        displayedText.value += props.text[index];
        timeoutId = setTimeout(() => typeNextChar(index + 1), props.speed);
      } else {
        isTyping.value = false;
      }
    };

    onMounted(() => {
      timeoutId = setTimeout(() => {
        typeNextChar(0);
      }, props.delay);
    });

    onUnmounted(() => {
      if (timeoutId) clearTimeout(timeoutId);
    });

    return { displayedText, isTyping };
  },
};

// ============================================
// MatrixRain 组件 - 矩阵雨效果
// ============================================
const MatrixRain = {
  name: 'MatrixRain',
  props: {
    characters: { type: String, default: 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789' },
    density: { type: Number, default: 0.05 }, // 列密度
    speed: { type: Number, default: 1 }, // 下落速度倍率
    fade: { type: Boolean, default: true },
  },
  template: `
    <canvas ref="canvas" class="matrix-rain" :style="canvasStyle"></canvas>
  `,
  setup(props) {
    const canvas = ref(null);
    const canvasStyle = computed(() => ({
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      opacity: 0.15,
      pointerEvents: 'none',
    }));

    let animationId = null;
    let ctx = null;
    let columns = [];
    let drops = [];

    const init = () => {
      if (!canvas.value) return;
      
      ctx = canvas.value.getContext('2d');
      canvas.value.width = window.innerWidth;
      canvas.value.height = window.innerHeight;

      const fontSize = 14;
      columns.value = Math.floor(canvas.value.width / fontSize);
      drops = [];

      for (let i = 0; i < columns.value; i++) {
        drops[i] = Math.random() * -100; // 随机初始高度
      }
    };

    const draw = () => {
      if (!ctx || !canvas.value) return;

      // 淡出效果
      if (props.fade) {
        ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        ctx.fillRect(0, 0, canvas.value.width, canvas.value.height);
      } else {
        ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
      }

      ctx.fillStyle = '#0f0';
      ctx.font = '14px monospace';

      const fontSize = 14;

      for (let i = 0; i < drops.length; i++) {
        // 随机选择字符
        const char = props.characters[Math.floor(Math.random() * props.characters.length)];
        
        // 绘制字符
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        // 更新位置
        drops[i] += props.speed * (0.5 + Math.random() * 0.5);

        // 重置到顶部
        if (drops[i] * fontSize > canvas.value.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    onMounted(() => {
      init();
      draw();
      
      window.addEventListener('resize', () => {
        init();
      });
    });

    onUnmounted(() => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    });

    return { canvas, canvasStyle };
  },
};

// ============================================
// 样式注入
// ============================================
const injectStyles = () => {
  const styleId = 'cyberpunk-vue-styles';
  if (document.getElementById(styleId)) return;

  const styles = document.createElement('style');
  styles.id = styleId;
  styles.textContent = `
    /* Glitch Text */
    .glitch-text {
      position: relative;
      display: inline-block;
    }
    
    .glitch-text::before,
    .glitch-text::after {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.8;
    }
    
    .glitch-text::before {
      color: #e94560;
      animation: glitch-1 2s infinite linear alternate-reverse;
      clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
    }
    
    .glitch-text::after {
      color: #533483;
      animation: glitch-2 3s infinite linear alternate-reverse;
      clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
    }
    
    @keyframes glitch-1 {
      0%, 100% { transform: translate(0); }
      20% { transform: translate(-3px, 3px); }
      40% { transform: translate(3px, -3px); }
      60% { transform: translate(-3px, -3px); }
      80% { transform: translate(3px, 3px); }
    }
    
    @keyframes glitch-2 {
      0%, 100% { transform: translate(0); }
      20% { transform: translate(3px, -3px); }
      40% { transform: translate(-3px, 3px); }
      60% { transform: translate(3px, 3px); }
      80% { transform: translate(-3px, -3px); }
    }
    
    /* Typewriter Cursor */
    .typewriter-cursor {
      display: inline-block;
      width: 3px;
      height: 1.2em;
      background: #e94560;
      margin-left: 2px;
      animation: blink 1s step-end infinite;
      vertical-align: text-bottom;
    }
    
    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }
    
    /* Scanline Animation */
    @keyframes scanlineMove {
      0% { top: 0; }
      100% { top: 100%; }
    }
    
    /* Neon Pulse */
    @keyframes neonPulse {
      0%, 100% { opacity: 0.5; box-shadow: 0 0 10px currentColor; }
      50% { opacity: 1; box-shadow: 0 0 20px currentColor, 0 0 40px currentColor; }
    }
    
    /* Neon Border Glow */
    .neon-border {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
    }
    
    .neon-border::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: inherit;
      padding: 2px;
      background: linear-gradient(45deg, var(--neon-color, #e94560), var(--neon-color-2, #533483));
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      animation: neonRotate 3s linear infinite;
    }
    
    @keyframes neonRotate {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }
    
    /* Matrix Rain Canvas */
    .matrix-rain {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
      opacity: 0.15;
    }
    
    /* Cyber Card */
    .cyber-card {
      position: relative;
      background: rgba(22, 33, 62, 0.8);
      border: 1px solid rgba(15, 52, 96, 0.5);
      border-radius: 12px;
      padding: 24px;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    
    .cyber-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(233, 69, 96, 0.1), transparent);
      transition: left 0.5s ease;
    }
    
    .cyber-card:hover::before {
      left: 100%;
    }
    
    .cyber-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(233, 69, 96, 0.2);
      border-color: rgba(233, 69, 96, 0.5);
    }
    
    /* Loading Animation */
    .cyber-loader {
      width: 48px;
      height: 48px;
      border: 3px solid rgba(233, 69, 96, 0.3);
      border-radius: 50%;
      border-top-color: #e94560;
      animation: cyberSpin 1s linear infinite;
    }
    
    @keyframes cyberSpin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* Button Effects */
    .cyber-btn {
      position: relative;
      padding: 12px 24px;
      background: transparent;
      border: 2px solid #e94560;
      color: #e94560;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 2px;
      cursor: pointer;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    
    .cyber-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(233, 69, 96, 0.4), transparent);
      transition: left 0.5s ease;
    }
    
    .cyber-btn:hover {
      background: #e94560;
      color: #0a0a0a;
      box-shadow: 0 0 20px rgba(233, 69, 96, 0.5);
    }
    
    .cyber-btn:hover::before {
      left: 100%;
    }
    
    /* Status Indicators */
    .cyber-status {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: 500;
    }
    
    .cyber-status::before {
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 50%;
      animation: statusPulse 2s ease-in-out infinite;
    }
    
    .cyber-status.online {
      background: rgba(0, 255, 136, 0.1);
      color: #00ff88;
      border: 1px solid rgba(0, 255, 136, 0.3);
    }
    
    .cyber-status.online::before {
      background: #00ff88;
    }
    
    .cyber-status.offline {
      background: rgba(255, 68, 68, 0.1);
      color: #ff4444;
      border: 1px solid rgba(255, 68, 68, 0.3);
    }
    
    .cyber-status.offline::before {
      background: #ff4444;
      animation: none;
    }
    
    .cyber-status.warning {
      background: rgba(255, 170, 0, 0.1);
      color: #ffaa00;
      border: 1px solid rgba(255, 170, 0, 0.3);
    }
    
    .cyber-status.warning::before {
      background: #ffaa00;
    }
    
    @keyframes statusPulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.1); }
    }
    
    /* Data Terminal Effect */
    .data-terminal {
      background: rgba(0, 20, 0, 0.9);
      border: 1px solid #00ff00;
      border-radius: 8px;
      padding: 20px;
      font-family: 'Courier New', monospace;
      color: #00ff00;
      position: relative;
      overflow: hidden;
    }
    
    .data-terminal::before {
      content: '>';
      position: absolute;
      left: 10px;
      top: 20px;
      animation: terminalBlink 1s step-end infinite;
    }
    
    .data-terminal-content {
      margin-left: 20px;
      line-height: 1.8;
    }
    
    @keyframes terminalBlink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }
  `;

  document.head.appendChild(styles);
};

// ============================================
// 注册所有组件
// ============================================
const registerCyberpunkComponents = (app) => {
  app.component('GlitchText', GlitchText);
  app.component('NeonBorder', NeonBorder);
  app.component('Scanline', Scanline);
  app.component('Typewriter', Typewriter);
  app.component('MatrixRain', MatrixRain);
  
  // 注入全局样式
  injectStyles();
};

// ============================================
// 创建全局Cyberpunk应用实例
// ============================================
const createCyberpunkApp = (rootComponent, rootProps = {}) => {
  const app = createApp(rootComponent, rootProps);
  registerCyberpunkComponents(app);
  return app;
};

// 导出所有组件和工具
window.CyberpunkVue = {
  createApp: createCyberpunkApp,
  components: {
    GlitchText,
    NeonBorder,
    Scanline,
    Typewriter,
    MatrixRain,
  },
  register: registerCyberpunkComponents,
};
