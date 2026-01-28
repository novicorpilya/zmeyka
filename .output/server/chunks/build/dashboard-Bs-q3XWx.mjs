import { _ as __nuxt_component_0 } from './nuxt-link-BZfKwrFe.mjs';
import { defineComponent, withAsyncContext, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { u as useCourseApi } from './index-DbT3jZut.mjs';
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
  __name: "dashboard",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { getCourses } = useCourseApi();
    const { data: courses, pending } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("courses", () => getCourses())), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen py-20 px-6" }, _attrs))}><div class="max-w-7xl mx-auto space-y-12"><div class="flex flex-col md:flex-row items-center justify-between gap-8 bg-white p-10 rounded-[3rem] border-4 border-slate-100 shadow-cartoon"><div class="flex items-center gap-6"><div class="w-20 h-20 bg-brand-green/10 rounded-3xl flex items-center justify-center text-5xl">\u{1F393}</div><div class="space-y-1"><h1 class="text-4xl font-black text-slate-800 tracking-tight">\u041C\u043E\u0451 \u043E\u0431\u0443\u0447\u0435\u043D\u0438\u0435</h1><p class="text-xl font-bold text-slate-400">\u0420\u0430\u0441\u0442\u0438\u043C \u043D\u0430\u0432\u044B\u043A\u0438 \u0432\u043C\u0435\u0441\u0442\u0435 \u0441\u043E \u0417\u043C\u0435\u0439\u043A\u043E\u0439!</p></div></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/course/create",
        class: "bg-brand-blue px-8 py-4 rounded-2xl font-black text-white shadow-[0_6px_0_0_#1e40af] hover:translate-y-0.5 hover:shadow-[0_4px_0_0_#1e40af] transition-all btn-bouncy"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043D\u043E\u0432\u044B\u0439 \u043A\u0443\u0440\u0441 `);
          } else {
            return [
              createTextVNode(" \u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043D\u043E\u0432\u044B\u0439 \u043A\u0443\u0440\u0441 ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid grid-cols-2 lg:grid-cols-4 gap-6"><div class="bg-white p-6 rounded-3xl border-4 border-slate-100 flex items-center gap-4"><div class="w-12 h-12 bg-brand-yellow/20 rounded-2xl flex items-center justify-center text-2xl">\u{1F525}</div><div><div class="text-2xl font-black text-slate-800">5</div><div class="text-sm font-bold text-slate-400">\u0414\u043D\u0435\u0439 \u043F\u043E\u0434\u0440\u044F\u0434</div></div></div><div class="bg-white p-6 rounded-3xl border-4 border-slate-100 flex items-center gap-4"><div class="w-12 h-12 bg-brand-green/20 rounded-2xl flex items-center justify-center text-2xl">\u{1F3C6}</div><div><div class="text-2xl font-black text-slate-800">${ssrInterpolate(((_a = unref(courses)) == null ? void 0 : _a.length) || 0)}</div><div class="text-sm font-bold text-slate-400">\u041A\u0443\u0440\u0441\u043E\u0432 \u043F\u0440\u043E\u0439\u0434\u0435\u043D\u043E</div></div></div><div class="bg-white p-6 rounded-3xl border-4 border-slate-100 flex items-center gap-4"><div class="w-12 h-12 bg-brand-blue/20 rounded-2xl flex items-center justify-center text-2xl">\u2728</div><div><div class="text-2xl font-black text-slate-800">120</div><div class="text-sm font-bold text-slate-400">\u041E\u0447\u043A\u043E\u0432 \u043E\u043F\u044B\u0442\u0430</div></div></div><div class="bg-white p-6 rounded-3xl border-4 border-slate-100 flex items-center gap-4"><div class="w-12 h-12 bg-brand-orange/20 rounded-2xl flex items-center justify-center text-2xl">\u{1F3C5}</div><div><div class="text-2xl font-black text-slate-800">3</div><div class="text-sm font-bold text-slate-400">\u0414\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u044F</div></div></div></div><div class="space-y-8"><h2 class="text-3xl font-black text-slate-800 flex items-center gap-3"> \u{1F4DA} \u0414\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0435 \u043F\u0440\u0438\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F </h2><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">`);
      if (unref(pending)) {
        _push(`<div class="col-span-full py-20 text-center space-y-4"><div class="text-5xl animate-bounce">\u23F3</div><div class="text-xl font-bold text-slate-400 tracking-widest uppercase">\u0417\u043C\u0435\u0439\u043A\u0430 \u0438\u0449\u0435\u0442 \u043A\u0443\u0440\u0441\u044B...</div></div>`);
      } else if (!((_b = unref(courses)) == null ? void 0 : _b.length)) {
        _push(`<div class="col-span-full py-24 text-center bg-white rounded-[3rem] border-4 border-dashed border-slate-100 space-y-6"><div class="text-6xl">\u{1F634}</div><p class="text-2xl font-black text-slate-400">\u041F\u043E\u043A\u0430 \u0442\u0443\u0442 \u043F\u0443\u0441\u0442\u043E.. \u0421\u0430\u043C\u043E\u0435 \u0432\u0440\u0435\u043C\u044F \u0441\u043E\u0437\u0434\u0430\u0442\u044C \u043F\u0435\u0440\u0432\u044B\u0439 \u043A\u0443\u0440\u0441!</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/course/create",
          class: "inline-block text-brand-green font-black underline decoration-4 underline-offset-8"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043F\u0440\u0438\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u2192`);
            } else {
              return [
                createTextVNode("\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043F\u0440\u0438\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u2192")
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
        var _a2;
        _push(`<div class="bg-white p-2 rounded-[3rem] border-4 border-slate-100 hover:border-brand-green hover:shadow-[0_15px_0_0_#dcfce7] transition-all group overflow-hidden"><div class="p-8 space-y-6"><div class="w-16 h-16 bg-brand-green/10 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">\u{1F4D7}</div><div class="space-y-2"><h3 class="text-2xl font-black text-slate-800 group-hover:text-brand-green transition-colors line-clamp-2">${ssrInterpolate(course.title)}</h3><p class="font-bold text-slate-400 line-clamp-2">${ssrInterpolate(course.description)}</p></div><div class="pt-4 flex items-center justify-between border-t-4 border-slate-50"><div class="flex items-center gap-2"><div class="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-sm">\u{1F468}\u200D\u{1F3EB}</div><span class="text-sm font-black text-slate-400 uppercase tracking-wider">${ssrInterpolate(((_a2 = course.teacher) == null ? void 0 : _a2.name) || "\u0410\u043D\u043E\u043D\u0438\u043C")}</span></div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/course/${course.id}`,
          class: "bg-brand-orange text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_4px_0_0_#9a3412] active:translate-y-1 active:shadow-none transition-all"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` \u{1F680} `);
            } else {
              return [
                createTextVNode(" \u{1F680} ")
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

export { _sfc_main as default };
//# sourceMappingURL=dashboard-Bs-q3XWx.mjs.map
