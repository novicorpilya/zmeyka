import { _ as __nuxt_component_0 } from "./nuxt-link-BZfKwrFe.js";
import { defineComponent, reactive, ref, mergeProps, withCtx, createVNode, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { u as useUserStore, _ as _imports_0 } from "./store-CH_y8-jg.js";
import { useRouter } from "vue-router";
import { u as useAuthApi } from "./api-DlPk5Kem.js";
import "C:/Users/novik/OneDrive/Рабочий стол/zmeyka/node_modules/hookable/dist/index.mjs";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "C:/Users/novik/OneDrive/Рабочий стол/zmeyka/node_modules/ufo/dist/index.mjs";
import "../server.mjs";
import "C:/Users/novik/OneDrive/Рабочий стол/zmeyka/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/novik/OneDrive/Рабочий стол/zmeyka/node_modules/unctx/dist/index.mjs";
import "C:/Users/novik/OneDrive/Рабочий стол/zmeyka/node_modules/h3/dist/index.mjs";
import "pinia";
import "C:/Users/novik/OneDrive/Рабочий стол/zmeyka/node_modules/defu/dist/defu.mjs";
import "C:/Users/novik/OneDrive/Рабочий стол/zmeyka/node_modules/klona/dist/index.mjs";
import "C:/Users/novik/OneDrive/Рабочий стол/zmeyka/node_modules/@unhead/vue/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "register",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    useAuthApi();
    useUserStore();
    const form = reactive({
      name: "",
      email: "",
      password: ""
    });
    const loading = ref(false);
    const error = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-50" }, _attrs))} data-v-c7caf915><div class="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-brand-yellow/10 rounded-full blur-[100px] animate-pulse" data-v-c7caf915></div><div class="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-brand-green/10 rounded-full blur-[100px] animate-pulse" style="${ssrRenderStyle({ "animation-delay": "2s" })}" data-v-c7caf915></div><div class="w-full max-w-lg relative z-10 space-y-8" data-v-c7caf915><div class="text-center space-y-4" data-v-c7caf915>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "inline-flex items-center gap-2 group"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-cartoon border-2 border-slate-100 group-hover:scale-110 transition-transform" data-v-c7caf915${_scopeId}><img${ssrRenderAttr("src", _imports_0)} alt="Zmeyka" class="w-8 h-8 object-contain" data-v-c7caf915${_scopeId}></div><span class="text-2xl font-black text-slate-800 tracking-tighter" data-v-c7caf915${_scopeId}>Zmeyka</span>`);
          } else {
            return [
              createVNode("div", { class: "w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-cartoon border-2 border-slate-100 group-hover:scale-110 transition-transform" }, [
                createVNode("img", {
                  src: _imports_0,
                  alt: "Zmeyka",
                  class: "w-8 h-8 object-contain"
                })
              ]),
              createVNode("span", { class: "text-2xl font-black text-slate-800 tracking-tighter" }, "Zmeyka")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h1 class="text-4xl font-black text-slate-800 tracking-tight" data-v-c7caf915>Стань частью террариума!</h1><p class="text-slate-400 font-bold" data-v-c7caf915>Начни свой путь к IT-вершинам прямо сейчас ✨</p></div><div class="bg-white p-10 rounded-[3rem] border-4 border-slate-100 shadow-cartoon space-y-8" data-v-c7caf915><form class="space-y-6" data-v-c7caf915><div class="space-y-2" data-v-c7caf915><label class="text-sm font-black text-slate-400 uppercase tracking-widest px-1" data-v-c7caf915>Твоё имя</label><div class="relative group" data-v-c7caf915><input${ssrRenderAttr("value", form.name)} type="text" placeholder="Юный змеелов" required class="w-full px-6 py-5 bg-slate-50 border-4 border-slate-50 rounded-2xl font-bold text-slate-700 outline-none focus:border-brand-yellow focus:bg-white transition-all placeholder:text-slate-300" data-v-c7caf915><span class="absolute right-6 top-1/2 -translate-y-1/2 text-2xl grayscale group-focus-within:grayscale-0 transition-all" data-v-c7caf915>👋</span></div></div><div class="space-y-2" data-v-c7caf915><label class="text-sm font-black text-slate-400 uppercase tracking-widest px-1" data-v-c7caf915>Email</label><div class="relative group" data-v-c7caf915><input${ssrRenderAttr("value", form.email)} type="email" placeholder="serpent@expert.io" required class="w-full px-6 py-5 bg-slate-50 border-4 border-slate-50 rounded-2xl font-bold text-slate-700 outline-none focus:border-brand-green focus:bg-white transition-all placeholder:text-slate-300" data-v-c7caf915><span class="absolute right-6 top-1/2 -translate-y-1/2 text-2xl grayscale group-focus-within:grayscale-0 transition-all" data-v-c7caf915>📧</span></div></div><div class="space-y-2" data-v-c7caf915><label class="text-sm font-black text-slate-400 uppercase tracking-widest px-1" data-v-c7caf915>Пароль</label><div class="relative group" data-v-c7caf915><input${ssrRenderAttr("value", form.password)} type="password" placeholder="Минимум 6 символов" required minlength="6" class="w-full px-6 py-5 bg-slate-50 border-4 border-slate-50 rounded-2xl font-bold text-slate-700 outline-none focus:border-brand-blue focus:bg-white transition-all placeholder:text-slate-300" data-v-c7caf915><span class="absolute right-6 top-1/2 -translate-y-1/2 text-2xl grayscale group-focus-within:grayscale-0 transition-all" data-v-c7caf915>🔐</span></div></div>`);
      if (error.value) {
        _push(`<div class="p-4 bg-red-50 border-2 border-red-100 rounded-2xl text-red-500 font-bold text-sm flex items-center gap-3" data-v-c7caf915><span class="text-xl" data-v-c7caf915>⚠️</span> ${ssrInterpolate(error.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="w-full bg-brand-yellow py-5 rounded-2xl font-black text-white text-xl shadow-[0_8px_0_0_#a16207] hover:translate-y-0.5 hover:shadow-[0_6px_0_0_#a16207] active:translate-y-2 active:shadow-none transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-3" data-v-c7caf915>`);
      if (loading.value) {
        _push(`<span class="animate-spin text-2xl" data-v-c7caf915>⏳</span>`);
      } else {
        _push(`<span data-v-c7caf915>Вылупиться! 🐣</span>`);
      }
      _push(`</button></form><div class="relative" data-v-c7caf915><div class="absolute inset-0 flex items-center" aria-hidden="true" data-v-c7caf915><div class="w-full border-t-4 border-slate-50" data-v-c7caf915></div></div><div class="relative flex justify-center text-sm uppercase font-black" data-v-c7caf915><span class="bg-white px-4 text-slate-300 tracking-widest" data-v-c7caf915>Либо через</span></div></div><div class="grid grid-cols-2 gap-4" data-v-c7caf915><button class="flex items-center justify-center gap-3 py-4 bg-white border-4 border-slate-100 rounded-2xl font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm" data-v-c7caf915><img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-6 h-6" alt="Google" data-v-c7caf915> Google </button><button class="flex items-center justify-center gap-3 py-4 bg-white border-4 border-slate-100 rounded-2xl font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm" data-v-c7caf915><img src="https://www.svgrepo.com/show/512317/github-142.svg" class="w-6 h-6" alt="GitHub" data-v-c7caf915> GitHub </button></div></div><p class="text-center font-bold text-slate-500" data-v-c7caf915> Уже есть аккаунт? `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/auth/login",
        class: "text-brand-blue underline decoration-4 underline-offset-4 hover:text-brand-blue/80 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Войти в гнездо`);
          } else {
            return [
              createTextVNode("Войти в гнездо")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const register = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c7caf915"]]);
export {
  register as default
};
//# sourceMappingURL=register-CyUuomtu.js.map
