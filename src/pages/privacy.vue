<template>
  <div class="pt-32 pb-24 px-6 md:px-12 bg-white selection:bg-emerald-500/10 min-h-screen">
    <div class="max-w-4xl mx-auto space-y-16">
      <!-- Header -->
      <header class="space-y-6 text-center md:text-left">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-500 transition-colors group"
        >
          <span class="text-lg group-hover:-translate-x-1 transition-transform">←</span>
          <span class="text-[10px] uppercase font-black tracking-widest">На главную</span>
        </NuxtLink>
        <h1 class="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
          Политика <span class="text-emerald-500 text-glow">конфиденциальности</span>
        </h1>
        <p class="text-lg text-slate-500 font-bold">Последнее обновление: 10 февраля 2026</p>
      </header>

      <!-- Content -->
      <div
        class="prose prose-slate prose-xl prose-headings:font-black prose-headings:tracking-tight prose-strong:text-slate-900 prose-p:text-slate-600 space-y-12"
      >
        <section class="space-y-4">
          <h2 class="text-2xl md:text-3xl">1. Общие положения</h2>
          <p>
            Мы уважаем вашу конфиденциальность и стремимся защищать ваши личные данные. Эта политика
            объясняет, как мы собираем, используем и защищаем вашу информацию при использовании
            платформы Змейка.
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-2xl md:text-3xl">2. Какие данные мы собираем</h2>
          <ul class="space-y-2 list-none p-0">
            <li class="flex items-start gap-3">
              <span class="text-emerald-500 shrink-0">✔</span>
              <span
                ><strong>Учетные данные:</strong> Имя, email и пароль для создания аккаунта.</span
              >
            </li>
            <li class="flex items-start gap-3">
              <span class="text-emerald-500 shrink-0">✔</span>
              <span
                ><strong>Данные профиля:</strong> Аватар, информация о ваших успехах и уровне.</span
              >
            </li>
            <li class="flex items-start gap-3">
              <span class="text-emerald-500 shrink-0">✔</span>
              <span
                ><strong>Учебные данные:</strong> Ваши решения домашних заданий, комментарии и
                код.</span
              >
            </li>
          </ul>
        </section>

        <section class="space-y-4">
          <h2 class="text-2xl md:text-3xl">3. Как мы используем данные</h2>
          <p>
            Мы используем вашу информацию исключительно для обеспечения работы платформы,
            персонализации обучения и связи с вами по важным обновлениям курса.
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-2xl md:text-3xl">4. Защита информации</h2>
          <p>
            Все данные хранятся в зашифрованном виде. Мы не передаем ваши личные данные третьим
            лицам, за исключением случаев, предусмотренных законодательством.
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-2xl md:text-3xl">5. Связь с нами</h2>
          <p>
            Если у вас есть вопросы по поводу нашей политики конфиденциальности, пишите нам на
            <a href="mailto:privacy@zmeyka.ru" class="text-emerald-500 font-black hover:underline"
              >privacy@zmeyka.ru</a
            >.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

useSeoMeta({
  title: 'Политика конфиденциальности | Змейка',
  description: 'Как мы защищаем ваши данные на платформе Змейка.',
})
</script>

<style scoped>
.text-glow {
  text-shadow: 0 0 30px rgba(16, 185, 129, 0.2);
}
</style>
