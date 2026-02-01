<template>
  <div
    class="max-w-4xl mx-auto space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700"
  >
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
      <h1 class="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Настройки ⚙️</h1>
      <NuxtLink
        to="/dashboard"
        class="text-xs font-black text-brand-green uppercase tracking-widest hover:underline decoration-2"
        >Вернуться на главную</NuxtLink
      >
    </div>

    <div class="grid grid-cols-1 gap-6 md:gap-10">
      <!-- Profile & Avatar Settings -->
      <section
        class="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border-4 border-slate-100 shadow-cartoon space-y-8 md:space-y-10"
      >
        <div class="space-y-6">
          <h2 class="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight">
            Твой образ
          </h2>

          <div
            class="flex flex-col md:flex-row items-stretch md:items-center gap-6 md:gap-10 p-6 md:p-8 bg-slate-50 rounded-[2rem] md:rounded-[3rem] border-2 border-slate-100"
          >
            <!-- Current Avatar Preview -->
            <div
              class="w-32 h-32 md:w-44 md:h-44 bg-white rounded-[1.5rem] md:rounded-[2.5rem] shrink-0 overflow-hidden flex items-center justify-center text-5xl md:text-7xl shadow-cartoon border-4 border-white transition-all hover:scale-[1.02] relative group mx-auto md:mx-0"
            >
              <template v-if="form.avatar && form.avatar.startsWith('data:image')">
                <img :src="form.avatar" class="w-full h-full object-cover" />
              </template>
              <template v-else>
                {{ form.avatar || '🐍' }}
              </template>

              <!-- Overlay for upload on hover -->
              <label
                class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white"
              >
                <span class="text-2xl">📸</span>
                <span class="text-[8px] font-black uppercase tracking-widest mt-1 text-center px-2"
                  >Изменить фото</span
                >
                <input type="file" @change="handleFileUpload" class="hidden" accept="image/*" />
              </label>
            </div>

            <div class="space-y-6 flex-grow flex flex-col justify-center">
              <div class="text-center md:text-left">
                <p
                  class="font-black text-slate-800 uppercase tracking-widest text-[10px] md:text-xs"
                >
                  Выбери персонажа или загрузи своё:
                </p>
              </div>

              <div class="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-4 lg:grid-cols-8 gap-3">
                <button
                  v-for="emoji in avatarOptions"
                  :key="emoji"
                  @click="form.avatar = emoji"
                  type="button"
                  class="aspect-square bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl border-2 transition-all hover:scale-110 active:scale-95 shadow-sm overflow-hidden shrink-0"
                  :class="[
                    form.avatar === emoji
                      ? 'border-brand-green bg-brand-green/5 ring-4 ring-brand-green/20'
                      : 'border-slate-100',
                  ]"
                >
                  <span class="block transform-gpu">{{ emoji }}</span>
                </button>

                <!-- Custom Upload Trigger in Grid -->
                <label
                  class="aspect-square bg-slate-100 rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-xl border-2 border-dashed border-slate-300 transition-all hover:border-brand-blue hover:bg-brand-blue/5 cursor-pointer shrink-0"
                >
                  <span>📁</span>
                  <input type="file" @change="handleFileUpload" class="hidden" accept="image/*" />
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Personal Info Form -->
        <form @submit.prevent="handleUpdateProfile" class="space-y-6 md:space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div class="space-y-2.5">
              <label
                class="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest px-1"
                >Имя в системе</label
              >
              <input
                v-model="form.name"
                type="text"
                placeholder="Мастер Питон"
                class="w-full px-5 py-3.5 md:px-6 md:py-5 bg-slate-50 border-4 border-slate-50 rounded-xl md:rounded-2xl font-bold text-slate-700 outline-none focus:border-brand-green focus:bg-white transition-all shadow-sm"
              />
            </div>
            <div class="space-y-2.5">
              <label
                class="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest px-1"
                >Email</label
              >
              <input
                type="email"
                :value="userStore.user?.email"
                disabled
                class="w-full px-5 py-3.5 md:px-6 md:py-5 bg-slate-100 border-4 border-slate-100 rounded-xl md:rounded-2xl font-bold text-slate-400 cursor-not-allowed shadow-none"
              />
            </div>
          </div>

          <div
            v-if="success"
            class="p-4 md:p-6 bg-green-50 border-2 border-green-100 rounded-xl md:rounded-2xl text-green-600 font-bold text-xs md:text-sm flex items-center gap-3 md:gap-4 animate-in slide-in-from-bottom-2"
          >
            <span class="text-xl md:text-2xl">✨</span> Маскировка успешно обновлена!
          </div>

          <div
            v-if="error"
            class="p-4 md:p-6 bg-red-50 border-2 border-red-100 rounded-xl md:rounded-2xl text-red-500 font-bold text-xs md:text-sm flex items-center gap-3 md:gap-4 animate-in slide-in-from-bottom-2"
          >
            <span class="text-xl md:text-2xl">⚠️</span> {{ error }}
          </div>

          <div class="pt-2">
            <button
              type="submit"
              :disabled="loading"
              class="w-full md:w-auto bg-brand-green px-10 py-4.5 md:px-12 md:py-5 rounded-xl md:rounded-2xl font-black text-white text-lg md:text-xl shadow-[0_6px_0_0_#166534] md:shadow-[0_8px_0_0_#166534] hover:translate-y-0.5 hover:shadow-none active:translate-y-2 active:shadow-none transition-all disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3"
            >
              <span v-if="loading" class="animate-spin text-xl text-white">⏳</span>
              <span v-else>Сохранить изменения</span>
            </button>
          </div>
        </form>
      </section>

      <!-- Logout / Device section -->
      <section
        class="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border-4 border-slate-100 shadow-cartoon flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div class="space-y-1 text-center sm:text-left">
          <h3 class="text-lg md:text-xl font-black text-slate-800 uppercase tracking-tight">
            Завершить сессию
          </h3>
          <p class="font-bold text-slate-400 text-sm">Приходи еще за новыми знаниями!</p>
        </div>
        <button
          @click="handleLogout"
          class="w-full sm:w-auto bg-red-50 text-red-500 px-8 py-4 rounded-xl md:rounded-2xl font-black border-2 border-red-100 hover:bg-red-100 active:scale-95 transition-all text-sm md:text-base"
        >
          Выйти из гнезда
        </button>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/entities/user/model/store'
