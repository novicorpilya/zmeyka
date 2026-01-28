import { _ as __nuxt_component_0 } from './nuxt-link-BZfKwrFe.mjs';
import { defineComponent, ref, mergeProps, withCtx, createVNode, unref, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { u as useUserStore, _ as _imports_0 } from './store-CH_y8-jg.mjs';
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
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const userStore = useUserStore();
    const scrolled = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "selection:bg-brand-green/30 relative min-h-screen flex flex-col" }, _attrs))}><nav class="sticky top-0 z-50 transition-all duration-700 ease-in-out px-4 py-4 pointer-events-none"><div class="${ssrRenderClass([scrolled.value ? "bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/50" : "bg-transparent", "max-w-7xl mx-auto px-6 py-3 flex items-center justify-between transition-all duration-500 ease-in-out pointer-events-auto"])}">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-3 group text-decoration-none focus:outline-none"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center transition-all group-hover:scale-110"${_scopeId}><img${ssrRenderAttr("src", _imports_0)} alt="\u0417\u043C\u0435\u0439\u043A\u0430 \u041B\u043E\u0433\u043E\u0442\u0438\u043F" class="w-full h-full object-contain filter drop-shadow-sm"${_scopeId}></div><span class="text-xl md:text-2xl font-black tracking-tight text-slate-800 uppercase group-hover:text-brand-green transition-colors"${_scopeId}>\u0417\u043C\u0435\u0439\u043A\u0430</span>`);
          } else {
            return [
              createVNode("div", { class: "w-10 h-10 md:w-11 md:h-11 flex items-center justify-center transition-all group-hover:scale-110" }, [
                createVNode("img", {
                  src: _imports_0,
                  alt: "\u0417\u043C\u0435\u0439\u043A\u0430 \u041B\u043E\u0433\u043E\u0442\u0438\u043F",
                  class: "w-full h-full object-contain filter drop-shadow-sm"
                })
              ]),
              createVNode("span", { class: "text-xl md:text-2xl font-black tracking-tight text-slate-800 uppercase group-hover:text-brand-green transition-colors" }, "\u0417\u043C\u0435\u0439\u043A\u0430")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="hidden md:flex items-center gap-1 bg-white/30 backdrop-blur-sm p-1 rounded-2xl border border-white/20 shadow-sm"><!--[-->`);
      ssrRenderList([
        { id: "features", text: "\u041F\u0440\u0435\u0438\u043C\u0443\u0449\u0435\u0441\u0442\u0432\u0430", color: "brand-green" },
        { id: "process", text: "\u041A\u0430\u043A \u044D\u0442\u043E \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442", color: "brand-blue" },
        { id: "pricing", text: "\u0426\u0435\u043D\u044B", color: "brand-orange" },
        { id: "faq", text: "FAQ", color: "brand-yellow" }
      ], (link) => {
        _push(`<a href="javascript:void(0)" class="${ssrRenderClass([[`hover:text-${link.color}`], "px-5 py-2 rounded-xl text-slate-600 font-bold hover:bg-white transition-all text-sm whitespace-nowrap"])}">${ssrInterpolate(link.text)}</a>`);
      });
      _push(`<!--]--></div><div class="flex items-center gap-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(userStore).isLoggedIn ? "/dashboard" : "/auth/login",
        class: "bg-brand-green px-6 py-2.5 rounded-2xl font-black text-white text-sm shadow-[0_5px_0_0_#166534] hover:translate-y-0.5 hover:shadow-none transition-all btn-bouncy text-decoration-none"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(userStore).isLoggedIn ? "\u0412 \u043A\u0430\u0431\u0438\u043D\u0435\u0442" : "\u0412\u043E\u0439\u0442\u0438")}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(userStore).isLoggedIn ? "\u0412 \u043A\u0430\u0431\u0438\u043D\u0435\u0442" : "\u0412\u043E\u0439\u0442\u0438"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></nav><main>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main><footer class="bg-white border-t-4 border-slate-100 pt-24 pb-12 px-6 mt-32 relative overflow-hidden"><div class="absolute top-0 left-0 w-64 h-64 bg-brand-green/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div><div class="absolute bottom-0 right-0 w-80 h-80 bg-brand-yellow/5 rounded-full blur-3xl translate-y-1/3 translate-x-1/3 pointer-events-none"></div><div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10"><div class="md:col-span-4 space-y-6"><div class="flex items-center gap-3"><div class="w-12 h-12 flex items-center justify-center"><img${ssrRenderAttr("src", _imports_0)} alt="Logo" class="w-full h-full object-contain"></div><span class="text-2xl font-black text-slate-800 uppercase">\u0417\u043C\u0435\u0439\u043A\u0430</span></div><p class="text-slate-500 font-bold leading-relaxed max-w-sm"> \u041C\u044B \u0432\u0435\u0440\u0438\u043C, \u0447\u0442\u043E \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u2014 \u044D\u0442\u043E \u0442\u0432\u043E\u0440\u0447\u0435\u0441\u0442\u0432\u043E, \u0430 \u043D\u0435 \u0437\u0443\u0431\u0440\u0435\u0436\u043A\u0430. \u041D\u0430\u0448 \u0418\u0418-\u043F\u043E\u043C\u043E\u0449\u043D\u0438\u043A \u0434\u0435\u043B\u0430\u0435\u0442 \u043E\u0431\u0443\u0447\u0435\u043D\u0438\u0435 \u0442\u0430\u043A\u0438\u043C \u0436\u0435 \u0443\u0432\u043B\u0435\u043A\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u043C, \u043A\u0430\u043A \u043B\u044E\u0431\u0438\u043C\u0430\u044F \u0438\u0433\u0440\u0430. </p><div class="flex gap-4 pt-4"><a href="#" class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl hover:bg-brand-blue hover:text-white hover:rotate-6 transition-all shadow-sm border-2 border-slate-100">\u2708\uFE0F</a><a href="#" class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl hover:bg-pink-500 hover:text-white hover:-rotate-6 transition-all shadow-sm border-2 border-slate-100">\u{1F4F8}</a><a href="#" class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl hover:bg-brand-orange hover:text-white hover:rotate-6 transition-all shadow-sm border-2 border-slate-100">\u{1F431}</a></div></div><div class="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8"><div><h4 class="font-black text-slate-800 mb-6 uppercase tracking-wider text-sm">\u041D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044F</h4><ul class="space-y-4 font-bold text-slate-500"><li><a href="javascript:void(0)" class="hover:text-brand-green transition-colors">\u041F\u0440\u0435\u0438\u043C\u0443\u0449\u0435\u0441\u0442\u0432\u0430</a></li><li><a href="javascript:void(0)" class="hover:text-brand-green transition-colors">\u041A\u0430\u043A \u044D\u0442\u043E \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442</a></li><li><a href="javascript:void(0)" class="hover:text-brand-green transition-colors">\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C</a></li><li><a href="javascript:void(0)" class="hover:text-brand-green transition-colors">\u0412\u043E\u043F\u0440\u043E\u0441\u044B</a></li></ul></div><div><h4 class="font-black text-slate-800 mb-6 uppercase tracking-wider text-sm">\u041F\u0440\u043E\u0434\u0443\u043A\u0442</h4><ul class="space-y-4 font-bold text-slate-500"><li><a href="#" class="hover:text-brand-blue transition-colors">\u0414\u043B\u044F \u0448\u043A\u043E\u043B (B2B)</a></li><li><a href="#" class="hover:text-brand-blue transition-colors">\u0421\u0435\u0440\u0442\u0438\u0444\u0438\u043A\u0430\u0446\u0438\u044F</a></li><li><a href="#" class="hover:text-brand-blue transition-colors">\u041A\u0430\u0440\u044C\u0435\u0440\u0430</a></li><li><span class="inline-flex items-center gap-2 px-3 py-1 bg-brand-green/10 text-brand-green text-xs rounded-full">Coming Soon</span></li></ul></div><div><h4 class="font-black text-slate-800 mb-6 uppercase tracking-wider text-sm">\u041F\u0440\u0430\u0432\u043E\u0432\u043E\u0435</h4><ul class="space-y-4 font-bold text-slate-500"><li><a href="#" class="hover:text-slate-800 transition-colors">\u041E\u0444\u0435\u0440\u0442\u0430</a></li><li><a href="#" class="hover:text-slate-800 transition-colors">\u041F\u0440\u0438\u0432\u0430\u0442\u043D\u043E\u0441\u0442\u044C</a></li><li><a href="#" class="hover:text-slate-800 transition-colors">Cookie Policy</a></li></ul></div></div></div><div class="max-w-7xl mx-auto mt-20 pt-10 border-t-2 border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 text-sm font-bold text-slate-400"><div>\xA9 2026 \u0417\u043C\u0435\u0439\u043A\u0430 \u041F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0430. All rights reserved.</div><div class="group relative px-6 py-3 rounded-full bg-white/40 backdrop-blur-md border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-[0_8px_32px_0_rgba(34,197,94,0.15)] transition-all duration-500 hover:-translate-y-1 cursor-none-container overflow-hidden flex items-center gap-3"><div class="absolute -inset-x-10 inset-y-0 bg-gradient-to-r from-transparent via-brand-green/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div><span class="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">From</span><span class="relative"><span class="text-lg font-black tracking-tighter drop-shadow-sm text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-600 group-hover:from-brand-green group-hover:to-brand-blue transition-all duration-500">Ilai</span><div class="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-green to-brand-blue group-hover:w-full transition-all duration-500 rounded-full"></div></span><span class="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">with</span><div class="relative flex items-center justify-center"><span class="text-xl animate-pulse group-hover:scale-125 transition-transform duration-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]">\u2764\uFE0F</span><div class="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity"><span class="text-[8px] animate-ping text-yellow-400">\u2728</span></div></div></div></div></footer></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-CM3-06VH.mjs.map
