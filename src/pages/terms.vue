<template>
  <div class="pt-32 pb-24 px-6 md:px-12 bg-white selection:bg-blue-500/10 min-h-screen">
    <div class="max-w-4xl mx-auto space-y-16">
      <!-- Header -->
      <header class="space-y-6 text-center md:text-left">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-colors group"
        >
          <span class="text-lg group-hover:-translate-x-1 transition-transform">←</span>
          <span class="text-[10px] uppercase font-black tracking-widest">На главную</span>
        </NuxtLink>
        <h1 class="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
          Условия <span class="text-blue-500 text-glow">использования</span>
        </h1>
        <p class="text-lg text-slate-500 font-bold">Редакция от 10 февраля 2026</p>
      </header>

      <!-- Content -->
      <div
        class="prose prose-slate prose-xl prose-headings:font-black prose-headings:tracking-tight prose-strong:text-slate-900 prose-p:text-slate-600 space-y-12"
      >
        <section class="space-y-4">
          <h2 class="text-2xl md:text-3xl">1. Согласие с условиями</h2>
          <p>
            Регистрируясь на платформе Змейка, вы соглашаетесь соблюдать данные Условия
            использования. Если вы не согласны с каким-либо из пунктов, пожалуйста, воздержитесь от
            использования сервиса.
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-2xl md:text-3xl">2. Доступ к контенту</h2>
          <p>
            Доступ к платным курсам предоставляется после оплаты и сохраняется за пользователем на
            условиях выбранного тарифа. Передача доступа к аккаунту третьим лицам строго запрещена.
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-2xl md:text-3xl">3. Правила поведения</h2>
          <ul class="space-y-2 list-none p-0">
            <li class="flex items-start gap-3">
              <span class="text-blue-500 shrink-0">✔</span>
              <span
                >Не использовать платформу для распространения спама или вредоносного кода.</span
              >
            </li>
            <li class="flex items-start gap-3">
              <span class="text-blue-500 shrink-0">✔</span>
              <span
                >Уважительно общаться с преподавателями и другими студентами в комментариях.</span
              >
            </li>
            <li class="flex items-start gap-3">
              <span class="text-blue-500 shrink-0">✔</span>
              <span>Не копировать и не распространять учебные материалы платформы.</span>
            </li>
          </ul>
        </section>

        <section class="space-y-4">
          <h2 class="text-2xl md:text-3xl">4. Интеллектуальная собственность</h2>
          <p>
            Все материалы, размещенные на платформе Змейка (видео, тексты, код, дизайн), являются
            собственностью платформы и защищены законом об авторском праве.
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-2xl md:text-3xl">5. Ответственность</h2>
          <p>
            Мы прилагаем все усилия для обеспечения бесперебойной работы платформы, но не несем
            ответственности за временные технические сбои, вызванные внешними провайдерами.
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
  title: 'Условия использования | Змейка',
  description: 'Правила использования платформы Змейка.',
})
</script>

<style scoped>
.text-glow {
  text-shadow: 0 0 30px rgba(59, 130, 246, 0.2);
}
</style>
