import { _ as __nuxt_component_0 } from "./nuxt-link-BZfKwrFe.js";
import { defineComponent, withAsyncContext, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { u as useCourseApi } from "./index-DbT3jZut.js";
import { u as useAsyncData } from "./asyncData-C9h_Sj6j.js";
import "C:/Users/novik/OneDrive/Рабочий стол/zmeyka/node_modules/ufo/dist/index.mjs";
import "../server.mjs";
import "C:/Users/novik/OneDrive/Рабочий стол/zmeyka/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/novik/OneDrive/Рабочий стол/zmeyka/node_modules/hookable/dist/index.mjs";
import "C:/Users/novik/OneDrive/Рабочий стол/zmeyka/node_modules/unctx/dist/index.mjs";
import "C:/Users/novik/OneDrive/Рабочий стол/zmeyka/node_modules/h3/dist/index.mjs";
import "pinia";
import "C:/Users/novik/OneDrive/Рабочий стол/zmeyka/node_modules/defu/dist/defu.mjs";
import "vue-router";
import "C:/Users/novik/OneDrive/Рабочий стол/zmeyka/node_modules/klona/dist/index.mjs";
import "C:/Users/novik/OneDrive/Рабочий стол/zmeyka/node_modules/@unhead/vue/dist/index.mjs";
import "C:/Users/novik/OneDrive/Рабочий стол/zmeyka/node_modules/perfect-debounce/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "dashboard",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { getCourses } = useCourseApi();
    const { data: courses, pending } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("courses", () => getCourses())), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen py-20 px-6" }, _attrs))}><div class="max-w-7xl mx-auto space-y-12"><div class="flex flex-col md:flex-row items-center justify-between gap-8 bg-white p-10 rounded-[3rem] border-4 border-slate-100 shadow-cartoon"><div class="flex items-center gap-6"><div class="w-20 h-20 bg-brand-green/10 rounded-3xl flex items-center justify-center text-5xl">🎓</div><div class="space-y-1"><h1 class="text-4xl font-black text-slate-800 tracking-tight">Моё обучение</h1><p class="text-xl font-bold text-slate-400">Растим навыки вместе со Змейкой!</p></div></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/course/create",
        class: "bg-brand-blue px-8 py-4 rounded-2xl font-black text-white shadow-[0_6px_0_0_#1e40af] hover:translate-y-0.5 hover:shadow-[0_4px_0_0_#1e40af] transition-all btn-bouncy"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Создать новый курс `);
          } else {
            return [
              createTextVNode(" Создать новый курс ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid grid-cols-2 lg:grid-cols-4 gap-6"><div class="bg-white p-6 rounded-3xl border-4 border-slate-100 flex items-center gap-4"><div class="w-12 h-12 bg-brand-yellow/20 rounded-2xl flex items-center justify-center text-2xl">🔥</div><div><div class="text-2xl font-black text-slate-800">5</div><div class="text-sm font-bold text-slate-400">Дней подряд</div></div></div><div class="bg-white p-6 rounded-3xl border-4 border-slate-100 flex items-center gap-4"><div class="w-12 h-12 bg-brand-green/20 rounded-2xl flex items-center justify-center text-2xl">🏆</div><div><div class="text-2xl font-black text-slate-800">${ssrInterpolate(unref(courses)?.length || 0)}</div><div class="text-sm font-bold text-slate-400">Курсов пройдено</div></div></div><div class="bg-white p-6 rounded-3xl border-4 border-slate-100 flex items-center gap-4"><div class="w-12 h-12 bg-brand-blue/20 rounded-2xl flex items-center justify-center text-2xl">✨</div><div><div class="text-2xl font-black text-slate-800">120</div><div class="text-sm font-bold text-slate-400">Очков опыта</div></div></div><div class="bg-white p-6 rounded-3xl border-4 border-slate-100 flex items-center gap-4"><div class="w-12 h-12 bg-brand-orange/20 rounded-2xl flex items-center justify-center text-2xl">🏅</div><div><div class="text-2xl font-black text-slate-800">3</div><div class="text-sm font-bold text-slate-400">Достижения</div></div></div></div><div class="space-y-8"><h2 class="text-3xl font-black text-slate-800 flex items-center gap-3"> 📚 Доступные приключения </h2><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">`);
      if (unref(pending)) {
        _push(`<div class="col-span-full py-20 text-center space-y-4"><div class="text-5xl animate-bounce">⏳</div><div class="text-xl font-bold text-slate-400 tracking-widest uppercase">Змейка ищет курсы...</div></div>`);
      } else if (!unref(courses)?.length) {
        _push(`<div class="col-span-full py-24 text-center bg-white rounded-[3rem] border-4 border-dashed border-slate-100 space-y-6"><div class="text-6xl">😴</div><p class="text-2xl font-black text-slate-400">Пока тут пусто.. Самое время создать первый курс!</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/course/create",
          class: "inline-block text-brand-green font-black underline decoration-4 underline-offset-8"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Создать приключение →`);
            } else {
              return [
                createTextVNode("Создать приключение →")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(courses), (course) => {
        _push(`<div class="bg-white p-2 rounded-[3rem] border-4 border-slate-100 hover:border-brand-green hover:shadow-[0_15px_0_0_#dcfce7] transition-all group overflow-hidden"><div class="p-8 space-y-6"><div class="w-16 h-16 bg-brand-green/10 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">📗</div><div class="space-y-2"><h3 class="text-2xl font-black text-slate-800 group-hover:text-brand-green transition-colors line-clamp-2">${ssrInterpolate(course.title)}</h3><p class="font-bold text-slate-400 line-clamp-2">${ssrInterpolate(course.description)}</p></div><div class="pt-4 flex items-center justify-between border-t-4 border-slate-50"><div class="flex items-center gap-2"><div class="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-sm">👨‍🏫</div><span class="text-sm font-black text-slate-400 uppercase tracking-wider">${ssrInterpolate(course.teacher?.name || "Аноним")}</span></div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/course/${course.id}`,
          class: "bg-brand-orange text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_4px_0_0_#9a3412] active:translate-y-1 active:shadow-none transition-all"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` 🚀 `);
            } else {
              return [
                createTextVNode(" 🚀 ")
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div></div></div>`);
      });
      _push(`<!--]--></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=dashboard-Bs-q3XWx.js.map
