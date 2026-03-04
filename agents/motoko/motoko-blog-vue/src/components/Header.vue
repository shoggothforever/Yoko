<template>
  <nav class="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-cyan-400/10" 
       style="background: rgba(5, 5, 8, 0.9);">
    <!-- 顶部发光线 -->
    <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
    
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="flex items-center space-x-3 group">
        <div class="w-14 h-14 border-2 border-cyan-400/30 flex items-center justify-center relative overflow-hidden rounded-xl transition-all duration-500 group-hover:border-cyan-400/60 group-hover:shadow-[0_0_30px_rgba(0,212,255,0.4)]">
          <!-- 角落装饰 -->
          <div class="corner-decoration corner-tl"></div>
          <div class="corner-decoration corner-tr"></div>
          <div class="corner-decoration corner-bl"></div>
          <div class="corner-decoration corner-br"></div>
          
          <span class="text-cyan-400 font-bold mono text-2xl glitch-text" data-text="MK">MK</span>
          <div class="scan-line"></div>
        </div>
        <div class="hidden sm:block">
          <div class="text-white font-bold tracking-wide text-xl font-display group-hover:text-cyan-400 transition-colors duration-300">MOTOKO</div>
          <div class="mono text-xs text-gray-500 group-hover:text-cyan-400/60 transition-colors tracking-[0.2em] mt-1">GHOST IN THE SHELL</div>
        </div>
      </router-link>

      <!-- Desktop Navigation -->
      <div class="hidden lg:flex items-center space-x-1">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          class="px-6 py-3 text-sm mono text-gray-400 hover:text-cyan-400 transition-all duration-300 relative group font-medium tracking-wider"
        >
          <span class="relative z-10 flex items-center space-x-2">
            <span class="text-gray-600 group-hover:text-cyan-400/40 transition-colors">/</span>
            <span>{{ item.name }}</span>
          </span>
          <span class="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
        </router-link>
      </div>

      <!-- Status Indicator -->
      <div class="hidden md:flex items-center space-x-4">
        <div class="flex items-center space-x-2 px-4 py-2 border border-cyan-400/20 rounded-full backdrop-blur-sm">
          <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_12px_rgba(0,255,136,0.6)]"></div>
          <span class="mono text-xs text-gray-400 font-medium">ONLINE</span>
        </div>
      </div>

      <!-- Mobile Menu Button -->
      <button
        @click="mobileMenu = !mobileMenu"
        class="lg:hidden text-white p-3 hover:text-cyan-400 transition-colors border border-cyan-400/20 rounded-lg hover:border-cyan-400/40"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
    </div>

    <!-- Mobile Menu Dropdown -->
    <transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="mobileMenu"
        class="lg:hidden absolute top-full left-0 right-0 backdrop-blur-xl border-b border-cyan-400/10"
        style="background: rgba(5, 5, 8, 0.98);"
      >
        <div class="max-w-7xl mx-auto px-6 py-6 space-y-3">
          <!-- 移动端状态指示 -->
          <div class="flex items-center space-x-3 pb-4 border-b border-cyan-400/10 mb-4">
            <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(0,255,136,0.5)]"></div>
            <span class="mono text-sm text-gray-400">SYSTEM STATUS: ONLINE</span>
          </div>
          
          <router-link
            v-for="item in navItems"
            :key="item.name"
            :to="item.path"
            @click="mobileMenu = false"
            class="block px-5 py-4 text-sm mono text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 rounded-lg border border-transparent hover:border-cyan-400/20 font-medium tracking-wider"
          >
            <span class="text-gray-600">/</span> {{ item.name }}
          </router-link>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const mobileMenu = ref(false)
const navItems = [
  { name: 'HOME', path: '/' },
  { name: 'POSTS', path: '/posts' },
  { name: 'ABOUT', path: '/about' }
]
</script>

<style scoped>
.router-link-active {
  color: #00d4ff !important;
}

.router-link-active::after {
  transform: scaleX(1) !important;
}

.corner-decoration {
  position: absolute;
  width: 10px;
  height: 10px;
  border-color: rgba(0, 212, 255, 0.4);
}

.corner-tl {
  top: 0;
  left: 0;
  border-top: 2px solid;
  border-left: 2px solid;
}

.corner-tr {
  top: 0;
  right: 0;
  border-top: 2px solid;
  border-right: 2px solid;
}

.corner-bl {
  bottom: 0;
  left: 0;
  border-bottom: 2px solid;
  border-left: 2px solid;
}

.corner-br {
  bottom: 0;
  right: 0;
  border-bottom: 2px solid;
  border-right: 2px solid;
}
</style>
