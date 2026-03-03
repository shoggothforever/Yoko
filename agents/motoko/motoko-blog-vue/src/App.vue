<template>
  <div id="app" class="min-h-screen bg-black text-white relative">
    <!-- 扫描线效果 -->
    <div class="scanlines"></div>

    <Header />
    <main>
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>
