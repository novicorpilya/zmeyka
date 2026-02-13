<template>
  <section id="sandbox" class="py-24 px-6 bg-slate-900 relative overflow-hidden">
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
          Попробуй бесплатно
        </span>
        <h2 class="text-4xl md:text-6xl font-black text-white tracking-tighter">
          Твой первый <span class="text-emerald-500">код</span>
        </h2>
        <p class="text-slate-400 text-lg font-bold max-w-2xl mx-auto">
          Пройди мини-квест: разбуди ИИ-змею, накорми её и проведи эволюцию.
          <br class="hidden md:block" />
          Это займет всего 30 секунд.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch relative">
        <!-- Editor Side -->
        <div
          class="bg-slate-800 rounded-[2rem] border-4 border-slate-700 shadow-2xl overflow-hidden flex flex-col h-[500px] relative z-20"
        >
          <!-- Editor Header -->
          <div
            class="px-6 py-4 bg-slate-700/50 border-b border-slate-600 flex items-center justify-between"
          >
            <div class="flex gap-2">
              <div class="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div class="w-3 h-3 rounded-full bg-emerald-500/50"></div>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                >mission_control.py</span
              >
            </div>
          </div>

          <!-- Code Area -->
          <div class="flex-grow relative font-mono text-sm md:text-base p-6 overflow-hidden">
            <div
              class="absolute left-0 top-0 w-12 h-full bg-slate-900/30 border-r border-slate-700/50 flex flex-col items-center pt-6 text-slate-600 select-none z-0"
            >
              <span v-for="i in 12" :key="i" class="leading-relaxed">{{ i }}</span>
            </div>
            <div class="pl-10 space-y-2 relative z-10">
              <div class="text-slate-500">
                # Шаг {{ currentStep + 1 }}/3: {{ steps[currentStep].title }}
              </div>
              <div class="text-slate-500"># Задача: {{ steps[currentStep].instruction }}</div>
              <div class="text-slate-500 text-purple-400">
                import <span class="text-white">snake_ai</span>
              </div>
              <div class="relative mt-4 group">
                <input
                  ref="inputRef"
                  v-model="userCode"
                  @keydown.enter.prevent="runStep"
                  type="text"
                  class="w-full bg-slate-900/50 text-emerald-400 p-3 rounded-lg border border-emerald-500/20 focus:border-emerald-500/50 outline-none font-mono placeholder:text-slate-700/50 transition-colors"
                  :placeholder="steps[currentStep].placeholder"
                  spellcheck="false"
                  autocomplete="off"
                  :disabled="isProcessing || isCompleted"
                />
              </div>
              <div
                v-if="errorMsg"
                class="text-red-400 text-xs mt-2 flex items-center gap-2 animate-shake"
              >
                <span>⚠️</span> {{ errorMsg }}
              </div>
            </div>
          </div>

          <!-- Console Output -->
          <div
            ref="logsContainer"
            class="p-4 bg-black/40 border-t border-slate-700 h-32 overflow-y-auto font-mono text-xs"
          >
            <div
              v-for="(log, i) in logs"
              :key="i"
              :class="log.type === 'error' ? 'text-red-400' : 'text-slate-400'"
              class="mb-1"
            >
              <span class="opacity-30 mr-2">[{{ log.time }}]</span>
              <span :class="{ 'text-emerald-400': log.type === 'success' }">{{ log.msg }}</span>
            </div>
            <div v-if="isProcessing" class="text-emerald-500 animate-pulse mt-2">
              _ processing request...
            </div>
          </div>

          <!-- Action Bar -->
          <div class="p-4 bg-slate-900/50 border-t border-slate-700">
            <button
              @click="runStep"
              :disabled="isProcessing || isCompleted"
              class="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-black py-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group shimmer-button"
            >
              <span v-if="isProcessing">ВЫПОЛНЕНИЕ...</span>
              <span v-else>ЗАПУСТИТЬ КОД (ENTER)</span>
              <span class="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>

        <!-- Visual Side -->
        <div
          class="bg-slate-950 rounded-[2rem] border-4 border-slate-800 shadow-2xl relative overflow-hidden flex items-center justify-center h-[500px]"
        >
          <!-- Matrix Grid -->
          <div
            class="absolute inset-0 opacity-20"
            style="
              background-image:
                linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px);
              background-size: 40px 40px;
            "
          ></div>

          <!-- Completion Overlay -->
          <div
            v-if="isCompleted"
            class="absolute inset-0 bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 z-50 animate-fade-in"
          >
            <div
              class="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-5xl mb-6 shadow-[0_0_50px_rgba(16,185,129,0.5)] animate-bounce"
            >
              🚀
            </div>
            <h3 class="text-3xl md:text-4xl font-black text-white mb-2">Mission Complete!</h3>
            <p class="text-slate-300 text-lg mb-8 max-w-sm">
              Вы написали свой первый код и прокачали ИИ-ассистента.
              <br />
              <span class="text-emerald-400 font-bold">Не потеряйте прогресс!</span>
            </p>

            <NuxtLink to="/register" class="w-full max-w-xs">
              <button
                class="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-black py-4 px-8 rounded-xl transition-all shadow-xl shadow-emerald-500/20 transform hover:-translate-y-1 block"
              >
                СОХРАНИТЬ УРОВЕНЬ
              </button>
            </NuxtLink>
            <p class="text-slate-500 text-xs mt-4">*Регистрация бесплатна и займет 1 минуту</p>
          </div>

          <!-- Scene Container -->
          <div
            v-else
            class="relative w-full h-full perspective-1000 flex items-center justify-center"
          >
            <!-- Particle Effects Layer -->
            <div v-show="isEvolving" class="absolute inset-0 pointer-events-none">
              <div
                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] animate-pulse opacity-50"
              ></div>
            </div>

            <!-- Snake Sprite -->
            <div class="relative z-10 transition-all duration-700" :class="snakeClasses">
              <!-- Speech Bubble -->
              <div
                v-if="currentBubble"
                class="absolute -top-20 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-4 py-2 rounded-xl font-bold shadow-lg animate-pop-in whitespace-nowrap z-20 pointer-events-none"
              >
                {{ currentBubble }}
                <div
                  class="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45"
                ></div>
              </div>

              <!-- Zzz Animation (Step 0) -->
              <div
                v-if="currentStep === 0"
                class="absolute -top-12 -right-8 text-4xl font-black text-slate-600 opacity-50 animate-float"
              >
                Zzz...
              </div>

              <!-- Main Image -->
              <img
                :src="currentSnakeImage"
                alt="Snake"
                class="w-48 h-48 md:w-64 md:h-64 object-contain transition-all duration-500"
                :class="{
                  'grayscale-[0.8] opacity-60': currentStep === 0,
                  'filter brightness-125 drop-shadow-[0_0_30px_rgba(16,185,129,0.6)]':
                    currentStep === 2,
                }"
              />
            </div>

            <!-- Apple Target (Step 1) -->
            <div
              v-if="currentStep === 1 && showApple"
              class="absolute top-1/2 right-[10%] -translate-y-1/2 text-4xl animate-bounce transition-all duration-500"
              :class="{ 'opacity-0 scale-150': appleEaten }"
            >
              🍎
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { ref, computed, nextTick, onMounted } from 'vue'

