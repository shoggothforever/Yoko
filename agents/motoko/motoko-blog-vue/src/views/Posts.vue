<template>
  <div class="fade pt-32">
    <!-- 标题区域 -->
    <section class="max-w-7xl mx-auto px-6 mb-16">
      <div class="flex items-center space-x-4 mb-6">
        <div class="w-1 h-8 bg-cyan-400"></div>
        <h1 class="text-4xl md:text-5xl font-bold">ARCHIVE</h1>
        <div class="flex-1 h-px bg-gradient-to-r from-cyan-400/30 to-transparent"></div>
      </div>

      <p class="text-gray-500 mono text-sm mb-8">ALL DATA ENTRIES FROM THE NETWORK</p>

      <!-- 分类过滤器 -->
      <div class="flex flex-wrap gap-3">
        <button
          @click="selectedCategory = null"
          :class="[
            'px-4 py-2 mono text-sm rounded transition-all',
            selectedCategory === null
              ? 'bg-cyan-400 text-black'
              : 'border border-cyan-400/30 text-gray-400 hover:border-cyan-400 hover:text-cyan-400'
          ]"
        >
          ALL
        </button>
        <button
          v-for="category in categories"
          :key="category"
          @click="selectedCategory = category"
          :class="[
            'px-4 py-2 mono text-sm rounded transition-all',
            selectedCategory === category
              ? 'bg-cyan-400 text-black'
              : 'border border-cyan-400/30 text-gray-400 hover:border-cyan-400 hover:text-cyan-400'
          ]"
        >
          {{ category.toUpperCase() }}
        </button>
      </div>
    </section>

    <!-- 文章列表 -->
    <section class="max-w-7xl mx-auto px-6">
      <div v-if="filteredPosts.length > 0" class="grid md:grid-cols-2 gap-6 lg:gap-8">
        <article
          v-for="(post, index) in filteredPosts"
          :key="post.id"
          class="cyber-card rounded-lg p-6 md:p-8 group hover:border-cyan-400/30 transition-all duration-300 relative overflow-hidden"
        >
          <!-- 序号 -->
          <div class="absolute top-4 right-4 mono text-xs text-cyan-400/30">
            {{ String(index + 1).padStart(3, '0') }}
          </div>

          <div class="mono text-xs text-cyan-400/60 mb-4">
            <span>[{{ formatDate(post.date) }}]</span>
            <span class="mx-3">::</span>
            <span>{{ post.category }}</span>
          </div>

          <router-link
            :to="{ name: 'PostDetail', params: { id: post.id } }"
            class="block"
          >
            <h2 class="text-xl md:text-2xl font-bold mb-4 group-hover:text-cyan-400 transition-colors">
              {{ post.title }}
            </h2>
          </router-link>

          <p class="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-4">
            {{ post.excerpt }}
          </p>

          <router-link
            :to="{ name: 'PostDetail', params: { id: post.id } }"
            class="inline-flex items-center space-x-2 mono text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>READ ENTRY</span>
            <span class="transform group-hover:translate-x-1 transition-transform">→</span>
          </router-link>
        </article>
      </div>

      <!-- 空状态 -->
      <div v-else class="text-center py-20">
        <div class="mono text-gray-500 space-y-2">
          <p class="text-6xl mb-4">∅</p>
          <p>NO ENTRIES FOUND</p>
          <p class="text-sm">TRY ADJUSTING FILTERS</p>
        </div>
      </div>
    </section>

    <!-- 分页信息 -->
    <section v-if="filteredPosts.length > 0" class="max-w-7xl mx-auto px-6 mt-16">
      <div class="cyber-card rounded-lg p-6">
        <div class="flex items-center justify-between mono text-sm text-gray-500">
          <div>
            <span class="mr-2">TOTAL ENTRIES:</span>
            <span class="text-cyan-400">{{ filteredPosts.length }}</span>
          </div>
          <div>
            <span class="mr-2">FILTER:</span>
            <span class="text-cyan-400">{{ selectedCategory || 'ALL' }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { posts, getCategories } from '../data/posts.js'

const selectedCategory = ref(null)
const categories = ref([])

onMounted(() => {
  categories.value = getCategories()
})

const filteredPosts = computed(() => {
  if (!selectedCategory.value) {
    return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date))
  }
  return posts
    .filter(post => post.category === selectedCategory.value)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
})

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).toUpperCase()
}
</script>
