<template>
  <div
    class="max-w-4xl mx-auto space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700"
  >
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-2">
      <h1 class="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Настройки ⚙️</h1>

      <div v-if="tabs.length > 1" class="flex p-1.5 bg-slate-100 rounded-2xl">
        <NuxtLink
          v-for="tab in tabs"
          :key="tab.id"
          :to="{ query: { tab: tab.id } }"
          class="px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
          :class="
            activeTab === tab.id
              ? 'bg-white text-brand-blue shadow-sm'
              : 'text-slate-400 hover:text-slate-600'
          "
        >
          {{ tab.label }}
        </NuxtLink>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 md:gap-10">
      <!-- Account Tab -->
      <template v-if="activeTab === 'account'">
        <!-- Profile & Avatar Settings -->
        <section
          class="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border-4 border-slate-100 shadow-cartoon space-y-8 md:space-y-10"
        >
          <AvatarSettings v-model:avatar="form.avatar" @upload-error="error = $event" />

          <ProfileForm
            v-model:name="form.name"
            :email="userStore.user?.email"
            :loading="loading"
            :success="success"
            :error="error"
            @submit="handleUpdateProfile"
          />
        </section>

        <!-- Logout section -->
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
      </template>

      <!-- Public Profile Tab (for teachers) -->
      <template v-if="activeTab === 'public' && isTeacher">
        <section
          class="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border-4 border-slate-100 shadow-cartoon"
        >
          <ProfessionalProfileForm />
        </section>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'

import { useUserStore } from '~/entities/user/model/store'
import { useAuthApi } from '~/features/auth/api'
import ProfessionalProfileForm from '~/features/teacher/ui/ProfessionalProfileForm.vue'
import type { User } from '~/shared/types'
import AvatarSettings from '~/widgets/settings/ui/AvatarSettings.vue'
import ProfileForm from '~/widgets/settings/ui/ProfileForm.vue'

const userStore = useUserStore()
const { updateProfile } = useAuthApi()
const router = useRouter()
const route = useRoute()

const isTeacher = computed(() => ['TEACHER', 'ADMIN'].includes(userStore.user?.role as string))
const activeTab = ref(route.query.tab?.toString() || 'account')

watch(
  () => route.query.tab,
  (newTab) => {
    if (newTab) activeTab.value = newTab.toString()
  },
)

const tabs = computed(() => {
  const t = [{ id: 'account', label: 'Мой Аккаунт', icon: '👤' }]
  if (isTeacher.value) {
    t.push({ id: 'public', label: 'Публичное резюме', icon: '🎨' })
  }
  return t
})

const form = reactive({
  name: userStore.user?.name || '',
  avatar: userStore.user?.avatar || '🐍',
})

const loading = ref(false)
const success = ref(false)
const error = ref('')

const handleUpdateProfile = async () => {
  loading.value = true
  error.value = ''
  success.value = false

  try {
    const updatedUser = (await updateProfile({
      name: form.name,
      avatar: form.avatar,
    })) as User

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