// Assets
import beginnerSnakeImage from '@shared/assets/beginnerSnake.png'
import programmSnakeImage from '@shared/assets/programmSnake.png'

const inputRef = ref<HTMLInputElement | null>(null)
const logsContainer = ref<HTMLDivElement | null>(null)
const userCode = ref('')
const currentStep = ref(0)
const isProcessing = ref(false)
const errorMsg = ref('')

const isCompleted = ref(false)
const isEvolving = ref(false)
const showApple = ref(false)
const appleEaten = ref(false)

const logs = ref<{ time: string; msg: string; type: 'info' | 'success' | 'error' }[]>([
  {
    time: getCurrentTime(),
    msg: 'System initialized. Waiting for connection...',
    type: 'info',
  },
])

const steps = [
  {
    title: 'Пробуждение',
    instruction: 'Змейка спит. Активируйте нейросеть командой wake_up()',
    placeholder: 'snake.wake_up()',
    expected: ['snake.wake_up()', 'wake_up()'],
  },
  {
    title: 'Охота',
    instruction: 'Цель обнаружена. Запустите алгоритм охоты.',
    placeholder: 'snake.hunt()',
    expected: ['snake.hunt()', 'hunt()'],
  },
  {
    title: 'Эволюция',
    instruction: 'Накоплено достаточно данных. Запустите эволюцию.',
    placeholder: 'snake.evolve()',
    expected: ['snake.evolve()', 'evolve()'],
  },
]

