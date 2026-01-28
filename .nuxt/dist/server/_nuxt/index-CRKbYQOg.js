import { _ as __nuxt_component_0 } from "./nuxt-link-BZfKwrFe.js";
import { defineComponent, computed, ref, mergeProps, withCtx, createVNode, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderStyle } from "vue/server-renderer";
import { u as useUserStore, _ as _imports_0 } from "./store-CH_y8-jg.js";
import { u as useHead } from "../server.mjs";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "C:/Users/novik/OneDrive/Рабочий стол/zmeyka/node_modules/ufo/dist/index.mjs";
import "pinia";
import "C:/Users/novik/OneDrive/Рабочий стол/zmeyka/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/novik/OneDrive/Рабочий стол/zmeyka/node_modules/hookable/dist/index.mjs";
import "C:/Users/novik/OneDrive/Рабочий стол/zmeyka/node_modules/unctx/dist/index.mjs";
import "C:/Users/novik/OneDrive/Рабочий стол/zmeyka/node_modules/h3/dist/index.mjs";
import "C:/Users/novik/OneDrive/Рабочий стол/zmeyka/node_modules/defu/dist/defu.mjs";
import "vue-router";
import "C:/Users/novik/OneDrive/Рабочий стол/zmeyka/node_modules/klona/dist/index.mjs";
import "C:/Users/novik/OneDrive/Рабочий стол/zmeyka/node_modules/@unhead/vue/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const userStore = useUserStore();
    const startRoute = computed(() => userStore.isLoggedIn ? "/dashboard" : "/auth/register");
    useHead({
      title: "Zmeyka — Твой интерактивный ИИ-наставник в мире IT",
      meta: [
        { name: "description", content: "Освой Python и основы IT с помощью самого доброго в мире ИИ-наставника. Мгновенная проверка кода, геймификация и личный диплом." },
        { name: "keywords", content: "курсы программирования, python для новичков, обучение ИИ, змейка обучение, IT школа" },
        { property: "og:title", content: "Zmeyka — Учись кодить играя" },
        { property: "og:description", content: "Интерактивная платформа с ИИ-проверкой домашних заданий. Начни бесплатно прямо сейчас!" },
        { property: "og:url", content: "https://zmeyka.io" },
        { property: "og:image", content: "https://zmeyka.io/og-image.png" },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: "https://zmeyka.io/og-image.png" }
      ],
      link: [
        { rel: "canonical", href: "https://zmeyka.io" }
      ],
      htmlAttrs: { lang: "ru" }
    });
    ref(null);
    ref(null);
    const currentStep = ref(0);
    const activeFaq = ref(0);
    const faqItems = [
      { q: "Нужно ли знать математику?", a: "Логика важнее формул! Если умеешь считать до десяти — ты справишься." },
      { q: "Как работает ИИ проверка?", a: "Мы используем Gemini. Твой код анализируется за секунды с подробным разбором." },
      { q: "С какого возраста?", a: "Оптимально от 10 лет, но главное — желание учиться." },
      { q: "Это бесплатно?", a: "Есть тариф 'Старт' с базой. PRO — для тех, кто хочет максимум." }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<main${ssrRenderAttrs(mergeProps({
        id: "main-content",
        class: "w-full selection:bg-brand-green/30"
      }, _attrs))} data-v-69aad233><a href="#features" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[10000] bg-brand-green text-white px-6 py-3 rounded-xl font-bold" data-v-69aad233>Перейти к контенту</a><section class="relative pt-32 pb-40 px-6 overflow-hidden" data-v-69aad233><div class="absolute inset-0 pointer-events-none" data-v-69aad233><div class="absolute top-20 left-10 w-72 h-72 bg-brand-green/10 rounded-full blur-3xl animate-blob" data-v-69aad233></div><div class="absolute top-40 right-10 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl animate-blob animation-delay-2000" data-v-69aad233></div><div class="absolute bottom-20 left-1/3 w-80 h-80 bg-brand-blue/10 rounded-full blur-3xl animate-blob animation-delay-4000" data-v-69aad233></div></div><div class="max-width-wrapper max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center" data-v-69aad233><article class="space-y-10 relative z-10" data-v-69aad233><div class="hero-badge inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-brand-green/20 text-brand-green font-black rounded-full text-sm uppercase tracking-widest shadow-sm hover:shadow-md transition-all cursor-default" data-v-69aad233><span class="animate-pulse text-lg" aria-hidden="true" data-v-69aad233>✨</span> Твой новый путь в мир IT </div><h1 class="hero-title text-4xl sm:text-6xl md:text-8xl font-black text-slate-800 leading-[0.9] tracking-tight drop-shadow-2xl" data-v-69aad233><div class="hero-word-line overflow-hidden py-2" data-v-69aad233><span class="hero-word inline-block mr-4" data-v-69aad233>Учись</span><span class="hero-word inline-block text-brand-green highlight-glow" data-v-69aad233>кодить</span></div><div class="hero-word-line overflow-hidden py-2" data-v-69aad233><span class="hero-word inline-block mr-4" data-v-69aad233>играя</span><span class="hero-word inline-block text-brand-yellow highlight-glow relative" data-v-69aad233> вместе <svg class="absolute -bottom-2 left-0 w-full h-4 text-brand-yellow/30 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none" data-v-69aad233><path d="M0 5 Q 50 10 100 5" stroke="currentColor" stroke-width="8" fill="none" data-v-69aad233></path></svg></span></div></h1><p class="hero-description text-xl font-bold text-slate-500 max-w-lg leading-relaxed" data-v-69aad233> Погрузись в обучение с самым добрым в мире AI-помощником. Сдавай домашки и получай мгновенный разбор от нашей Змейки! </p><div class="hero-cta flex flex-wrap gap-5 pt-4" data-v-69aad233>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: startRoute.value,
        "aria-label": "Начать бесплатное обучение",
        class: "btn-magnetic bg-brand-green px-10 py-5 rounded-3xl font-black text-white text-xl shadow-[0_8px_0_0_#166534] hover:shadow-[0_4px_0_0_#166534] transition-all btn-bouncy flex items-center gap-3 text-decoration-none focus:ring-4 focus:ring-brand-green/30 outline-none"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span aria-hidden="true" data-v-69aad233${_scopeId}>🚀</span> Начать бесплатно `);
          } else {
            return [
              createVNode("span", { "aria-hidden": "true" }, "🚀"),
              createTextVNode(" Начать бесплатно ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button aria-label="Смотреть демо урок" class="btn-magnetic bg-white px-10 py-5 rounded-3xl font-black text-slate-600 text-xl border-4 border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center gap-3 shadow-sm focus:ring-4 focus:ring-slate-100 outline-none" data-v-69aad233><span aria-hidden="true" data-v-69aad233>▶️</span> Демо урок </button></div></article><div class="hero-image relative lg:h-[700px] flex items-center justify-center" data-v-69aad233><div class="relative w-full max-w-lg aspect-square" data-v-69aad233><div class="hero-bg-blob absolute inset-0 bg-gradient-to-br from-brand-green/20 to-brand-blue/20 rounded-[4rem] transform rotate-6" aria-hidden="true" data-v-69aad233></div><div class="hero-card absolute inset-0 bg-white rounded-[4rem] border-8 border-white shadow-cartoon-lg flex items-center justify-center overflow-hidden transform -rotate-3 transition-transform hover:rotate-0 duration-500 group" data-v-69aad233><div class="relative w-full h-full bg-slate-50 flex flex-col items-center justify-center p-10 text-center space-y-6" data-v-69aad233><div class="relative w-64 h-64 transition-transform group-hover:scale-110 duration-500" data-v-69aad233><img${ssrRenderAttr("src", _imports_0)} alt="Веселая 3D змейка талисман" class="w-full h-full object-contain filter drop-shadow-xl animate-float" data-v-69aad233></div><div class="hero-bubble bg-white px-6 py-4 rounded-3xl shadow-cartoon border-2 border-slate-100 font-black text-slate-800 text-lg relative" data-v-69aad233> &quot;Привет! Давай прокачаем твои мозги!&quot; <div class="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-t-2 border-l-2 border-slate-100 transform rotate-45" data-v-69aad233></div></div></div></div><div class="hero-floating-badge absolute -top-10 -right-10 bg-brand-yellow p-6 rounded-3xl shadow-cartoon transform rotate-12" aria-hidden="true" data-v-69aad233><div class="text-4xl text-white font-black" data-v-69aad233>A+</div></div><div class="hero-floating-badge absolute -bottom-5 -left-5 bg-brand-blue p-5 rounded-3xl shadow-cartoon transform -rotate-6" aria-hidden="true" data-v-69aad233><div class="text-4xl text-white" data-v-69aad233>🏆</div></div></div></div></div></section><section id="features" class="py-32 px-6 relative z-10" data-v-69aad233><div class="max-w-7xl mx-auto" data-v-69aad233><header class="text-center mb-20 max-w-3xl mx-auto space-y-4 reveal-on-scroll" data-v-69aad233><span class="text-brand-blue font-black uppercase tracking-widest text-sm bg-brand-blue/10 px-4 py-2 rounded-full" data-v-69aad233>Преимущества</span><h2 class="text-4xl md:text-5xl font-black text-slate-800" data-v-69aad233>Учеба — это приключение,<br data-v-69aad233> а не скучная зубрежка!</h2></header><div class="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-container" data-v-69aad233><!--[-->`);
      ssrRenderList([
        { icon: "🤖", title: "AI Проверка", desc: "Наша змейка за секунду разберет твой код и найдет ошибки.", color: "brand-green" },
        { icon: "📈", title: "Твой Прогресс", desc: "Следи за ростом своих навыков в реальном времени.", color: "brand-blue" },
        { icon: "🎓", title: "Сертификация", desc: "Собери портфолио и получи красивый диплом от Змейки.", color: "brand-yellow" }
      ], (item) => {
        _push(`<article class="feature-card reveal-on-scroll relative p-10 bg-white rounded-[3rem] border-4 border-slate-100 shadow-cartoon overflow-hidden transition-shadow duration-500 group cursor-default" data-v-69aad233><div class="absolute inset-0 bg-gradient-to-br from-white to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700" data-v-69aad233></div><div class="relative z-10 space-y-8 pointer-events-none" data-v-69aad233><div class="icon-wrapper inline-block" data-v-69aad233><div class="${ssrRenderClass([[`bg-${item.color}/10`], "icon-box w-24 h-24 rounded-[2rem] flex items-center justify-center text-6xl shadow-inner transition-transform duration-500"])}" data-v-69aad233>${ssrInterpolate(item.icon)}</div></div><div class="space-y-4" data-v-69aad233><h3 class="text-3xl font-black text-slate-800" data-v-69aad233>${ssrInterpolate(item.title)}</h3><p class="font-bold text-slate-500 leading-relaxed text-lg" data-v-69aad233>${ssrInterpolate(item.desc)}</p></div></div><div class="feature-glow absolute inset-0 opacity-0 transition-opacity duration-500 bg-[radial-gradient(circle_at_var(--x)_var(--y),_rgba(34,197,94,0.08)_0%,_transparent_70%)]" data-v-69aad233></div></article>`);
      });
      _push(`<!--]--></div></div></section><section id="process" class="relative h-[300vh]" data-v-69aad233><div class="sticky top-0 h-screen flex items-center justify-center bg-white overflow-hidden" data-v-69aad233><div class="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" aria-hidden="true" data-v-69aad233><svg class="w-full h-full" viewBox="0 0 1440 800" fill="none" data-v-69aad233><path d="M-100 400 Q 720 100 1540 400" stroke="#22C55E" stroke-width="40" stroke-linecap="round" stroke-dasharray="29 50" data-v-69aad233></path></svg></div><div class="max-w-7xl w-full mx-auto px-6 relative z-10 py-20" data-v-69aad233><div class="text-center mb-24" data-v-69aad233><span class="text-brand-orange font-black uppercase tracking-widest text-sm bg-brand-orange/10 px-4 py-2 rounded-full" data-v-69aad233>Как это работает</span><h2 class="text-4xl md:text-5xl font-black text-slate-800 mt-6" data-v-69aad233>Путь джедая (то есть Змейки)</h2><p class="text-slate-500 font-bold mt-4 animate-bounce" data-v-69aad233>👇 Крути колесико вниз 👇</p></div><div class="process-grid relative grid grid-cols-1 md:grid-cols-4 gap-4" data-v-69aad233><div class="hidden md:block snake-connector top-16 left-[12%] w-[26%]" aria-hidden="true" data-v-69aad233><div class="snake-connector-fill bg-brand-green h-full w-0 rounded-full shadow-[0_0_15px_#22c55e]" data-v-69aad233></div></div><div class="hidden md:block snake-connector top-16 left-[37%] w-[26%]" aria-hidden="true" data-v-69aad233><div class="snake-connector-fill bg-brand-blue h-full w-0 rounded-full shadow-[0_0_15px_#3b82f6]" data-v-69aad233></div></div><div class="hidden md:block snake-connector top-16 left-[62%] w-[26%]" aria-hidden="true" data-v-69aad233><div class="snake-connector-fill bg-brand-yellow h-full w-0 rounded-full shadow-[0_0_15px_#eab308]" data-v-69aad233></div></div><!--[-->`);
      ssrRenderList([
        { icon: "👋", title: "Регистрация", desc: "Выбирай персонажа", color: "brand-green" },
        { icon: "📺", title: "Смотри уроки", desc: "Видео без воды", color: "brand-blue" },
        { icon: "⚡", title: "ИИ Практика", desc: "Пиши код", color: "brand-yellow" },
        { icon: "🏆", title: "Победа!", desc: "Получай диплом", color: "brand-orange" }
      ], (step, i) => {
        _push(`<div class="${ssrRenderClass([{ "active": currentStep.value >= i + 1 }, "step-card relative text-center space-y-6"])}" data-v-69aad233><div class="${ssrRenderClass([[`bg-${step.color}/10 border-${step.color}`], "step-icon w-32 h-32 mx-auto bg-slate-50 border-4 border-slate-100 rounded-full flex items-center justify-center text-5xl shadow-cartoon transition-all relative z-10"])}" data-v-69aad233>${ssrInterpolate(step.icon)} <div class="${ssrRenderClass([[`bg-${step.color}`], "absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-white font-black border-4 border-white"])}" data-v-69aad233>${ssrInterpolate(i + 1)}</div></div><div class="step-content" data-v-69aad233><h4 class="text-2xl font-black text-slate-800 mb-2" data-v-69aad233>${ssrInterpolate(step.title)}</h4><p class="text-slate-500 font-bold" data-v-69aad233>${ssrInterpolate(step.desc)}</p></div></div>`);
      });
      _push(`<!--]--></div></div></div></section><section id="pricing" class="py-32 px-6" data-v-69aad233><div class="max-w-7xl mx-auto" data-v-69aad233><header class="text-center mb-24 space-y-4 reveal-on-scroll" data-v-69aad233><span class="text-brand-green font-black uppercase tracking-widest text-sm bg-brand-green/10 px-4 py-2 rounded-full" data-v-69aad233>Тарифы</span><h2 class="text-4xl md:text-5xl font-black text-slate-800" data-v-69aad233>Честные цены,<br data-v-69aad233> огромная польза</h2></header><div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-start perspective-container" data-v-69aad233><!--[-->`);
      ssrRenderList([
        { name: "Старт", price: "0 ₽", sub: "Для знакомства", items: ["Базовые курсы", "5 ИИ проверок", "Сообщество"], color: "slate" },
        { name: "PRO Змейка", price: "490 ₽", sub: "Макс. скорость", items: ["Все курсы", "Безлимит ИИ", "Поддержка 24/7"], color: "brand-green", active: true },
        { name: "Школам", price: "B2B", sub: "Для классов", items: ["Кабинет учителя", "Аналитика", "Скидки на опт"], color: "brand-blue" }
      ], (plan, i) => {
        _push(`<article class="${ssrRenderClass([[plan.active ? "bg-slate-900 border-slate-900 shadow-2xl z-10" : "bg-white border-slate-100 shadow-cartoon hover:z-20"], "pricing-card reveal-on-scroll group relative p-10 rounded-[3rem] border-4 space-y-8 flex flex-col transition-all"])}" data-v-69aad233>`);
        if (plan.active) {
          _push(`<div class="absolute -top-6 left-1/2 -translate-x-1/2 bg-brand-green text-white px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest shadow-lg border-4 border-slate-900 flex items-center gap-2 transform transition-transform group-hover:scale-110 group-hover:-translate-y-2 z-20" data-v-69aad233><span data-v-69aad233>🔥</span> ХИТ СЕЗОНА</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="${ssrRenderClass([[plan.active ? "pt-4" : ""], "space-y-4"])}" data-v-69aad233><span class="${ssrRenderClass([[plan.active ? "bg-brand-green/10 text-brand-green" : "bg-slate-100 text-slate-400"], "font-black uppercase tracking-widest text-xs px-3 py-1 rounded-full"])}" data-v-69aad233>${ssrInterpolate(plan.name)}</span><h4 class="${ssrRenderClass([[plan.active ? "text-white" : "text-slate-800"], "text-5xl font-black"])}" data-v-69aad233>${ssrInterpolate(plan.price)}</h4><p class="text-slate-400 font-bold" data-v-69aad233>${ssrInterpolate(plan.sub)}</p></div><div class="${ssrRenderClass([[plan.active ? "bg-slate-800" : "bg-slate-50"], "h-1 w-full rounded-full"])}" data-v-69aad233></div><ul class="${ssrRenderClass([[plan.active ? "text-slate-300" : "text-slate-500"], "space-y-4 flex-grow font-bold"])}" data-v-69aad233><!--[-->`);
        ssrRenderList(plan.items, (item) => {
          _push(`<li class="flex items-center gap-3" data-v-69aad233><span class="text-brand-green" aria-hidden="true" data-v-69aad233>✓</span> <span class="${ssrRenderClass([plan.active && item.includes("Все") ? "text-white" : ""])}" data-v-69aad233>${ssrInterpolate(item)}</span></li>`);
        });
        _push(`<!--]--></ul><button class="${ssrRenderClass([[plan.active ? "bg-brand-green text-white shadow-[0_6px_0_0_#166534] focus:ring-brand-green/30" : "bg-white border-4 border-slate-100 text-slate-400 hover:bg-slate-50 focus:ring-slate-100"], "w-full py-5 rounded-2xl font-black transition-all shadow-cartoon text-lg focus:ring-4 outline-none"])}" data-v-69aad233>${ssrInterpolate(plan.price === "B2B" ? "Связаться" : "Выбрать")}</button><div class="card-spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 rounded-[3rem]" aria-hidden="true" data-v-69aad233></div></article>`);
      });
      _push(`<!--]--></div></div></section><section id="faq" class="py-20 px-6 max-w-4xl mx-auto reveal-on-scroll" data-v-69aad233><header class="text-center mb-16 text-slate-800" data-v-69aad233><h2 class="text-3xl md:text-4xl font-black" data-v-69aad233>Частые вопросы</h2><p class="text-slate-500 font-bold mt-4" data-v-69aad233>Всё, что ты хотел узнать, но стеснялся спросить</p></header><div class="faq-container space-y-4" data-v-69aad233><!--[-->`);
      ssrRenderList(faqItems, (item, index2) => {
        _push(`<article class="${ssrRenderClass([activeFaq.value === index2 ? "border-brand-green/30 shadow-cartoon" : "hover:border-slate-200", "faq-item bg-white border-4 border-slate-100 rounded-3xl overflow-hidden transition-all duration-300"])}" data-v-69aad233><button${ssrRenderAttr("aria-expanded", activeFaq.value === index2)} class="w-full flex items-center justify-between p-6 text-left font-black text-lg text-slate-700 outline-none select-none focus:bg-slate-50" data-v-69aad233>${ssrInterpolate(item.q)} <span class="${ssrRenderClass([activeFaq.value === index2 ? "rotate-45 text-brand-green bg-brand-green/10" : "text-slate-400", "plus-icon text-3xl transition-transform duration-300 transform flex items-center justify-center w-8 h-8 rounded-full"])}" aria-hidden="true" data-v-69aad233>+</span></button><div class="grid transition-[grid-template-rows] duration-500 ease-out" style="${ssrRenderStyle({ "grid-template-rows": activeFaq.value === index2 ? "1fr" : "0fr" })}" data-v-69aad233><div class="overflow-hidden" data-v-69aad233><div class="p-6 pt-0 text-slate-600 font-bold leading-relaxed border-t-2 border-slate-50 mt-2" data-v-69aad233>${ssrInterpolate(item.a)}</div></div></div></article>`);
      });
      _push(`<!--]--></div></section><section class="py-32 px-6 reveal-on-scroll" data-v-69aad233><div class="max-w-6xl mx-auto relative group" data-v-69aad233><div class="absolute -inset-4 bg-gradient-to-r from-brand-green to-brand-blue rounded-[4rem] blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-700" aria-hidden="true" data-v-69aad233></div><div class="relative bg-slate-900 rounded-[3.5rem] p-12 md:p-24 overflow-hidden border-8 border-slate-800 shadow-2xl" data-v-69aad233><div class="absolute inset-0 opacity-30" aria-hidden="true" data-v-69aad233><div class="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-green rounded-full filter blur-[100px] animate-blob" data-v-69aad233></div><div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-blue rounded-full filter blur-[100px] animate-blob animation-delay-4000" data-v-69aad233></div></div><div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" data-v-69aad233><div class="cta-content space-y-8 text-center lg:text-left" data-v-69aad233><span class="inline-block px-4 py-2 bg-white/10 text-white rounded-full font-bold text-sm uppercase tracking-widest backdrop-blur-md border border-white/10" data-v-69aad233>✨ Твой код к успеху</span><h2 class="text-4xl md:text-6xl font-black text-white leading-[1.1] drop-shadow-lg" data-v-69aad233>Стань повелителем <br data-v-69aad233> <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-yellow" data-v-69aad233>питонов</span></h2><p class="text-slate-300 text-xl font-bold max-w-lg mx-auto lg:mx-0 leading-relaxed" data-v-69aad233>Хватит откладывать. Всего 15 минут в день, и через месяц ты напишешь свою первую игру.</p><div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start" data-v-69aad233>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard",
        "aria-label": "Начать прямо сейчас",
        class: "bg-brand-green px-10 py-5 rounded-2xl font-black text-white text-xl shadow-[0_8px_0_0_#166534] hover:translate-y-1 hover:shadow-[0_4px_0_0_#166534] transition-all active:translate-y-2 active:shadow-none btn-bouncy text-decoration-none focus:ring-4 focus:ring-brand-green/30 outline-none"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Начать сейчас`);
          } else {
            return [
              createTextVNode("Начать сейчас")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="cta-image relative h-[400px] flex items-center justify-center pointer-events-none" data-v-69aad233><img${ssrRenderAttr("src", _imports_0)} alt="Snake Mascot" class="relative z-10 w-full h-full object-contain drop-shadow-2xl animate-float transform scale-125 lg:scale-150 rotate-[-10deg]" data-v-69aad233></div></div></div></div></section></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-69aad233"]]);
export {
  index as default
};
//# sourceMappingURL=index-CRKbYQOg.js.map
