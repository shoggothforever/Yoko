<template>
  <div class="fade pt-32" v-if="post">
    <article class="max-w-4xl mx-auto px-6">
      <router-link
        to="/posts"
        class="inline-flex items-center space-x-3 mono text-sm text-gray-500 hover:text-cyan-400 transition-colors mb-8"
      >
        <span>←</span>
        <span>RETURN TO ARCHIVE</span>
      </router-link>

      <header class="mb-12">
        <div class="mono text-xs text-cyan-400/60 mb-4">
          <span>[{{ formatDate(post.date) }}]</span>
          <span class="mx-3">::</span>
          <span>{{ post.category }}</span>
        </div>

        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          {{ post.title }}
        </h1>

        <div class="flex items-center space-x-4 mono text-xs text-gray-500">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span>READ TIME: ~5 MIN</span>
          </div>
          <span class="text-cyan-400/30">|</span>
          <span>ENTRY STATUS: ACTIVE</span>
        </div>
      </header>

      <div class="cyber-card rounded-lg p-8 md:p-12 lg:p-16">
        <div class="prose max-w-none" v-html="renderedContent"></div>
      </div>

      <footer class="mt-12 pt-8 border-t border-[rgba(0,245,255,0.1)]">
        <div class="flex items-center justify-between">
          <div class="mono text-xs text-gray-500">
            END OF ENTRY
          </div>
          <router-link
            to="/posts"
            class="cyber-button text-sm inline-flex items-center space-x-2"
          >
            <span>BROWSE MORE</span>
            <span>→</span>
          </router-link>
        </div>
      </footer>
    </article>
  </div>

  <div v-else class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <div class="mono text-8xl text-cyan-400/20 mb-4">404</div>
      <h2 class="text-2xl font-bold mb-4">ENTRY NOT FOUND</h2>
      <p class="text-gray-500 mono text-sm mb-8">DATA SEGMENT CORRUPTED OR MISSING</p>
      <router-link
        to="/posts"
        class="cyber-button"
      >
        RETURN TO ARCHIVE
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getPostById } from '../data/posts.js'

const route = useRoute()
const post = ref(null)

onMounted(() => {
  post.value = getPostById(route.params.id)
  window.scrollTo(0, 0)
})

const renderedContent = computed(() => {
  if (!post.value) return ''
  return markdownToHtml(post.value.content)
})

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).toUpperCase()
}

function markdownToHtml(markdown) {
  let html = markdown

  html = html.replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold mt-8 mb-4 text-white border-l-2 border-cyan-400 pl-4">$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-semibold mt-10 mb-5 text-white border-b border-[rgba(0,245,255,0.1)] pb-3">$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-8 mb-6 text-white">$1</h1>')

  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-cyan-400">$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em class="italic text-gray-400">$1</em>')

  html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-2 border-purple-400 pl-6 py-4 bg-purple-900/20 my-6 rounded-r text-gray-300 italic">$1</blockquote>')

  html = html.replace(/^- (.+)$/gm, '<li class="ml-6 mb-2 text-gray-400 flex items-start"><span class="text-cyan-400 mr-3">→</span>$1</li>')

  html = html.replace(/`([^`]+)`/g, '<code class="bg-black/50 text-cyan-400 px-2 py-1 rounded text-sm mono border border-cyan-400/20">$1</code>')

  html = html.split('\n\n').map(p => {
    if (p.trim() && !p.match(/^</)) {
      return `<p class="mb-6 leading-relaxed text-gray-400">${p}</p>`
    }
    return p
  }).join('\n')

  return html
}
</script>
