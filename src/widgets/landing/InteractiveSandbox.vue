<template>
  <section class="py-24 px-6 bg-slate-900 relative overflow-hidden">
    <!-- Background Accents -->
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
      <div
        class="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500 rounded-full blur-[120px]"
      ></div>
      <div
        class="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500 rounded-full blur-[120px]"
      ></div>
    </div>

    <div class="max-w-6xl mx-auto relative z-10">
      <div class="text-center mb-16 space-y-4">
        <span
          class="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]"
        >
          Интерактивный опыт
        </span>
        <h2 class="text-4xl md:text-6xl font-black text-white tracking-tighter">
          Попробуй <span class="text-emerald-500">прямо сейчас</span>
        </h2>
        <p class="text-slate-400 text-lg font-bold">
          Змейка проголодалась. Помоги ей подкрепиться кодом!
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <!-- Editor Side -->
        <div
          class="bg-slate-800 rounded-[2rem] border-4 border-slate-700 shadow-2xl overflow-hidden flex flex-col h-[450px]"
        >
          <div
            class="px-6 py-4 bg-slate-700/50 border-b border-slate-600 flex items-center justify-between"
          >
            <div class="flex gap-2">
              <div class="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div class="w-3 h-3 rounded-full bg-emerald-500/50"></div>
            </div>
            <div class="flex items-center gap-4">
              <button
                @click="copySnippet"
                class="text-[10px] font-black text-slate-500 hover:text-emerald-400 uppercase tracking-widest transition-colors flex items-center gap-1.5"
                title="Копировать код"
              >
                <span>Copy</span>
                <span class="opacity-50">📋</span>
              </button>
              <button
                @click="resetSandbox"
                class="text-[10px] font-black text-slate-500 hover:text-red-400 uppercase tracking-widest transition-colors flex items-center gap-1.5"
                title="Сбросить код"
              >
                <span>Reset</span>
                <span class="opacity-50">🔄</span>
              </button>
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                >sandbox.py</span
              >
            </div>
          </div>

          <div class="flex-grow relative font-mono text-sm md:text-base p-6">
            <div
              class="absolute left-0 top-0 w-12 h-full bg-slate-900/30 border-r border-slate-700/50 flex flex-col items-center pt-6 text-slate-600 select-none"
            >
              <span v-for="i in 10" :key="i" class="leading-relaxed">{{ i }}</span>
            </div>
            <div class="pl-10 space-y-1">
              <p class="text-slate-500"># Змейка ждет твоей команды</p>
              <p class="text-slate-500">
                # Используй: <span class="text-emerald-400">snake.eat("apple")</span>
              </p>
              <div class="relative mt-4">
                <textarea
                  ref="textareaRef"
                  v-model="code"
                  @keydown.enter.prevent="handleEnter"
                  placeholder="Допиши код здесь..."
                  class="w-full bg-transparent border-none outline-none text-emerald-400 resize-none leading-relaxed placeholder:text-slate-700 h-40"
                  spellcheck="false"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="p-4 bg-slate-900/50 border-t border-slate-700">
            <button
              @click="runCode"
              :disabled="isRunning"
              class="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-900 font-black py-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group shimmer-button"
            >
              <span v-if="isRunning" class="animate-spin">⏳</span>
              <span v-else>ЗАПУСТИТЬ КОД</span>
              <span class="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>

        <!-- Playground Side -->
        <div
          class="bg-slate-950 rounded-[2rem] border-4 border-slate-800 shadow-2xl relative overflow-hidden flex items-center justify-center h-[450px]"
        >
          <!-- Grid Background -->
          <div
            class="absolute inset-0 opacity-10"
            style="
              background-image: radial-gradient(#334155 1px, transparent 1px);
              background-size: 20px 20px;
            "
          ></div>

          <!-- The Game Elements -->
          <div class="relative w-full h-full">
            <!-- Apple -->
            <div
              id="apple-target"
              class="absolute top-1/2 left-3/4 -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-red-500 rounded-full border-4 border-red-400 shadow-[0_0_30px_rgba(239,68,68,0.4)] flex items-center justify-center text-2xl"
              :class="{ 'scale-0 opacity-0 transition-all duration-500': hasEaten }"
            >
              🍎
            </div>

            <!-- Snake Mascot -->
            <div
              id="snake-playground"
              class="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2"
            >
              <img
                :src="beginnerSnakeImage"
                alt="Snake"
                class="w-32 h-32 object-contain filter drop-shadow-[0_10px_30px_rgba(16,185,129,0.3)]"
              />
            </div>

            <!-- Feedback Bubble -->
            <Transition name="bounce">
              <div
                v-if="feedback"
                class="absolute top-1/4 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-2xl shadow-premium border-2 border-emerald-500 flex items-center gap-3"
              >
                <span class="text-2xl">{{ feedback.icon }}</span>
                <p class="text-slate-800 font-black text-sm whitespace-nowrap">
                  {{ feedback.text }}
                </p>
              </div>
            </Transition>
          </div>

          <!-- Console Output Overlay -->
          <div
            v-if="output.length"
            class="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10 font-mono text-[10px] text-emerald-500 max-h-32 overflow-y-auto"
          >
            <p v-for="(line, i) in output" :key="i">>>> {{ line }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

import beginnerSnakeImage from '~/assets/beginnerSnake.png'

const code = ref('snake.eat(')
const isRunning = ref(false)
const hasEaten = ref(false)
const output = ref<string[]>([])
const feedback = ref<{ text: string; icon: string } | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

let ctx: gsap.Context

const handleEnter = () => {
  runCode()
}

const copySnippet = () => {
  navigator.clipboard.writeText(code.value)
  feedback.value = { text: 'Код скопирован!', icon: '📋' }
  setTimeout(() => (feedback.value = null), 2000)
}

const runCode = () => {
  if (isRunning.value) return
  isRunning.value = true
  output.value = ['>>> Инициализация змейки...', '>>> Проверка синтаксиса...']

  setTimeout(() => {
    const cleanCode = code.value.trim().toLowerCase()

    if (cleanCode.includes('snake.eat("apple")') || cleanCode.includes("snake.eat('apple')")) {
      output.value.push('Success: Аргумент "apple" принят.')
      output.value.push('>>> Змейка приступает к трапезе.')
      triggerWinAnimation()
    } else if (cleanCode === 'snake.reset()' || cleanCode === 'reset') {
      output.value.push('>>> Сброс состояния...')
      resetSandbox()
    } else {
      output.value.push('SyntaxError: Неизвестная команда или неверный аргумент.')
      output.value.push('Подсказка: попробуй snake.eat("apple")')
      triggerErrorAnimation()
    }
    isRunning.value = false
  }, 800)
}

const triggerWinAnimation = () => {
  if (!import.meta.client) return

  ctx.add(() => {
    const tl = gsap.timeline()

    tl.to('#snake-playground', {
      x: 200,
      duration: 1,
      ease: 'power2.inOut',
      onStart: () => {
        feedback.value = { text: 'М-м-м, вкусно!', icon: '🤩' }
      },
    })

    tl.to(
      '#apple-target',
      {
        scale: 1.5,
        opacity: 0,
        duration: 0.3,
      },
      '-=0.2',
    )

    tl.to('#snake-playground', {
      scale: 1.2,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
    })

    tl.to('#snake-playground', {
      x: 0,
      duration: 1,
      ease: 'power2.inOut',
      onComplete: () => {
        hasEaten.value = true
        setTimeout(() => {
          resetSandbox()
        }, 3000)
      },
    })
  })
}

const triggerErrorAnimation = () => {
  if (!import.meta.client) return

  feedback.value = { text: 'Чего-чего?', icon: '🤔' }
  ctx.add(() => {
    gsap.to('#snake-playground', {
      x: 10,
      duration: 0.1,
      repeat: 5,
      yoyo: true,
      onComplete: () => {
        setTimeout(() => {
          feedback.value = null
        }, 2000)
      },
    })
  })
}

const resetSandbox = () => {
  hasEaten.value = false
  feedback.value = null
  output.value = []
  code.value = 'snake.eat('
  nextTick(() => {
    textareaRef.value?.focus()
  })
}

onMounted(() => {
  if (import.meta.client) {
    ctx = gsap.context(() => {})
  }
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<style scoped>
.shadow-premium {
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: translate(-50%, 0) scale(0);
  }
  50% {
    transform: translate(-50%, -20px) scale(1.1);
  }
  100% {
    transform: translate(-50%, 0) scale(1);
  }
}

textarea::selection {
  background: rgba(16, 185, 129, 0.3);
}
</style>
