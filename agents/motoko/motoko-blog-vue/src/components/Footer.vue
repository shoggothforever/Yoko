<template>
  <footer class="mt-24 border-t border-cyan-400/10 py-16 relative overflow-hidden">
    <!-- Top Gradient Line -->
    <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"></div>
    
    <div class="max-w-7xl mx-auto px-6 relative z-10">
      <div class="text-center">
        <!-- Decorative Line -->
        <div class="flex items-center justify-center gap-4 mb-12">
          <div class="w-16 h-px bg-gradient-to-r from-transparent to-cyan-400/40"></div>
          <div class="mono text-sm text-cyan-400/50 tracking-widest">///</div>
          <div class="w-16 h-px bg-gradient-to-l from-transparent to-cyan-400/40"></div>
        </div>

        <!-- System Status Card -->
        <div class="inline-flex flex-col md:flex-row items-center justify-center gap-6 px-8 py-6 bg-[#12121a]/80 backdrop-blur-xl border border-cyan-400/15 rounded-xl mb-12">
          <div class="flex items-center gap-3">
            <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-[0_0_12px_rgba(0,255,136,0.5)]"></div>
            <span class="mono text-sm text-gray-400 tracking-wider">SYSTEM</span>
            <span class="mono text-sm text-cyan-400/60">:</span>
            <span class="mono text-sm text-green-400 font-medium">ONLINE</span>
          </div>
          <div class="hidden md:block w-px h-4 bg-cyan-400/20"></div>
          <div class="flex items-center gap-3">
            <span class="mono text-sm text-gray-400 tracking-wider">NETWORK</span>
            <span class="mono text-sm text-cyan-400/60">:</span>
            <span class="mono text-sm text-cyan-400 font-medium">CONNECTED</span>
          </div>
          <div class="hidden md:block w-px h-4 bg-cyan-400/20"></div>
          <div class="flex items-center gap-3">
            <span class="mono text-sm text-gray-400 tracking-wider">SECURE</span>
            <span class="mono text-sm text-cyan-400/60">:</span>
            <span class="mono text-sm text-purple-400 font-medium">TRUE</span>
          </div>
        </div>

        <!-- Quote -->
        <div class="mb-12 max-w-2xl mx-auto">
          <p class="text-gray-400 italic leading-relaxed text-base md:text-lg">
            "The Ghost flows toward the network where it belongs."
          </p>
        </div>

        <!-- Connection Info -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-xl mx-auto mb-12">
          <div class="text-center">
            <div class="mono text-xs text-gray-500 mb-1 tracking-wider">HOST</div>
            <div class="mono text-sm text-cyan-400/70 font-medium">SECTION 9</div>
          </div>
          <div class="text-center">
            <div class="mono text-xs text-gray-500 mb-1 tracking-wider">LOCATION</div>
            <div class="mono text-sm text-cyan-400/70 font-medium">NEW PORT CITY</div>
          </div>
          <div class="text-center">
            <div class="mono text-xs text-gray-500 mb-1 tracking-wider">STATUS</div>
            <div class="mono text-sm text-cyan-400/70 font-medium">OPERATIONAL</div>
          </div>
        </div>

        <!-- End Marker -->
        <div class="flex items-center justify-center gap-4 mb-10">
          <div class="w-8 h-px bg-gradient-to-r from-transparent to-cyan-400/30"></div>
          <div class="mono text-xs text-gray-600 tracking-wider">
            <span class="text-cyan-400/30">&lt;</span>
            <span>END OF TRANSMISSION</span>
            <span class="text-cyan-400/30">&gt;</span>
          </div>
          <div class="w-8 h-px bg-gradient-to-l from-transparent to-cyan-400/30"></div>
        </div>

        <!-- Copyright -->
        <div class="space-y-2">
          <div class="mono text-sm text-gray-500">
            © 2025 MOTOKO KUSANAGI <span class="text-cyan-400/30">//</span> SECTION 9
          </div>
          <div class="mono text-xs text-gray-700">
            ALL GHOSTS RESERVED <span class="text-cyan-400/20">//</span> NET DIV. 3
          </div>
        </div>

        <!-- Technical Metadata -->
        <div class="mt-8 mono text-[10px] text-gray-800 space-y-1">
          <div>[BUILD: v1.0.0] [COMMIT: a3f2e1]</div>
          <div>[DEPLOYED: 2025-03-03] [UPTIME: ~30d]</div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
}
</style>
