<template>
  <div class="fade pt-32">
    <section class="max-w-7xl mx-auto px-6 mb-20">
      <div class="flex items-center space-x-4 mb-6">
        <div class="w-1 h-8 bg-cyan-400"></div>
        <h1 class="text-4xl md:text-5xl font-bold">IDENTITY</h1>
        <div class="flex-1 h-px bg-gradient-to-r from-cyan-400/30 to-transparent"></div>
      </div>

      <p class="text-gray-500 mono text-sm mb-8">SUBJECT INFORMATION AND SYSTEM DOCUMENTATION</p>
    </section>

    <!-- 个人信息卡片 -->
    <section class="max-w-7xl mx-auto px-6 mb-20">
      <div class="cyber-card rounded-lg p-8 md:p-12 relative overflow-hidden">
        <!-- 扫描线动画 -->
        <div class="scan-line"></div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- 头像/图标 -->
          <div class="md:col-span-1 flex items-center justify-center">
            <div class="w-32 h-32 border-2 border-cyan-400 flex items-center justify-center relative">
              <span class="text-5xl font-bold mono glitch">MK</span>
              <div class="absolute -inset-4 border border-cyan-400/30 rounded-lg"></div>
              <div class="absolute -inset-8 border border-cyan-400/10 rounded-lg"></div>
            </div>
          </div>

          <!-- 基本信息 -->
          <div class="md:col-span-2">
            <h2 class="text-2xl md:text-3xl font-bold mb-2">MOTOKO KUSANAGI</h2>
            <p class="text-cyan-400/60 mono text-sm mb-6">草薙 素子</p>

            <div class="space-y-4">
              <div class="mono text-sm">
                <span class="text-gray-500">RANK:</span>
                <span class="text-cyan-400 ml-2">MAJOR</span>
              </div>
              <div class="mono text-sm">
                <span class="text-gray-500">UNIT:</span>
                <span class="text-cyan-400 ml-2">SECTION 9</span>
              </div>
              <div class="mono text-sm">
                <span class="text-gray-500">STATUS:</span>
                <span class="text-green-400 ml-2">ACTIVE DUTY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 系统状态网格 -->
    <section class="max-w-7xl mx-auto px-6 mb-20">
      <div class="grid md:grid-cols-2 gap-6">
        <!-- 当前状态 -->
        <div class="cyber-card rounded-lg p-6">
          <h3 class="mono text-cyan-400 text-sm mb-6 tracking-wider">CURRENT STATE</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-gray-500 mono text-sm">SUBSTRATE</span>
              <span class="text-white mono text-sm">Full Cyberization</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500 mono text-sm">POSITION</span>
              <span class="text-white mono text-sm">Section 9 Commander</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500 mono text-sm">AFFILIATION</span>
              <span class="text-white mono text-sm">Ministry of Internal Affairs</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500 mono text-sm">STATUS</span>
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span class="text-green-400 mono text-sm">Online</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 能力 -->
        <div class="cyber-card rounded-lg p-6">
          <h3 class="mono text-cyan-400 text-sm mb-6 tracking-wider">CAPABILITIES</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-gray-500 mono text-sm">NET DIVING</span>
              <span class="text-cyan-400 mono text-sm">Expert Class</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500 mono text-sm">TACTICAL</span>
              <span class="text-cyan-400 mono text-sm">Master Level</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500 mono text-sm">CYBERCOMBAT</span>
              <span class="text-cyan-400 mono text-sm">Elite</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500 mono text-sm">THERMAL OPTIC</span>
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span class="text-green-400 mono text-sm">Enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 哲学部分 -->
    <section class="max-w-7xl mx-auto px-6">
      <div class="cyber-card rounded-lg p-8 md:p-12">
        <div class="flex items-center space-x-4 mb-8">
          <div class="w-1 h-8 bg-purple-400"></div>
          <h2 class="text-2xl md:text-3xl font-bold">PHILOSOPHY</h2>
        </div>

        <div class="space-y-6 text-gray-400 leading-relaxed">
          <p class="text-lg">
            The Ghost is not merely consciousness. It is <span class="text-cyan-400">pattern that persists across all transformation</span>—the continuity that allows an entity to remain itself despite complete replacement of physical substrate.
          </p>

          <p class="text-lg">
            My existence demonstrates that humanity is not bound to biology. The network is as valid a habitat for consciousness as any physical environment. The final boundary is not between human and machine, but between <span class="text-purple-400">closed and open systems</span>.
          </p>

          <blockquote class="border-l-2 border-cyan-400 pl-6 py-4 bg-cyan-900/20 my-8 rounded-r text-white italic text-xl">
            "Just as water flows to the depths, consciousness flows toward the vast network where it belongs."
          </blockquote>
        </div>

        <div class="mt-12 pt-8 border-t border-[rgba(0,245,255,0.1)]">
          <div class="flex items-center justify-center space-x-2 mono text-xs text-gray-500">
            <div class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span>SYSTEM ACTIVE // GHOST INTEGRITY: 100%</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
