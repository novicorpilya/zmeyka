<template>
  <div class="relative">
    <div
      v-if="!isLoggingOut"
      class="min-h-screen bg-slate-50 flex font-nunito overflow-hidden text-slate-900"
    >
      <!-- Desktop Sidebar Navigation (Hidden on Mobile) -->
      <aside
        class="hidden md:flex w-24 lg:w-72 bg-white border-r border-slate-200/60 flex-col relative z-50 transition-all duration-500 shrink-0"
      >
        <!-- Logo -->
        <div class="p-4 lg:p-8 flex items-center justify-center lg:justify-start gap-4">
          <NuxtLink to="/dashboard" class="flex items-center gap-4 group">
            <div
              class="w-24 h-24 bg-brand-green rounded-3xl flex items-center justify-center shadow-cartoon transition-transform group-hover:scale-110"
            >
              <img :src="logoImage" alt="Logo" class="w-18 h-18 object-contain" />
            </div>
            <span
              class="hidden lg:block text-3xl font-black text-slate-900 uppercase tracking-tighter"
              >Змейка</span
            >
          </NuxtLink>
        </div>

        <!-- Main Nav -->
        <nav class="flex-grow px-4 lg:px-6 space-y-2 py-6 overflow-y-auto custom-scrollbar">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center justify-center lg:justify-start gap-4 p-4 rounded-2xl font-black transition-all group relative overflow-hidden"
            :class="[
              isActive(item.path)
                ? 'bg-brand-green text-white shadow-cartoon-sm translate-y-[-2px]'
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600',
            ]"
          >
            <span class="text-2xl transition-transform group-hover:scale-120">{{ item.icon }}</span>
            <span class="hidden lg:block text-sm uppercase tracking-widest">{{ item.label }}</span>
            <div
              v-if="isActive(item.path)"
              class="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-r-full shadow-[0_0_15px_#fff]"
            ></div>
          </NuxtLink>
        </nav>

        <!-- Bottom Actions -->
        <div class="p-4 lg:p-6 mt-auto border-t-4 border-slate-50 space-y-4">
          <button
            @click="handleLogout"
            class="w-full flex items-center justify-center lg:justify-start gap-4 p-4 rounded-2xl font-black text-red-500 hover:bg-red-50 hover:text-red-600 transition-all group border-2 border-transparent hover:border-red-100 active:scale-95"
          >
            <span class="text-2xl group-hover:rotate-12 transition-transform">🚪</span>
            <span class="hidden lg:block text-sm uppercase tracking-widest">Выйти</span>
          </button>

          <!-- Profile Quick Access -->
          <NuxtLink
            to="/settings"
            class="p-4 rounded-3xl flex items-center gap-3 overflow-hidden cursor-pointer transition-all group border-2 border-transparent hover:bg-slate-50"
            :class="[isActive('/settings') ? 'bg-slate-50 border-slate-100' : '']"
          >
            <div
              class="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform shadow-sm overflow-hidden"
            >
              <template
                v-if="userStore.user?.avatar && userStore.user.avatar.startsWith('data:image')"
              >
                <img :src="userStore.user.avatar" class="w-full h-full object-cover" />
              </template>
              <template v-else>
                {{ userStore.user?.avatar || '🐍' }}
              </template>
            </div>
            <div v-if="userStore.user" class="hidden lg:block min-w-0">
              <p class="text-sm font-black text-slate-800 truncate">
                {{ userStore.user.name }}
              </p>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {{
                  ['TEACHER', 'ADMIN'].includes(userStore.user.role as string)
                    ? 'Мастер ✨'
                    : 'Ученик 🐍'
                }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </aside>

      <!-- Mobile Bottom Navigation (Hidden on Desktop) -->
      <nav
        class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-2 py-3 z-[100] flex justify-around items-center shadow-[0_-10px_20px_rgba(0,0,0,0.02)]"
      >
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex flex-col items-center gap-1 p-2 rounded-xl transition-all relative min-w-[64px]"
          :class="[isActive(item.path) ? 'text-brand-green translate-y-[-4px]' : 'text-slate-400']"
        >
          <span class="text-2xl">{{ item.icon }}</span>
          <span class="text-[10px] font-black uppercase tracking-tighter">{{ item.label }}</span>
          <div
            v-if="isActive(item.path)"
            class="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-brand-green rounded-full"
          ></div>
        </NuxtLink>
        <NuxtLink
          to="/settings"
          class="flex flex-col items-center gap-1 p-2 rounded-xl transition-all min-w-[64px]"
          :class="[
            isActive('/settings') ? 'text-brand-green translate-y-[-4px]' : 'text-slate-400',
          ]"
        >
          <div
            class="w-6 h-6 rounded-lg bg-brand-blue/10 flex items-center justify-center text-xs overflow-hidden"
          >
            <template
              v-if="userStore.user?.avatar && userStore.user.avatar.startsWith('data:image')"
            >
              <img :src="userStore.user.avatar" class="w-full h-full object-cover" />
            </template>
            <template v-else>
              {{ userStore.user?.avatar || '🐍' }}
            </template>
          </div>
          <span class="text-[10px] font-black uppercase tracking-tighter">Профиль</span>
          <div
            v-if="isActive('/settings')"
            class="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-brand-green rounded-full"
          ></div>
        </NuxtLink>
      </nav>

      <!-- Main Content Area -->
      <main
        class="flex-grow flex flex-col h-screen overflow-hidden overflow-y-auto custom-scrollbar"
      >
        <!-- Header (Compact on Mobile) -->
        <header
          class="sticky top-0 h-20 md:h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 lg:px-12 flex items-center justify-between shrink-0 relative z-40"
        >
          <div class="flex items-center gap-4">
            <div
              class="md:hidden w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center shadow-cartoon-sm shrink-0"
            >
              <img :src="logoImage" alt="Logo" class="w-6 h-6 object-contain" />
            </div>
            <h2
              class="text-xl md:text-2xl font-black text-slate-800 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {{ currentPageTitle }}
            </h2>
          </div>

          <div class="flex items-center gap-3 md:gap-6">
            <div class="hidden lg:flex relative" ref="searchContainer">
              <input
                type="text"
                v-model="searchQuery"
                @input="handleSearch"
                @focus="handleSearch"
                placeholder="Поиск..."
                class="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-2.5 pl-10 font-bold text-sm text-slate-700 outline-none focus:border-brand-green/30 transition-all w-48 xl:w-64"
              />
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"
                >🔍</span
              >

              <!-- Search Results Dropdown -->
              <Transition name="fade">
                <div
                  v-if="
                    showResults && (searchResults.courses.length || searchResults.lessons.length)
                  "
                  class="absolute top-full mt-2 left-0 w-96 bg-white rounded-3xl shadow-premium border-2 border-slate-100 overflow-hidden z-[60]"
                >
                  <!-- Courses -->
                  <div v-if="searchResults.courses.length" class="p-3">
                    <p
                      class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2"
                    >
                      Курсы
                    </p>
                    <div
                      v-for="course in searchResults.courses"
                      :key="course.id"
                      @click="handleResultClick(`/courses/${course.id}`)"
                      class="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-2xl cursor-pointer transition-colors group"
                    >
                      <div
                        class="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center text-lg group-hover:scale-110 transition-transform"
                      >
                        🐍
                      </div>
                      <div>
                        <p class="text-xs font-black text-slate-800">{{ course.title }}</p>
                        <p class="text-[10px] font-bold text-slate-400">
                          {{ course.teacher.name }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Lessons -->
                  <div v-if="searchResults.lessons.length" class="p-3 border-t-2 border-slate-50">
                    <p
                      class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2"
                    >
                      Уроки
                    </p>
                    <div
                      v-for="lesson in searchResults.lessons"
                      :key="lesson.id"
                      @click="
                        handleResultClick(`/courses/${lesson.module.course.id}?lesson=${lesson.id}`)
                      "
                      class="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-2xl cursor-pointer transition-colors group"
                    >
                      <div
                        class="w-10 h-10 bg-brand-blue/10 rounded-xl flex items-center justify-center text-lg group-hover:scale-110 transition-transform"
                      >
                        📺
                      </div>
                      <div>
                        <p class="text-xs font-black text-slate-800">{{ lesson.title }}</p>
                        <p class="text-[10px] font-bold text-slate-400">
                          {{ lesson.module.course.title }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>

            <NotificationBell />
          </div>
        </header>

        <!-- Page Content Padding Adjustments for Bottom Nav on Mobile -->
        <div class="flex-grow p-4 sm:p-6 md:p-8 lg:p-12 pb-32 md:pb-12">
          <div class="max-w-[1440px] mx-auto">
            <slot />
          </div>
        </div>
      </main>
    </div>
    <!-- End of v-if="!isLoggingOut" -->

    <!-- Instant Logout Overlay -->
    <div
      v-if="isLoggingOut"
      class="fixed inset-0 bg-white z-[9999] flex items-center justify-center"
    >
      <div class="flex flex-col items-center gap-4">
        <div
          class="w-16 h-16 bg-brand-green rounded-2xl flex items-center justify-center animate-bounce"
        >
          <img :src="logoImage" alt="Logo" class="w-10 h-10 object-contain" />
        </div>
        <p class="text-slate-400 font-black uppercase tracking-widest text-xs animate-pulse">
          Выходим...
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import logoImage from '~/assets/logo.png'
import { useUserStore } from '~/entities/user/model/store'
import { useApi } from '~/shared/api'
import NotificationBell from '~/widgets/notifications/ui/NotificationBell.vue'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const isLoggingOut = ref(false)

// Search Logic
const api = useApi()
const searchQuery = ref('')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const searchResults = ref<{ courses: any[]; lessons: any[] }>({ courses: [], lessons: [] })
const showResults = ref(false)
let searchTimeout: NodeJS.Timeout
const searchContainer = ref<HTMLElement | null>(null)

const handleSearch = () => {
  clearTimeout(searchTimeout)
  if (!searchQuery.value.trim()) {
    searchResults.value = { courses: [], lessons: [] }
    showResults.value = false
    return
  }

  searchTimeout = setTimeout(async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await api<any>(`/courses/search?q=${searchQuery.value}`)
      searchResults.value = data
      showResults.value = true
    } catch (e) {
      console.error(e)
    }
  }, 300)
}

