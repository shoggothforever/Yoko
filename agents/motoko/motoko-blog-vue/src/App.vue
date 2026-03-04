<template>
  <div id="app" class="min-h-screen bg-deep text-primary relative overflow-hidden">
    <!-- 背景效果层 -->
    <div class="bg-grid"></div>
    <div class="bg-radial"></div>
    <div class="bg-hexagon"></div>
    <div class="particles"></div>
    
    <!-- 扫描线效果 -->
    <div class="scanlines"></div>
    <div class="horizontal-scan"></div>

    <!-- 主要内容 -->
    <div class="relative z-10">
      <Header />
      <main>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
      <Footer />
    </div>
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>
