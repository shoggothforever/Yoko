<template>
  <nav class="fixed top-0 left-0 right-0 z-50 border-b border-[rgba(0,245,255,0.1)] backdrop-blur-xl bg-black/80">
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="flex items-center space-x-3 group">
        <div class="w-10 h-10 border border-cyan-400 flex items-center justify-center relative overflow-hidden group-hover:border-cyan-300 transition-colors">
          <span class="text-cyan-400 font-bold mono text-lg glitch">MK</span>
          <div class="scan-line"></div>
        </div>
        <div class="hidden sm:block">
          <div class="text-white font-semibold tracking-wide">MOTOKO</div>
          <div class="text-cyan-400/60 mono text-xs">GHOST IN THE SHELL</div>
        </div>
      </router-link>

      <!-- Navigation -->
      <div class="hidden md:flex items-center space-x-1">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          class="px-4 py-2 text-sm mono text-gray-400 hover:text-cyan-400 transition-colors relative"
        >
          <span class="relative z-10">{{ item.name }}</span>
          <span class="absolute inset-0 bg-cyan-400/10 opacity-0 hover:opacity-100 transition-opacity"></span>
        </router-link>
      </div>

      <!-- Mobile Menu -->
      <button
        @click="mobileMenu = !mobileMenu"
        class="md:hidden text-white p-2"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
    </div>

    <!-- Mobile Menu Dropdown -->
    <div
      v-if="mobileMenu"
      class="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-[rgba(0,245,255,0.1)]"
    >
      <div class="max-w-7xl mx-auto px-6 py-4 space-y-2">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          @click="mobileMenu = false"
          class="block px-4 py-3 text-sm mono text-gray-400 hover:text-cyan-400 transition-colors"
        >
          {{ item.name }}
        </router-link>
      </div>
    </div>
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
  color: #00f5ff !important;
}
</style>
