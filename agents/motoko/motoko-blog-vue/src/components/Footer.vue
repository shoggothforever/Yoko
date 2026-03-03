<template>
  <footer class="mt-20 border-t border-[rgba(0,245,255,0.1)] py-16 bg-black/50">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center">
        <!-- 装饰线 -->
        <div class="flex items-center justify-center space-x-4 mb-6">
          <div class="w-16 h-px bg-gradient-to-r from-transparent to-cyan-400/50"></div>
          <div class="w-2 h-2 bg-cyan-400/30"></div>
          <div class="w-16 h-px bg-gradient-to-l from-transparent to-cyan-400/50"></div>
        </div>

        <!-- 主要信息 -->
        <div class="mono text-sm space-y-2 mb-8">
          <p class="text-gray-600">&lt;SYSTEM STATUS: ONLINE&gt;</p>
          <p class="text-gray-400 italic">The Ghost flows toward the network where it belongs.</p>
        </div>

        <!-- 状态指示器 -->
        <div class="flex items-center justify-center space-x-6 mono text-xs mb-8">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span class="text-gray-500">HOSTED</span>
          </div>
          <div class="text-cyan-400/30">|</div>
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span class="text-gray-500">CONNECTED</span>
          </div>
          <div class="text-cyan-400/30">|</div>
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span class="text-gray-500">MONITORED</span>
          </div>
        </div>

        <!-- 底部版权 -->
        <div class="mono text-xs text-gray-600">
          <p>© 2025 MOTOKO KUSANAGI // SECTION 9</p>
          <p class="text-cyan-400/40 mt-2">ALL GHOSTS RESERVED</p>
        </div>
      </div>
    </div>
  </footer>
</template>