import { useAuthApi } from '~/features/auth/api'

const userStore = useUserStore()
const { updateProfile } = useAuthApi()
const router = useRouter()

const avatarOptions = ['🐍', '🐲', '🐊', '🦎', '🦕', '🦖', '🐉']

const form = reactive({
  name: userStore.user?.name || '',
  avatar: userStore.user?.avatar || '🐍',
})

const loading = ref(false)
const success = ref(false)
const error = ref('')

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    error.value = 'Файл слишком большой! Максимум 2МБ'
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    form.avatar = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const handleUpdateProfile = async () => {
  loading.value = true
  error.value = ''
  success.value = false

  try {
    const updatedUser = await updateProfile({
      name: form.name,
      avatar: form.avatar,
    })

    userStore.setUser(updatedUser)
    success.value = true
    setTimeout(() => (success.value = false), 3000)
  } catch (err: unknown) {
    const errorData = err as { data?: { message?: string }; message?: string }
    error.value = errorData.data?.message || errorData.message || 'Ошибка обновления профиля'
  } finally {
    loading.value = false
  }
}

const handleLogout = () => {
  userStore.clearUser()
  router.push('/')
}

definePageMeta({
  layout: 'app',
  middleware: ['auth'],
})
</script>

<style scoped>
.shadow-cartoon {
  box-shadow: 0 10px 0 0 #f1f5f9;
}
.aspect-square {
  aspect-ratio: 1 / 1;
}
</style>
