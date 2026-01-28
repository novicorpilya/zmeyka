import { _ as __nuxt_component_0 } from './nuxt-link-BZfKwrFe.mjs';
import { defineComponent, reactive, ref, mergeProps, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useUserStore, _ as _imports_0 } from './store-CH_y8-jg.mjs';
import { useRouter } from 'vue-router';
import { u as useAuthApi } from './api-DlPk5Kem.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    useUserStore();
    useAuthApi();
    const form = reactive({
      email: "",
      password: ""
    });
    const loading = ref(false);
    const error = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-50" }, _attrs))} data-v-51e6b7c3><div class="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-brand-green/10 rounded-full blur-[100px] animate-pulse" data-v-51e6b7c3></div><div class="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-brand-blue/10 rounded-full blur-[100px] animate-pulse" style="${ssrRenderStyle({ "animation-delay": "2s" })}" data-v-51e6b7c3></div><div class="w-full max-w-lg relative z-10 space-y-8" data-v-51e6b7c3><div class="text-center space-y-4" data-v-51e6b7c3>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "inline-flex items-center gap-2 group"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-cartoon border-2 border-slate-100 group-hover:scale-110 transition-transform" data-v-51e6b7c3${_scopeId}><img${ssrRenderAttr("src", _imports_0)} alt="Zmeyka" class="w-8 h-8 object-contain" data-v-51e6b7c3${_scopeId}></div><span class="text-2xl font-black text-slate-800 tracking-tighter" data-v-51e6b7c3${_scopeId}>Zmeyka</span>`);
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
      _push(`<h1 class="text-4xl font-black text-slate-800 tracking-tight" data-v-51e6b7c3>\u0421 \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0435\u043D\u0438\u0435\u043C!</h1><p class="text-slate-400 font-bold" data-v-51e6b7c3>\u0422\u0432\u043E\u044F \u0417\u043C\u0435\u0439\u043A\u0430 \u0443\u0436\u0435 \u0441\u043E\u0441\u043A\u0443\u0447\u0438\u043B\u0430\u0441\u044C \u{1F40D}</p></div><div class="bg-white p-10 rounded-[3rem] border-4 border-slate-100 shadow-cartoon space-y-8" data-v-51e6b7c3><form class="space-y-6" data-v-51e6b7c3><div class="space-y-2" data-v-51e6b7c3><label class="text-sm font-black text-slate-400 uppercase tracking-widest px-1" data-v-51e6b7c3>Email</label><div class="relative group" data-v-51e6b7c3><input${ssrRenderAttr("value", form.email)} type="email" placeholder="serpent@expert.io" required class="w-full px-6 py-5 bg-slate-50 border-4 border-slate-50 rounded-2xl font-bold text-slate-700 outline-none focus:border-brand-green focus:bg-white transition-all placeholder:text-slate-300" data-v-51e6b7c3><span class="absolute right-6 top-1/2 -translate-y-1/2 text-2xl grayscale group-focus-within:grayscale-0 transition-all" data-v-51e6b7c3>\u{1F4E7}</span></div></div><div class="space-y-2" data-v-51e6b7c3><div class="flex items-center justify-between px-1" data-v-51e6b7c3><label class="text-sm font-black text-slate-400 uppercase tracking-widest" data-v-51e6b7c3>\u041F\u0430\u0440\u043E\u043B\u044C</label>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/auth/forgot",
        class: "text-xs font-black text-brand-green hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u0417\u0430\u0431\u044B\u043B?`);
          } else {
            return [
              createTextVNode("\u0417\u0430\u0431\u044B\u043B?")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="relative group" data-v-51e6b7c3><input${ssrRenderAttr("value", form.password)} type="password" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" required class="w-full px-6 py-5 bg-slate-50 border-4 border-slate-50 rounded-2xl font-bold text-slate-700 outline-none focus:border-brand-blue focus:bg-white transition-all placeholder:text-slate-300" data-v-51e6b7c3><span class="absolute right-6 top-1/2 -translate-y-1/2 text-2xl grayscale group-focus-within:grayscale-0 transition-all" data-v-51e6b7c3>\u{1F511}</span></div></div>`);
      if (error.value) {
        _push(`<div class="p-4 bg-red-50 border-2 border-red-100 rounded-2xl text-red-500 font-bold text-sm flex items-center gap-3" data-v-51e6b7c3><span class="text-xl" data-v-51e6b7c3>\u26A0\uFE0F</span> ${ssrInterpolate(error.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="w-full bg-brand-green py-5 rounded-2xl font-black text-white text-xl shadow-[0_8px_0_0_#166534] hover:translate-y-0.5 hover:shadow-[0_6px_0_0_#166534] active:translate-y-2 active:shadow-none transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-3" data-v-51e6b7c3>`);
      if (loading.value) {
        _push(`<span class="animate-spin text-2xl" data-v-51e6b7c3>\u23F3</span>`);
      } else {
        _push(`<span data-v-51e6b7c3>\u0412\u043E\u0439\u0442\u0438 \u0432 \u0433\u043D\u0435\u0437\u0434\u043E</span>`);
      }
      _push(`</button></form><div class="relative" data-v-51e6b7c3><div class="absolute inset-0 flex items-center" aria-hidden="true" data-v-51e6b7c3><div class="w-full border-t-4 border-slate-50" data-v-51e6b7c3></div></div><div class="relative flex justify-center text-sm uppercase font-black" data-v-51e6b7c3><span class="bg-white px-4 text-slate-300 tracking-widest" data-v-51e6b7c3>\u041B\u0438\u0431\u043E \u0447\u0435\u0440\u0435\u0437</span></div></div><div class="grid grid-cols-2 gap-4" data-v-51e6b7c3><button class="flex items-center justify-center gap-3 py-4 bg-white border-4 border-slate-100 rounded-2xl font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm" data-v-51e6b7c3><img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-6 h-6" alt="Google" data-v-51e6b7c3> Google </button><button class="flex items-center justify-center gap-3 py-4 bg-white border-4 border-slate-100 rounded-2xl font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm" data-v-51e6b7c3><img src="https://www.svgrepo.com/show/512317/github-142.svg" class="w-6 h-6" alt="GitHub" data-v-51e6b7c3> GitHub </button></div></div><p class="text-center font-bold text-slate-500" data-v-51e6b7c3> \u041D\u0435\u0442 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430? `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/auth/register",
        class: "text-brand-green underline decoration-4 underline-offset-4 hover:text-brand-green/80 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u0412\u044B\u043B\u0443\u043F\u0438\u0441\u044C \u043F\u0440\u044F\u043C\u043E \u0441\u0435\u0439\u0447\u0430\u0441!`);
          } else {
            return [
              createTextVNode("\u0412\u044B\u043B\u0443\u043F\u0438\u0441\u044C \u043F\u0440\u044F\u043C\u043E \u0441\u0435\u0439\u0447\u0430\u0441!")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-51e6b7c3"]]);

export { login as default };
//# sourceMappingURL=login-CtnWVBMt.mjs.map
