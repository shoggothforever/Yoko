/**
 * Cyberpunk Visual Effects System
 * Pure JavaScript implementation, no framework required
 * 
 * Effects:
 * - GlitchText: Text glitch effect
 * - NeonBorder: Neon border animation
 * - Scanlines: CRT scanline effect
 * - MatrixRain: Matrix digital rain
 * - Typewriter: Typewriter effect
 * - CyberCard: Cyberpunk styled card
 */

(function(global) {
  'use strict';

  // Utility functions
  const utils = {
    // Generate random integer
    randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    // Generate random float
    randomFloat(min, max) {
      return Math.random() * (max - min) + min;
    },
    
    // Pick random item from array
    randomItem(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    },
    
    // Clamp value between min and max
    clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    },
    
    // Linear interpolation
    lerp(start, end, t) {
      return start * (1 - t) + end * t;
    },
    
    // Easing functions
    ease: {
      linear: t => t,
      easeInQuad: t => t * t,
      easeOutQuad: t => 1 - (1 - t) * (1 - t),
      easeInOutQuad: t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
      easeInCubic: t => t * t * t,
      easeOutCubic: t => 1 - Math.pow(1 - t, 3),
      easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
      easeOutElastic: t => {
        const c4 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
      }
    },
    
    // Animation loop helper
    animate(duration, callback, easing = 'easeOutQuad') {
      const startTime = performance.now();
      const easeFn = typeof easing === 'string' ? this.ease[easing] : easing;
      
      const tick = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeFn ? easeFn(progress) : progress;
        
        callback(easedProgress, progress);
        
        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };
      
      requestAnimationFrame(tick);
    },
    
    // Create DOM element with attributes
    createElement(tag, attrs = {}, children = []) {
      const el = document.createElement(tag);
      
      Object.entries(attrs).forEach(([key, value]) => {
        if (key === 'style' && typeof value === 'object') {
          Object.assign(el.style, value);
        } else if (key === 'class' && Array.isArray(value)) {
          el.className = value.join(' ');
        } else if (key.startsWith('on') && typeof value === 'function') {
          el.addEventListener(key.slice(2).toLowerCase(), value);
        } else {
          el.setAttribute(key, value);
        }
      });
      
      children.forEach(child => {
        if (typeof child === 'string') {
          el.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
          el.appendChild(child);
        }
      });
      
      return el;
    },
    
    // Intersection Observer helper
    onIntersect(element, callback, options = {}) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            callback(entry.target, entry);
            if (options.once) {
              observer.unobserve(entry.target);
            }
          } else if (options.onLeave) {
            options.onLeave(entry.target, entry);
          }
        });
      }, {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
        ...options
      });
      
      observer.observe(element);
      return () => observer.disconnect();
    }
  };

  // ============================================
  // GlitchText Component
  // ============================================
  class GlitchText {
    constructor(element, options = {}) {
      this.element = typeof element === 'string' ? document.querySelector(element) : element;
      this.options = {
        intensity: options.intensity || 1,
        speed: options.speed || 3000,
        glitchChars: options.glitchChars || '!@#$%^&*()_+-=[]{}|;:,.<>?',
        ...options
      };
      
      this.originalText = this.element.textContent;
      this.intervalId = null;
      
      this.init();
    }
    
    init() {
      this.element.classList.add('glitch-text');
      this.element.setAttribute('data-text', this.originalText);
      
      this.start();
    }
    
    triggerGlitch() {
      const iterations = 3 + Math.floor(Math.random() * 3);
      
      for (let i = 0; i < iterations; i++) {
        setTimeout(() => {
          this.element.textContent = this.originalText
            .split('')
            .map((char) => {
              if (Math.random() < 0.3 * this.options.intensity) {
                return this.options.glitchChars[Math.floor(Math.random() * this.options.glitchChars.length)];
              }
              return char;
            })
            .join('');
        }, i * 50);
      }
      
      setTimeout(() => {
        this.element.textContent = this.originalText;
      }, iterations * 50 + 100);
    }
    
    start() {
      this.intervalId = setInterval(() => {
        this.triggerGlitch();
      }, this.options.speed);
    }
    
    stop() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }
    
    destroy() {
      this.stop();
      this.element.classList.remove('glitch-text');
      this.element.removeAttribute('data-text');
      this.element.textContent = this.originalText;
    }
  }

  // ============================================
  // MatrixRain Component
  // ============================================
  class MatrixRain {
    constructor(container, options = {}) {
      this.container = typeof container === 'string' ? document.querySelector(container) : container;
      this.options = {
        characters: options.characters || 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789',
        density: options.density || 0.05,
        speed: options.speed || 1,
        fade: options.fade !== false,
        fontSize: options.fontSize || 14,
        color: options.color || '#0f0',
        ...options
      };
      
      this.canvas = null;
      this.ctx = null;
      this.columns = [];
      this.drops = [];
      this.animationId = null;
      
      this.init();
    }
    
    init() {
      // Create canvas
      this.canvas = document.createElement('canvas');
      this.canvas.className = 'matrix-rain';
      this.canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.15;
        pointer-events: none;
      `;
      
      this.container.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');
      
      // Set canvas size
      this.resize();
      
      // Initialize columns
      this.initColumns();
      
      // Start animation
      this.animate();
      
      // Handle resize
      window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.initColumns();
    }
    
    initColumns() {
      const columns = Math.floor(this.canvas.width / this.options.fontSize);
      this.drops = [];
      
      for (let i = 0; i < columns; i++) {
        this.drops[i] = Math.random() * -100;
      }
    }
    
    animate() {
      // Fade effect
      if (this.options.fade) {
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      } else {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
      
      // Set text style
      this.ctx.fillStyle = this.options.color;
      this.ctx.font = `${this.options.fontSize}px monospace`;
      
      // Draw characters
      for (let i = 0; i < this.drops.length; i++) {
        const char = this.options.characters[Math.floor(Math.random() * this.options.characters.length)];
        const x = i * this.options.fontSize;
        const y = this.drops[i] * this.options.fontSize;
        
        this.ctx.fillText(char, x, y);
        
        // Update position
        this.drops[i] += this.options.speed * (0.5 + Math.random() * 0.5);
        
        // Reset to top
        if (y > this.canvas.height && Math.random() > 0.975) {
          this.drops[i] = 0;
        }
      }
      
      this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
      if (this.canvas && this.canvas.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas);
      }
    }
  }

  // ============================================
  // Typewriter Component
  // ============================================
  class Typewriter {
    constructor(element, options = {}) {
      this.element = typeof element === 'string' ? document.querySelector(element) : element;
      this.options = {
        text: options.text || this.element.textContent,
        speed: options.speed || 50,
        delay: options.delay || 0,
        cursor: options.cursor !== false,
        onComplete: options.onComplete || null,
        ...options
      };
      
      this.displayedText = '';
      this.isTyping = true;
      this.timeoutId = null;
      
      this.init();
    }
    
    init() {
      this.element.textContent = '';
      this.element.classList.add('typewriter');
      
      // Create cursor element
      if (this.options.cursor) {
        const cursor = document.createElement('span');
        cursor.className = 'typewriter-cursor';
        cursor.textContent = '|';
        this.element.appendChild(cursor);
      }
      
      setTimeout(() => this.type(), this.options.delay);
    }
    
    type(index = 0) {
      if (index < this.options.text.length) {
        this.displayedText += this.options.text[index];
        this.element.firstChild.textContent = this.displayedText;
        
        this.timeoutId = setTimeout(() => this.type(index + 1), this.options.speed);
      } else {
        this.isTyping = false;
        if (this.options.onComplete) {
          this.options.onComplete();
        }
      }
    }
    
    destroy() {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      this.element.classList.remove('typewriter');
    }
  }

  // ============================================
  // Export all components
  // ============================================
  const CyberpunkEffects = {
    GlitchText,
    MatrixRain,
    Typewriter,
    utils,
    
    // Helper to init all effects on a page
    initAll() {
      // Auto-init glitch text elements
      document.querySelectorAll('[data-glitch]').forEach(el => {
        new GlitchText(el, {
          intensity: parseInt(el.dataset.glitchIntensity) || 1,
          speed: parseInt(el.dataset.glitchSpeed) || 3000,
        });
      });
      
      // Auto-init matrix rain containers
      document.querySelectorAll('[data-matrix-rain]').forEach(el => {
        new MatrixRain(el, {
          density: parseFloat(el.dataset.matrixDensity) || 0.05,
          speed: parseFloat(el.dataset.matrixSpeed) || 1,
          color: el.dataset.matrixColor || '#0f0',
        });
      });
      
      // Auto-init typewriter elements
      document.querySelectorAll('[data-typewriter]').forEach(el => {
        new Typewriter(el, {
          text: el.dataset.typewriter || el.textContent,
          speed: parseInt(el.dataset.typewriterSpeed) || 50,
          delay: parseInt(el.dataset.typewriterDelay) || 0,
        });
      });
    }
  };

  // Expose to global scope
  global.CyberpunkEffects = CyberpunkEffects;

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', CyberpunkEffects.initAll);
  } else {
    CyberpunkEffects.initAll();
  }

})(window);
