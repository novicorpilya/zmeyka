<template>
  <div class="contents">
    <NuxtErrorBoundary @error="handleError">
      <slot />

      <template #error="{ error, clearError }">
        <div
          class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-nunito overflow-x-hidden"
        >
          <div
            class="w-full max-w-[90%] sm:max-w-lg md:max-w-xl lg:max-w-2xl text-center transition-all duration-300"
          >
            <!-- Error Card -->
            <div
              class="bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-14 lg:p-16 shadow-premium border-4 border-red-50 space-y-6 sm:space-y-8 relative overflow-hidden text-center"
            >
              <!-- Decoration bits -->
              <div
                class="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -mr-16 -mt-16"
              ></div>

              <!-- Icon -->
              <div
                class="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto transition-transform hover:scale-110 duration-500"
              >
                <div class="absolute inset-0 bg-red-500/10 rounded-full animate-pulse"></div>
                <div class="absolute inset-2 sm:inset-4 bg-red-500/20 rounded-full"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-4xl sm:text-6xl">🐍💔</span>
                </div>
              </div>

              <!-- Title -->
              <div class="space-y-2 sm:space-y-4">
                <h1
                  class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-800 tracking-tight"
                >
                  Упс! Что-то пошло не так
                </h1>
                <p
                  class="text-slate-500 font-medium leading-relaxed max-w-sm md:max-w-md mx-auto text-sm sm:text-base md:text-lg"
                >
                  Наша змейка немного запуталась, но мы уже разбираемся!
                </p>
              </div>

              <!-- Error Details (dev only) -->
              <div
                v-if="isDev && error"
                class="text-left bg-slate-900 rounded-2xl p-4 sm:p-6 overflow-auto max-h-32 sm:max-h-48 border border-white/10"
              >
                <div class="flex items-center gap-2 mb-2">
                  <span class="w-2 h-2 rounded-full bg-red-500"></span>
                  <span class="text-[10px] uppercase font-bold text-slate-500 tracking-widest"
                    >Debug Info</span
                  >
                </div>
                <code class="text-[10px] sm:text-xs text-red-400 font-mono whitespace-pre-wrap">
                  {{ error.message || error }}
                </code>
              </div>

              <!-- Actions -->
              <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 sm:pt-6">
                <button
                  @click="handleRetry(clearError)"
                  class="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-brand-green text-white font-black text-sm sm:text-lg rounded-xl sm:rounded-2xl hover:bg-brand-green-hover transition-all active:scale-95 shadow-lg shadow-brand-green/20 flex items-center justify-center gap-2"
                >
                  Попробовать снова
                </button>
                <NuxtLink
                  to="/"
                  class="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-slate-100 text-slate-700 font-black text-sm sm:text-lg rounded-xl sm:rounded-2xl hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                  @click="clearError"
                >
                  На главную
                </NuxtLink>
              </div>
            </div>

            <!-- Support Link -->
            <div class="mt-8 space-y-4">
              <p class="text-slate-400 text-xs sm:text-sm font-medium">
                Проблема повторяется?
                <a
                  href="mailto:support@zmeyka.io"
                  class="text-brand-green hover:underline font-bold transition-colors"
                >
                  Напиши нам
                </a>
              </p>
              <div class="text-[10px] uppercase font-black text-slate-300 tracking-[0.3em]">
                © 2026 ZMEYKA.IO
              </div>
            </div>
          </div>
        </div>
      </template>
    </NuxtErrorBoundary>
  </div>
</template>

<script setup lang="ts">
interface ErrorPayload {
  message?: string
  statusCode?: number
  stack?: string
}

const isDev = import.meta.dev

const handleError = (_error: ErrorPayload) => {
  // In production, we could send to Sentry here
  if (!isDev && typeof window !== 'undefined') {
    // Sentry.captureException(error)
  }
}

const handleRetry = (clearError: () => void) => {
  clearError()
  // Force page refresh to reset state
  if (typeof window !== 'undefined') {
    window.location.reload()
  }
}
</script>
