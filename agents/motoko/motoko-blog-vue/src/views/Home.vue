<template>
  <div class="fade">
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
      <!-- Background Effects -->
      <div class="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#050508] to-[#0a0a0f]"></div>
      <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cpath d=&quot;M0 0h60v1H0zM0 0h1v60H0z&quot; fill=&quot;rgba(0,212,255,0.03)&quot; fill-rule=&quot;evenodd&quot;/%3E%3C/svg%3E')] opacity-50"></div>
      
      <!-- Gradient Orbs -->
      <div class="absolute top-20 left-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-20 right-20 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px]"></div>

      <!-- Content -->
      <div class="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <!-- Status Badge -->
        <div class="inline-flex items-center gap-4 px-6 py-3 border border-cyan-400/20 rounded-full mb-12 backdrop-blur-sm bg-black/30">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span class="mono text-xs text-cyan-400 tracking-wider">SYSTEM INITIALIZED</span>
          </div>
          <div class="w-px h-4 bg-cyan-400/20"></div>
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span class="mono text-xs text-green-400 tracking-wider">NEURAL LINK ESTABLISHED</span>
          </div>
        </div>

        <!-- Main Title -->
        <h1 class="text-6xl md:text-8xl font-bold mb-8 tracking-tight leading-tight">
          <div class="mb-4">
            <span class="inline-block hover:text-cyan-400 transition-colors cursor-default">THE GHOST</span>
          </div>
          <div class="flex items-center justify-center gap-4 mb-6">
            <div class="h-[2px] w-24 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
            <span class="text-4xl mono text-cyan-400/40 tracking-widest">///</span>
            <div class="h-[2px] w-24 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
          </div>
          <div>
            <span class="inline-block hover:text-purple-400 transition-colors cursor-default">IN THE SHELL</span>
          </div>
        </h1>

        <!-- Subtitle -->
        <p class="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Explorations of <span class="text-cyan-400 font-medium">consciousness</span>, 
          <span class="text-purple-400 font-medium">identity</span>, and the 
          <span class="text-white font-medium">digital boundary</span>
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <router-link
            to="/posts"
            class="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-[#0a0a0f] font-bold rounded-lg hover:shadow-[0_0_40px_rgba(0,212,255,0.4)] transition-all duration-300"
          >
            <span class="flex items-center gap-3">
              <span class="mono tracking-wider">EXPLORE POSTS</span>
              <span class="transform group-hover:translate-x-2 transition-transform">→</span>
            </span>
          </router-link>
          
          <router-link
            to="/about"
            class="px-8 py-4 border-2 border-cyan-400 text-cyan-400 font-bold rounded-lg hover:bg-cyan-400/10 transition-all duration-300"
          >
            <span class="mono tracking-wider">LEARN MORE</span>
          </router-link>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-3 gap-12 max-w-lg mx-auto">
          <div class="text-center">
            <div class="mono text-4xl md:text-5xl text-cyan-400 font-bold mb-2">30</div>
            <div class="mono text-xs text-gray-500 tracking-wider">YEARS</div>
          </div>
          <div class="text-center">
            <div class="mono text-4xl md:text-5xl text-purple-400 font-bold mb-2">4</div>
            <div class="mono text-xs text-gray-500 tracking-wider">SERIES</div>
          </div>
          <div class="text-center">
            <div class="mono text-4xl md:text-5xl text-white font-bold mb-2">∞</div>
            <div class="mono text-xs text-gray-500 tracking-wider">QUESTIONS</div>
          </div>
        </div>
      </div>

      <!-- Corner Decorations -->
      <div class="absolute top-24 left-8 w-20 h-20 border border-cyan-400/10 rounded-sm opacity-50">
        <div class="absolute top-0 left-0 w-10 h-10 border-l-2 border-t-2 border-cyan-400/30"></div>
      </div>
      <div class="absolute bottom-24 right-8 w-20 h-20 border border-purple-400/10 rounded-sm opacity-50">
        <div class="absolute bottom-0 right-0 w-10 h-10 border-r-2 border-b-2 border-purple-400/30"></div>
      </div>
    </section>

    <!-- Latest Post Section -->
    <section class="max-w-7xl mx-auto px-6 py-24">
      <div class="text-center mb-16">
        <div class="mono text-sm text-cyan-400/60 mb-4 tracking-[0.3em]">/// LATEST ENTRY</div>
        <h2 class="text-4xl md:text-5xl font-bold mb-4">FROM THE DATA STREAM</h2>
        <div class="w-24 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent mx-auto"></div>
      </div>

      <div class="max-w-4xl mx-auto bg-[#12121a]/80 backdrop-blur-xl border border-cyan-400/15 rounded-2xl p-8 md:p-12 relative overflow-hidden">
        <!-- Post Meta -->
        <div class="flex flex-wrap items-center gap-3 mb-6">
          <span class="mono text-xs text-cyan-400 tracking-wider bg-cyan-400/10 px-3 py-1 rounded">
            [{{ formatDate(latestPost.date) }}]
          </span>
          <span class="mono text-xs text-gray-600">//</span>
          <span class="mono text-xs text-purple-400 tracking-wider bg-purple-400/10 px-3 py-1 rounded">
            {{ latestPost.category }}
          </span>
        </div>

        <!-- Post Title -->
        <router-link
          :to="{ name: 'PostDetail', params: { id: latestPost.id } }"
          class="block mb-6"
        >
          <h3 class="text-2xl md:text-3xl font-bold hover:text-cyan-400 transition-colors duration-300">
            {{ latestPost.title }}
          </h3>
        </router-link>

        <!-- Post Excerpt -->
        <p class="text-gray-400 leading-relaxed mb mb-8 text-lg">{{ latestPost.excerpt }}</p>

        <!-- CTA Button -->
        <router-link
          :to="{ name: 'PostDetail', params: { id: latestPost.id } }"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-[#0a0a0f] font-bold rounded-lg hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all duration-300"
        >
          <span class="mono tracking-wider text-sm">READ FULL ENTRY</span>
          <span class="transform group-hover:translate-x-2 transition-transform">→</span>
        </router-link>
      </div>
    </section>

    <!-- Recent Posts Grid -->
    <section class="max-w-7xl mx-auto px-6 py-24">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-4">
        <div>
          <h2 class="text-4xl md:text-5xl font-bold mb-3">RECENT POSTS</h2>
          <div class="mono text-sm text-gray-500 flex items-center gap-3">
            <span class="text-cyan-400/40">///</span>
            <span>DATA ARCHIVE</span>
            <span class="text-cyan-400/40">::</span>
            <span class="text-cyan-400/60 bg-cyan-400/10 px-2 py-0.5 rounded">{{ otherPosts.length }} ENTRIES</span>
          </div>
        </div>
        <router-link
          to="/posts"
          class="hidden md:flex px-6 py-3 border-2 border-cyan-400 text-cyan-400 font-bold rounded-lg hover:bg-cyan-400/10 transition-all duration-300"
        >
          <span class="mono tracking-wider text-sm">VIEW ALL →</span>
        </router-link>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="(post, index) in otherPosts"
          :key="post.id"
          class="bg-[#12121a]/80 backdrop-blur-xl border border-cyan-400/15 rounded-xl p-6 hover:border-cyan-400/30 hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)] transition-all duration-300"
        >
          <!-- Post Meta -->
          <div class="flex flex-wrap items-center gap-2 mb-4">
            <span class="mono text-xs text-cyan-400/70 bg-cyan-400/10 px-2 py-1 rounded">
              [{{ formatDate(post.date) }}]
            </span>
            <span class="mono text-xs text-gray-500">//</span>
            <span class="mono text-xs text-gray-400">{{ post.category }}</span>
          </div>

          <!-- Post Title -->
          <router-link
            :to="{ name: 'PostDetail', params: { id: post.id } }"
            class="block mb-3"
          >
            <h3 class="text-lg font-semibold hover:text-cyan-400 transition-colors duration-300 line-clamp-2">
              {{ post.title }}
            </h3>
          </router-link>

          <!-- Post Excerpt -->
          <p class="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4">
            {{ post.excerpt }}
          </p>

          <!-- Read More -->
          <router-link
            :to="{ name: 'PostDetail', params: { id: post.id } }"
            class="mono text-xs text-cyan-400/70 hover:text-cyan-400 transition-colors inline-flex items-center gap-1"
          >
            <span>READ MORE</span>
            <span>→</span>
          </router-link>
        </article>
      </div>

      <!-- Mobile View All Button -->
      <div class="md:hidden mt-12 text-center">
        <router-link
          to="/posts"
          class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-[#0a0a0f] font-bold rounded-lg"
        >
          <span class="mono tracking-wider">VIEW ALL POSTS →</span>
        </router-link>
      </div>
    </section>

    <!-- Quote Section -->
    <section class="max-w-4xl mx-auto px-6 py-24">
      <div class="bg-[#12121a]/80 backdrop-blur-xl border border-cyan-400/15 rounded-2xl p-12 md:p-16 text-center relative overflow-hidden">
        <!-- Gradient Background -->
        <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5"></div>
        
        <!-- Quote -->
        <blockquote class="relative z-10 text-2xl md:text-3xl text-gray-300 leading-relaxed mb-8 italic font-light">
          "What does it mean to be human when the boundary between ghost and shell blurs?"
        </blockquote>
        <cite class="relative z-10 mono text-sm text-cyan-400/60 not-italic tracking-wider block">
          — GHOST IN THE SHELL
          <span class="block mt-2 text-xs text-gray-600">Section 9</span>
        </cite>
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

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

article {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
}

article:nth-child(1) { animation-delay: 0.1s; }
article:nth-child(2) { animation-delay: 0.2s; }
article:nth-child(3) { animation-delay: 0.3s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
