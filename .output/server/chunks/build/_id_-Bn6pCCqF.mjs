import { _ as __nuxt_component_0 } from './nuxt-link-BZfKwrFe.mjs';
import { defineComponent, withAsyncContext, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useCourseApi } from './index-DbT3jZut.mjs';
import { a as useRoute } from './server.mjs';
import { u as useAsyncData } from './asyncData-C9h_Sj6j.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const { getCourse } = useCourseApi();
    const { data: course, pending } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      `course-${route.params.id}`,
      () => getCourse(route.params.id)
    )), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen py-20 px-6" }, _attrs))}>`);
      if (unref(pending)) {
        _push(`<div class="text-center py-20 animate-bounce text-6xl">\u23F3</div>`);
      } else if (unref(course)) {
        _push(`<div class="max-w-5xl mx-auto space-y-12">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/dashboard",
          class: "inline-flex items-center gap-2 font-black text-brand-green uppercase tracking-widest hover:translate-x-[-5px] transition-transform"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` \u2190 \u041D\u0430\u0437\u0430\u0434 \u043A \u043A\u0443\u0440\u0441\u0430\u043C `);
            } else {
              return [
                createTextVNode(" \u2190 \u041D\u0430\u0437\u0430\u0434 \u043A \u043A\u0443\u0440\u0441\u0430\u043C ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="flex flex-col md:flex-row gap-12 items-start"><div class="flex-grow space-y-8"><div class="space-y-4"><h1 class="text-5xl font-black text-slate-800 leading-tight">${ssrInterpolate(unref(course).title)}</h1><div class="flex items-center gap-4"><div class="px-6 py-2 bg-brand-yellow/20 text-slate-700 rounded-full font-black text-sm uppercase tracking-widest"> \u{1F468}\u200D\u{1F3EB} \u0423\u0447\u0438\u0442\u0435\u043B\u044C: ${ssrInterpolate(((_a = unref(course).teacher) == null ? void 0 : _a.name) || "\u041C\u0430\u0441\u0442\u0435\u0440 \u0417\u043C\u0435\u0439\u043A\u0430")}</div></div></div><div class="aspect-video bg-slate-900 rounded-[3rem] border-8 border-white shadow-cartoon overflow-hidden relative group"><div class="absolute inset-0 bg-brand-green/10 flex items-center justify-center"><div class="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-cartoon group-hover:scale-110 transition-transform cursor-pointer">\u25B6\uFE0F</div></div><p class="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 font-bold uppercase tracking-widest text-xs">\u041F\u043B\u0435\u0435\u0440 \u0417\u043C\u0435\u0439\u043A\u0430 v1.0</p></div><div class="bg-white p-10 rounded-[3rem] border-4 border-slate-100 shadow-cartoon space-y-6"><h2 class="text-2xl font-black text-slate-800 uppercase tracking-tight">\u041E\u0431 \u044D\u0442\u043E\u043C \u043F\u0440\u0438\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0438</h2><p class="text-xl font-bold text-slate-500 leading-relaxed">${ssrInterpolate(unref(course).description)}</p></div></div><aside class="w-full md:w-80 space-y-8"><div class="p-8 bg-brand-green rounded-[3rem] shadow-[0_12px_0_0_#166534] space-y-6 text-white text-center relative overflow-hidden"><div class="relative z-10 space-y-4"><div class="text-5xl">\u2728</div><h3 class="text-xl font-black uppercase tracking-tight">AI \u041F\u043E\u043C\u043E\u0449\u043D\u0438\u043A</h3><p class="font-bold text-white/80 leading-snug">\u0413\u043E\u0442\u043E\u0432 \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0442\u0432\u043E\u044E \u0434\u043E\u043C\u0430\u0448\u043A\u0443 \u043F\u0440\u044F\u043C\u043E \u0441\u0435\u0439\u0447\u0430\u0441!</p><button class="w-full py-4 bg-white text-brand-green rounded-2xl font-black shadow-[0_6px_0_0_#e2e8f0] hover:translate-y-0.5 hover:shadow-[0_4px_0_0_#e2e8f0] transition-all btn-bouncy"> \u0421\u0434\u0430\u0442\u044C \u0440\u0430\u0431\u043E\u0442\u0443 </button></div><div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div></div><div class="p-8 bg-white rounded-[3rem] border-4 border-slate-100 shadow-cartoon space-y-4"><h4 class="font-black text-slate-800 uppercase tracking-widest text-center text-sm">\u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441</h4><div class="h-6 bg-slate-100 rounded-full overflow-hidden p-1"><div class="h-full bg-brand-yellow rounded-full w-1/3 shadow-[inset_0_2px_0_rgba(255,255,255,0.3)]"></div></div><p class="text-center font-black text-slate-400 text-xs tracking-widest uppercase">\u0423\u0440\u043E\u043A 1 \u0438\u0437 3</p></div></aside></div></div>`);
      } else {
        _push(`<div class="text-center py-20 space-y-8"><div class="text-8xl">\u{1F648}</div><h1 class="text-3xl font-black text-slate-800">\u041A\u0443\u0440\u0441 \u043F\u043E\u0442\u0435\u0440\u044F\u043B\u0441\u044F \u0432 \u0442\u0440\u0430\u0432\u0435...</h1>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/dashboard",
          class: "bg-brand-green px-10 py-5 rounded-2xl font-black text-white shadow-cartoon inline-block"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`\u0412\u0435\u0440\u043D\u0443\u0442\u044C\u0441\u044F \u043A\u043E \u0432\u0441\u0435\u043C \u043A\u0443\u0440\u0441\u0430\u043C`);
            } else {
              return [
                createTextVNode("\u0412\u0435\u0440\u043D\u0443\u0442\u044C\u0441\u044F \u043A\u043E \u0432\u0441\u0435\u043C \u043A\u0443\u0440\u0441\u0430\u043C")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/course/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-Bn6pCCqF.mjs.map
