<template>
  <div class="fade">
    <!-- Hero Section -->
    <section class="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
      <!-- 背景装饰 -->
      <div class="absolute inset-0">
        <div class="absolute top-20 left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-cyan-400/5 rounded-full"></div>
      </div>

      <!-- 内容 -->
      <div class="relative z-10 text-center px-6">
        <div class="mono text-sm text-cyan-400/60 mb-6">
          <span class="inline-block px-3 py-1 border border-cyan-400/30 rounded">
            SYSTEM INITIALIZED
          </span>
        </div>

        <h1 class="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
          <span class="glitch">THE GHOST</span>
          <br class="md:hidden">
          <span class="glitch">IN THE SHELL</span>
        </h1>

        <p class="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          Explorations of consciousness, identity, and the digital boundary
        </p>

        <div class="flex items-center justify-center space-x-3 mono text-sm mb-12">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span class="text-gray-500">NEURAL LINK</span>
          </div>
          <div class="text-cyan-400/30">::</div>
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span class="text-gray-500">ESTABLISHED</span>
          </div>
        </div>

        <router-link
          to="/posts"
          class="cyber-button inline-block"
        >
          EXPLORE POSTS →
        </router-link>
      </div>
    </section>

    <!-- Featured Post -->
    <section class="max-w-7xl mx-auto px-6 py-20">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          <span class="text-cyan-400">///</span> LATEST ENTRY
        </h2>
        <p class="text-gray-500 mono text-sm">FROM THE DATA STREAM</p>
      </div>

      <div class="cyber-card rounded-lg p-8 md:p-12 max-w-4xl mx-auto">
        <div class="mono text-xs text-cyan-400/60 mb-4">
          <span>[{{ formatDate(latestPost.date) }}]</span>
          <span class="mx-3">::</span>
          <span>{{ latestPost.category }}</span>
        </div>

        <router-link
          :to="{ name: 'PostDetail', params: { id: latestPost.id } }"
          class="block"
        >
          <h3 class="text-2xl md:text-3xl font-bold mb-4 hover:text-cyan-400 transition-colors">
            {{ latestPost.title }}
          </h3>
        </router-link>

        <p class="text-gray-400 leading-relaxed mb-6">{{ latestPost.excerpt }}</p>

        <router-link
          :to="{ name: 'PostDetail', params: { id: latestPost.id } }"
          class="cyber-button inline-block text-sm"
        >
          READ FULL ENTRY →
        </router-link>
      </div>
    </section>

    <!-- Recent Posts Grid -->
    <section class="max-w-7xl mx-auto px-6 py-20">
      <div class="flex items-center justify-between mb-12">
        <div>
          <h2 class="text-3xl md:text-4xl font-bold mb-2">RECENT POSTS</h2>
          <p class="text-gray-500 mono text-sm">DATA ARCHIVE</p>
        </div>
        <router-link
          to="/posts"
          class="hidden md:flex cyber-button items-center"
        >
          VIEW ALL →
        </router-link>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="(post, index) in otherPosts"
          :key="post.id"
          class="cyber-card rounded-lg p-6 group hover:border-cyan-400/30 transition-all duration-300"
        >
          <div class="mono text-xs text-cyan-400/60 mb-4">
            <span>[{{ formatDate(post.date) }}]</span>
            <span class="mx-2">::</span>
            <span>{{ post.category }}</span>
          </div>

          <router-link
            :to="{ name: 'PostDetail', params: { id: post.id } }"
            class="block"
          >
            <h3 class="text-lg font-semibold mb-3 group-hover:text-cyan-400 transition-colors">
              {{ post.title }}
            </h3>
          </router-link>

          <p class="text-gray-400 text-sm leading-relaxed line-clamp-3">
            {{ post.excerpt }}
          </p>
        </article>
      </div>

      <div class="md:hidden mt-8 text-center">
        <router-link
          to="/posts"
          class="cyber-button"
        >
          VIEW ALL POSTS →
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getRecentPosts } from '../data/posts.js'

const allPosts = ref([])

onMounted(() => {
  allPosts.value = getRecentPosts(4)
})

const latestPost = computed(() => allPosts.value[0] || {})
const otherPosts = computed(() => allPosts.value.slice(1))

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).toUpperCase()
}
</script>