// Computed Props
const currentBubble = computed(() => {
  if (currentStep.value === 1 && !appleEaten.value) return 'Я голоден! 🍎'
  if (currentStep.value === 2 && !isEvolving.value) return 'Система готова! ⚡'
  return null
})

const currentSnakeImage = computed(() => {
  return currentStep.value >= 2 && isEvolving.value ? programmSnakeImage : beginnerSnakeImage
})

const snakeClasses = computed(() => {
  return {
    'animate-pulse-slow': currentStep.value === 1,
    'scale-110': isEvolving.value,
  }
})

// Methods
function getCurrentTime() {
  return new Date().toLocaleTimeString('ru-RU', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const addLog = (msg: string, type: 'info' | 'success' | 'error' = 'info') => {
  logs.value.push({ time: getCurrentTime(), msg, type })
  nextTick(() => {
    if (logsContainer.value) {
      logsContainer.value.scrollTop = logsContainer.value.scrollHeight
    }
  })
}

const runStep = () => {
  if (isProcessing.value || isCompleted.value) return
  errorMsg.value = ''

  const input = userCode.value.trim().toLowerCase().replace(/\s/g, '')
  const expectedVariants = steps[currentStep.value].expected.map((s) =>
    s.toLowerCase().replace(/\s/g, ''),
  )

  isProcessing.value = true
  addLog(`> ${userCode.value}`)

  setTimeout(() => {
    if (expectedVariants.includes(input)) {
      handleSuccess()
    } else {
      handleError()
    }
  }, 600)
}

const handleSuccess = () => {
  isProcessing.value = false
  userCode.value = ''
  addLog('Command executed successfully.', 'success')

  if (currentStep.value === 0) {
    // Wake Up
    gsap.fromTo(
      '.snake-container img',
      { scale: 0.8 },
      { scale: 1.1, duration: 0.4, yoyo: true, repeat: 1 },
    )
    currentStep.value++
    showApple.value = true
  } else if (currentStep.value === 1) {
    // Hunt
    appleEaten.value = true
    addLog('Target acquired. Consuming data...', 'success')
    setTimeout(() => {
      currentStep.value++
    }, 1000)
  } else if (currentStep.value === 2) {
    // Evolve
    isEvolving.value = true
    addLog('INITIATING EVOLUTION SEQUENCE...', 'success')

    setTimeout(() => {
      isCompleted.value = true
      addLog('SYSTEM: EVOLUTION COMPLETE.', 'success')
    }, 2000)
  }

  // Focus next
  if (!isCompleted.value) {
    nextTick(() => inputRef.value?.focus())
  }
}

const handleError = () => {
  isProcessing.value = false
  errorMsg.value = 'Ошибка синтаксиса. Попробуйте снова.'
  addLog('Error: SyntaxError or Unknown Command', 'error')

  if (inputRef.value) {
    gsap.fromTo(
      inputRef.value,
      { x: -5 },
      { x: 5, duration: 0.1, repeat: 3, yoyo: true, clearProps: 'x' },
    )
  }
}

onMounted(() => {
  // Focus optional on start? Maybe too aggressive
})
</script>

<style scoped>
.animate-float {
  animation: float 3s ease-in-out infinite;
}
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-pop-in {
  animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
@keyframes popIn {
  from {
    opacity: 0;
    transform: translate(-50%, 20px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0) scale(1);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-shake {
  animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

.perspective-1000 {
  perspective: 1000px;
}
</style>
