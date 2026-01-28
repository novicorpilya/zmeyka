import { _ as __nuxt_component_0 } from "./nuxt-link-BZfKwrFe.js";
import { defineComponent, ref, reactive, mergeProps, useSSRContext, withCtx, createTextVNode } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderComponent } from "vue/server-renderer";
import { u as useCourseApi } from "./index-DbT3jZut.js";
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
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "CourseForm",
  __ssrInlineRender: true,
  setup(__props) {
    useCourseApi();
    const loading = ref(false);
    const error = ref("");
    const success = ref(false);
    const form = reactive({
      title: "",
      description: "",
      teacherId: "",
      videoUrls: "[]",
      quizzes: "[]"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<form${ssrRenderAttrs(mergeProps({ class: "space-y-8 max-w-2xl mx-auto p-12 bg-white rounded-[3rem] border-4 border-slate-100 shadow-cartoon" }, _attrs))}><div class="text-center space-y-2"><div class="text-5xl">✍️</div><h2 class="text-3xl font-black text-slate-800 uppercase tracking-tight">Новое приключение</h2><p class="font-bold text-slate-400 uppercase tracking-widest text-xs">Заполни анкету курса</p></div><div class="space-y-6"><div class="space-y-3"><label class="text-sm font-black text-slate-500 uppercase tracking-widest ml-4">Название курса</label><input${ssrRenderAttr("value", form.title)} type="text" placeholder="Напр: Магия Python со Змейкой" class="w-full px-6 py-4 bg-slate-50 border-4 border-slate-100 rounded-2xl font-bold focus:border-brand-green/50 outline-none transition-all text-slate-700 placeholder:text-slate-300" required></div><div class="space-y-3"><label class="text-sm font-black text-slate-500 uppercase tracking-widest ml-4">Описание</label><textarea rows="4" placeholder="О чем будет этот курс?" class="w-full px-6 py-4 bg-slate-50 border-4 border-slate-100 rounded-2xl font-bold focus:border-brand-green/50 outline-none transition-all text-slate-700 resize-none placeholder:text-slate-300">${ssrInterpolate(form.description)}</textarea></div><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="space-y-3"><label class="text-sm font-black text-slate-500 uppercase tracking-widest ml-4">Твой ID Учителя</label><input${ssrRenderAttr("value", form.teacherId)} type="text" placeholder="UUID из Swagger" class="w-full px-6 py-4 bg-slate-50 border-4 border-slate-100 rounded-2xl font-bold focus:border-brand-blue/50 outline-none transition-all text-slate-700 placeholder:text-slate-300" required></div><div class="space-y-3"><label class="text-sm font-black text-slate-500 uppercase tracking-widest ml-4">Видео (JSON)</label><input${ssrRenderAttr("value", form.videoUrls)} type="text" placeholder="[&quot;url&quot;]" class="w-full px-6 py-4 bg-slate-50 border-4 border-slate-100 rounded-2xl font-bold focus:border-brand-orange/50 outline-none transition-all text-slate-700 placeholder:text-slate-300" required></div></div></div><button type="submit"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="w-full py-6 bg-brand-green hover:bg-emerald-400 text-white rounded-[2rem] font-black text-xl shadow-[0_10px_0_0_#166534] hover:translate-y-1 hover:shadow-[0_6px_0_0_#166534] transition-all active:translate-y-2 active:shadow-none btn-bouncy disabled:opacity-50">${ssrInterpolate(loading.value ? "Создаем..." : "Опубликовать ✨")}</button>`);
      if (error.value) {
        _push(`<div class="p-4 bg-rose-50 border-4 border-rose-100 rounded-2xl text-rose-500 font-bold text-center"> 🙊 Ой! ${ssrInterpolate(error.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (success.value) {
        _push(`<div class="p-4 bg-emerald-50 border-4 border-emerald-100 rounded-2xl text-brand-green font-black text-center animate-bounce"> ✅ Ура! Курс успешно создан! 🎉 </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</form>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("features/course-builder/ui/CourseForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen p-8" }, _attrs))}><div class="max-w-4xl mx-auto space-y-8"><div class="flex items-center justify-between"><div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` ← Back to Home `);
          } else {
            return [
              createTextVNode(" ← Back to Home ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h1 class="text-3xl font-bold mt-2 text-slate-100">Course Builder</h1><p class="text-slate-400">Create a new high-quality AI course for your students.</p></div></div>`);
      _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/course/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=create-AUXcrVhO.js.map