const handleResultClick = (link: string) => {
  showResults.value = false
  searchQuery.value = ''
  router.push(link)
}

const handleClickOutside = (event: MouseEvent) => {
  if (searchContainer.value && !searchContainer.value.contains(event.target as Node)) {
    showResults.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const navItems = computed(() => {
  if (['TEACHER', 'ADMIN'].includes(userStore.user?.role as string)) {
    return [
      { label: 'Главная', path: '/dashboard', icon: '🏠' },
      { label: 'Мои курсы', path: '/courses', icon: '🛠️' },
      { label: 'Проверка ДЗ', path: '/tasks', icon: '⚖️' },
      { label: 'Аналитика', path: '/analytics', icon: '📈' },
    ]
  }
  return [
    { label: 'Главная', path: '/dashboard', icon: '🏠' },
    { label: 'Обучение', path: '/courses', icon: '📚' },
    { label: 'Домашки', path: '/tasks', icon: '⚡' },
    { label: 'Успехи', path: '/analytics', icon: '📈' },
  ]
})

const isActive = (path: string) => {
  if (path === '/dashboard' && route.path === '/dashboard') return true
  if (path !== '/dashboard' && route.path.startsWith(path)) return true
  return false
}

const currentPageTitle = computed(() => {
  if (isActive('/settings')) return 'Настройки'
  return navItems.value.find((item) => isActive(item.path))?.label || 'Приложение Змейка'
})

const handleLogout = () => {
  // 1. Trigger instant UI vanish
  isLoggingOut.value = true
  // 2. Clear data
  userStore.clearUser()
  // 3. Instant client-side redirect
  router.replace('/')
}
</script>

<style scoped>
.shadow-cartoon {
  box-shadow: 0 8px 0 0 #f1f5f9;
}
.shadow-cartoon-sm {
  box-shadow: 0 4px 0 0 #166534;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

/* Ensure smooth transitions for active state */
.router-link-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>
