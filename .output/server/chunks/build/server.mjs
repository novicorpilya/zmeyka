import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { defineComponent, shallowRef, getCurrentInstance, provide, cloneVNode, h, createElementBlock, ref, mergeProps, withCtx, renderSlot, unref, createTextVNode, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, hasInjectionContext, inject, computed, resolveComponent, defineAsyncComponent, shallowReactive, Suspense, Fragment, useSSRContext, createApp, watch, nextTick, onErrorCaptured, onServerPrefetch, resolveDynamicComponent, reactive, effectScope, getCurrentScope, toRef, isReadonly, toRaw, isRef, isShallow, isReactive } from 'vue';
import { m as klona, i as createError$1, n as hasProtocol, o as isScriptProtocol, l as joinURL, p as parseQuery, q as parse, r as getRequestHeader, d as destr, v as isEqual, w as withQuery, x as sanitizeStatusCode, y as setCookie, z as getCookie, A as deleteCookie, B as getContext, C as withTrailingSlash, D as withoutTrailingSlash, $ as $fetch, E as createHooks, F as defu, G as executeAsync } from '../_/nitro.mjs';
import { u as useSeoMeta$1, a as useHead$1, h as headSymbol, b as baseURL } from '../routes/renderer.mjs';
import { defineStore, createPinia, setActivePinia, shouldHydrate } from 'pinia';
import { useRoute as useRoute$1, RouterView, createMemoryHistory, createRouter, START_LOCATION } from 'vue-router';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrRenderSuspense, ssrRenderVNode } from 'vue/server-renderer';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const appLayoutTransition = {};
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const asyncDataDefaults = { "value": null, "errorValue": null, "deep": true };
const nuxtDefaultErrorValue = null;
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.21.0";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...options.ssrContext?.payload || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  let error = void 0;
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    const unresolvedPluginsForThisPlugin = plugin2.dependsOn?.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name)) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.add(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      }).catch((e) => {
        if (!plugin2.parallel && !nuxtApp.payload.error) {
          throw e;
        }
        error ||= e;
      });
      if (plugin2.parallel) {
        parallels.push(promise);
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (error) {
    throw nuxtApp.payload.error || error;
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
const definePayloadPlugin = defineNuxtPlugin;
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const LayoutMetaSymbol = /* @__PURE__ */ Symbol("layout-meta");
const PageRouteSymbol = /* @__PURE__ */ Symbol("route");
globalThis._importMeta_.url.replace(/\/app\/.*$/, "/");
const useRouter = () => {
  return useNuxtApp()?.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext["~renderResponse"] = {
          statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return options?.replace ? router.replace(to) : router.push(to);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = /* @__NO_SIDE_EFFECTS__ */ () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const error2 = /* @__PURE__ */ useError();
    if (false) ;
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const clearError = async (options = {}) => {
  const nuxtApp = useNuxtApp();
  const error = /* @__PURE__ */ useError();
  nuxtApp.callHook("app:error:cleared", options);
  if (options.redirect) {
    await useRouter().replace(options.redirect);
  }
  error.value = nuxtDefaultErrorValue;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  if (typeof error !== "string" && error.statusText) {
    error.message ??= error.statusText;
  }
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
function injectHead(nuxtApp) {
  const nuxt = nuxtApp || tryUseNuxtApp();
  return nuxt?.ssrContext?.head || nuxt?.runWithContext(() => {
    if (hasInjectionContext()) {
      return inject(headSymbol);
    }
  });
}
function useHead(input, options = {}) {
  const head = injectHead(options.nuxt);
  if (head) {
    return useHead$1(input, { head, ...options });
  }
}
function useSeoMeta(input, options = {}) {
  const head = injectHead(options.nuxt);
  if (head) {
    return useSeoMeta$1(input, { head, ...options });
  }
}
const matcher = (m, p) => {
  return [];
};
const _routeRulesMatcher = (path) => defu({}, ...matcher().map((r) => r.data).reverse());
const routeRulesMatcher$1 = _routeRulesMatcher;
function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  try {
    return routeRulesMatcher$1(path);
  } catch (e) {
    console.error("[nuxt] Error matching route rules.", e);
    return {};
  }
}
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext["~payloadReducers"][name] = reduce;
  }
}
const payloadPlugin = definePayloadPlugin(() => {
  definePayloadReducer(
    "skipHydrate",
    // We need to return something truthy to be treated as a match
    (data) => !shouldHydrate(data) && 1
  );
});
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    nuxtApp.vueApp.use(head);
  }
});
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
const __nuxt_page_meta$i = {
  layout: "default"
};
const __nuxt_page_meta$h = {
  layout: false
};
const __nuxt_page_meta$g = {
  layout: "app"
};
const __nuxt_page_meta$f = {
  layout: "default"
};
const __nuxt_page_meta$e = {
  layout: "default"
};
const __nuxt_page_meta$d = {
  layout: false
};
const __nuxt_page_meta$c = {
  layout: "app"
};
const __nuxt_page_meta$b = {
  layout: "app"
};
const __nuxt_page_meta$a = {
  layout: "app"
};
const __nuxt_page_meta$9 = { layout: "app" };
const __nuxt_page_meta$8 = {
  layout: "app"
};
const __nuxt_page_meta$7 = {
  layout: "app"
};
const __nuxt_page_meta$6 = { layout: "app" };
const __nuxt_page_meta$5 = {
  layout: false
  // Custom high-end layout
};
const __nuxt_page_meta$4 = {
  layout: false
};
const __nuxt_page_meta$3 = {
  layout: false
};
const __nuxt_page_meta$2 = {
  layout: "app"
};
const __nuxt_page_meta$1 = {
  layout: false
};
const __nuxt_page_meta = { layout: false };
const _routes = [
  {
    name: "index",
    path: "/",
    meta: __nuxt_page_meta$i || {},
    component: () => import('./index-9kDnFfZf.mjs')
  },
  {
    name: "login",
    path: "/login",
    meta: { ...__nuxt_page_meta$h || {}, ...{ "middleware": ["guest"] } },
    component: () => import('./login-Zjj7AUux.mjs')
  },
  {
    name: "tasks",
    path: "/tasks",
    meta: { ...__nuxt_page_meta$g || {}, ...{ "middleware": ["auth"] } },
    component: () => import('./tasks-BO5C5_73.mjs')
  },
  {
    name: "terms",
    path: "/terms",
    meta: __nuxt_page_meta$f || {},
    component: () => import('./terms-DNjYKqZM.mjs')
  },
  {
    name: "privacy",
    path: "/privacy",
    meta: __nuxt_page_meta$e || {},
    component: () => import('./privacy-Cuu8SjRC.mjs')
  },
  {
    name: "register",
    path: "/register",
    meta: { ...__nuxt_page_meta$d || {}, ...{ "middleware": ["guest"] } },
    component: () => import('./register-CtVKdFOQ.mjs')
  },
  {
    name: "settings",
    path: "/settings",
    meta: { ...__nuxt_page_meta$c || {}, ...{ "middleware": ["auth"] } },
    component: () => import('./settings-rbMu-twu.mjs')
  },
  {
    name: "analytics",
    path: "/analytics",
    meta: { ...__nuxt_page_meta$b || {}, ...{ "middleware": ["auth"] } },
    component: () => import('./analytics-CYZY45a4.mjs')
  },
  {
    name: "dashboard",
    path: "/dashboard",
    meta: { ...__nuxt_page_meta$a || {}, ...{ "middleware": ["auth"] } },
    component: () => import('./dashboard-CJ3jJS3w.mjs'),
    children: [
      {
        name: "dashboard-ui-StudentDashboard",
        path: "ui/StudentDashboard",
        component: () => import('./StudentDashboard-CUBdfw0R.mjs').then((n) => n.S)
      },
      {
        name: "dashboard-ui-TeacherDashboard",
        path: "ui/TeacherDashboard",
        component: () => import('./TeacherDashboard-UhMGY7Ot.mjs')
      }
    ]
  },
  {
    name: "courses-id",
    path: "/courses/:id()",
    meta: { ...__nuxt_page_meta$9 || {}, ...{ "middleware": ["auth"] } },
    component: () => import('./_id_-CKtuDEC7.mjs')
  },
  {
    name: "teacher-id",
    path: "/teacher/:id()",
    meta: __nuxt_page_meta$8 || {},
    component: () => import('./_id_-BN8SFrd3.mjs')
  },
  {
    name: "courses",
    path: "/courses",
    meta: { ...__nuxt_page_meta$7 || {}, ...{ "middleware": ["auth"] } },
    component: () => import('./index-BsLFopo8.mjs')
  },
  {
    name: "homework-id",
    path: "/homework/:id()",
    meta: { ...__nuxt_page_meta$6 || {}, ...{ "middleware": ["auth"] } },
    component: () => import('./_id_-DhflFC5n.mjs')
  },
  {
    name: "courses-create",
    path: "/courses/create",
    meta: { ...__nuxt_page_meta$5 || {}, ...{ "middleware": ["auth"] } },
    component: () => import('./create-CTVxdFZG.mjs')
  },
  {
    name: "reset-password",
    path: "/reset-password",
    meta: __nuxt_page_meta$4 || {},
    component: () => import('./reset-password-Cd1JLuOf.mjs')
  },
  {
    name: "forgot-password",
    path: "/forgot-password",
    meta: __nuxt_page_meta$3 || {},
    component: () => import('./forgot-password-CcN6WPil.mjs')
  },
  {
    name: "teacher-profile",
    path: "/teacher/profile",
    meta: { ...__nuxt_page_meta$2 || {}, ...{ "middleware": ["auth"] } },
    component: () => import('./profile-BmIC2XXD.mjs')
  },
  {
    name: "payments-checkout",
    path: "/payments/checkout",
    meta: { ...__nuxt_page_meta$1 || {}, ...{ "middleware": ["auth"] } },
    component: () => import('./checkout-B3Kgj1cx.mjs')
  },
  {
    name: "courses-builder-id",
    path: "/courses/builder/:id()",
    meta: { ...__nuxt_page_meta || {}, ...{ "middleware": ["auth"] } },
    component: () => import('./_id_-B-_J3SIh.mjs')
  }
];
const _wrapInTransition = (props, children) => {
  return { default: () => children.default?.() };
};
const ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
  const source = route?.meta.key ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => route.params[r.slice(1)]?.toString() || "");
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index) => comp.components && comp.components.default === from.matched[index]?.components?.default
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    const hashScrollBehaviour = useRouter().options?.scrollBehaviorType ?? "auto";
    if (to.path.replace(/\/$/, "") === from.path.replace(/\/$/, "")) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior: hashScrollBehaviour };
      }
      return false;
    }
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (routeAllowsScrollToTop === false) {
      return false;
    }
    const hookToWait = nuxtApp._runningTransition ? "page:transition:finish" : "page:loading:end";
    return new Promise((resolve) => {
      if (from === START_LOCATION) {
        resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour));
        return;
      }
      nuxtApp.hooks.hookOnce(hookToWait, () => {
        requestAnimationFrame(() => resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour)));
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
    }
  } catch {
  }
  return 0;
}
function _calculatePosition(to, from, savedPosition, defaultHashScrollBehaviour) {
  if (savedPosition) {
    return savedPosition;
  }
  const isPageNavigation = isChangingPage(to, from);
  if (to.hash) {
    return {
      el: to.hash,
      top: _getHashElementScrollMarginTop(to.hash),
      behavior: isPageNavigation ? defaultHashScrollBehaviour : "instant"
    };
  }
  return {
    left: 0,
    top: 0
  };
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to, from) => {
  let __temp, __restore;
  if (!to.meta?.validate) {
    return;
  }
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  const error = createError({
    fatal: false,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    status: result && (result.status || result.statusCode) || 404,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    statusText: result && (result.statusText || result.statusMessage) || `Page Not Found: ${to.fullPath}`,
    data: {
      path: to.fullPath
    }
  });
  return error;
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware((to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  manifest_45route_45rule
];
const namedMiddleware = {
  auth: () => import('./auth-45efFi6T.mjs'),
  guest: () => import('./guest--vCGqYpy.mjs')
};
const plugin$1 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const history = routerOptions.history?.(routerBase) ?? createMemoryHistory(routerBase);
    const routes = routerOptions.routes ? ([__temp, __restore] = executeAsync(() => routerOptions.routes(_routes)), __temp = await __temp, __restore(), __temp) ?? _routes : _routes;
    let startPosition;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (void 0).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (void 0).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = shallowRef(router.currentRoute.value);
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    router.afterEach((to, from) => {
      if (to.matched.at(-1)?.components?.default === from.matched.at(-1)?.components?.default) {
        syncCurrentRoute();
      }
    });
    const route = { sync: syncCurrentRoute };
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key],
        enumerable: true
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware ||= {
      global: [],
      named: {}
    };
    if (!nuxtApp.ssrContext?.islandContext) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if (failure?.type === 4) {
          return;
        }
        if (to.redirectedFrom && to.fullPath !== initialURL) {
          await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
        }
      });
    }
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const resolvedInitialRoute = router.currentRoute.value;
    syncCurrentRoute();
    if (nuxtApp.ssrContext?.islandContext) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!nuxtApp.ssrContext?.islandContext) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        const routeRules = getRouteRules({ path: to.path });
        if (routeRules.appMiddleware) {
          for (const key in routeRules.appMiddleware) {
            if (routeRules.appMiddleware[key]) {
              middlewareEntries.add(key);
            } else {
              middlewareEntries.delete(key);
            }
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await namedMiddleware[entry2]?.().then((r) => r.default || r) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          try {
            if (false) ;
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            if (true) {
              if (result === false || result instanceof Error) {
                const error2 = result || createError({
                  status: 404,
                  statusText: `Page Not Found: ${initialURL}`
                });
                await nuxtApp.runWithContext(() => showError(error2));
                return false;
              }
            }
            if (result === true) {
              continue;
            }
            if (result === false) {
              return result;
            }
            if (result) {
              if (isNuxtError(result) && result.fatal) {
                await nuxtApp.runWithContext(() => showError(result));
              }
              return result;
            }
          } catch (err) {
            const error2 = createError(err);
            if (error2.fatal) {
              await nuxtApp.runWithContext(() => showError(error2));
            }
            return error2;
          }
        }
      }
    });
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach((to) => {
      if (to.matched.length === 0) {
        return nuxtApp.runWithContext(() => showError(createError({
          status: 404,
          fatal: false,
          statusText: `Page not found: ${to.fullPath}`,
          data: {
            path: to.fullPath
          }
        })));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        if ("name" in resolvedInitialRoute) {
          resolvedInitialRoute.name = void 0;
        }
        await router.replace({
          ...resolvedInitialRoute,
          force: true
        });
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = /* @__PURE__ */ Symbol.for("nuxt:client-only");
const __nuxt_component_1$1 = defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      if (mounted.value) {
        const vnodes = slots.default?.();
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
function useRequestEvent(nuxtApp) {
  nuxtApp ||= useNuxtApp();
  return nuxtApp.ssrContext?.event;
}
const CookieDefaults = {
  path: "/",
  watch: true,
  decode: (val) => {
    const decoded = decodeURIComponent(val);
    const parsed = destr(decoded);
    if (typeof parsed === "number" && (!Number.isFinite(parsed) || String(parsed) !== decoded)) {
      return decoded;
    }
    return parsed;
  },
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  const opts = { ...CookieDefaults, ..._opts };
  opts.filter ??= (key) => key === name;
  const cookies = readRawCookies(opts) || {};
  let delay;
  if (opts.maxAge !== void 0) {
    delay = opts.maxAge * 1e3;
  } else if (opts.expires) {
    delay = opts.expires.getTime() - Date.now();
  }
  const hasExpired = delay !== void 0 && delay <= 0;
  const cookieValue = klona(hasExpired ? void 0 : cookies[name] ?? opts.default?.());
  const cookie = ref(cookieValue);
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      if (opts.readonly || isEqual(cookie.value, cookies[name])) {
        return;
      }
      nuxtApp._cookies ||= {};
      if (name in nuxtApp._cookies) {
        if (isEqual(cookie.value, nuxtApp._cookies[name])) {
          return;
        }
      }
      nuxtApp._cookies[name] = cookie.value;
      writeServerCookie(useRequestEvent(nuxtApp), name, cookie.value, opts);
    };
    const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:error", () => {
      unhook();
      return writeFinalCookieValue();
    });
  }
  return cookie;
}
function readRawCookies(opts = {}) {
  {
    return parse(getRequestHeader(useRequestEvent(), "cookie") || "", opts);
  }
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    if (value !== null && value !== void 0) {
      return setCookie(event, name, value, opts);
    }
    if (getCookie(event, name) !== void 0) {
      return deleteCookie(event, name, opts);
    }
  }
}
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
// @__NO_SIDE_EFFECTS__
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  function isHashLinkWithoutHashMode(link) {
    return typeof link === "string" && link.startsWith("#");
  }
  function resolveTrailingSlashBehavior(to, resolve, trailingSlash) {
    const effectiveTrailingSlash = trailingSlash ?? options.trailingSlash;
    if (!to || effectiveTrailingSlash !== "append" && effectiveTrailingSlash !== "remove") {
      return to;
    }
    if (typeof to === "string") {
      return applyTrailingSlashBehavior(to, effectiveTrailingSlash);
    }
    const path = "path" in to && to.path !== void 0 ? to.path : resolve(to).path;
    const resolvedPath = {
      ...to,
      name: void 0,
      // named routes would otherwise always override trailing slash behavior
      path: applyTrailingSlashBehavior(path, effectiveTrailingSlash)
    };
    return resolvedPath;
  }
  function useNuxtLink(props) {
    const router = useRouter();
    const config = /* @__PURE__ */ useRuntimeConfig();
    const hasTarget = computed(() => !!props.target && props.target !== "_self");
    const isAbsoluteUrl = computed(() => {
      const path = props.to || props.href || "";
      return typeof path === "string" && hasProtocol(path, { acceptRelative: true });
    });
    const builtinRouterLink = resolveComponent("RouterLink");
    const useBuiltinLink = builtinRouterLink && typeof builtinRouterLink !== "string" ? builtinRouterLink.useLink : void 0;
    const isExternal = computed(() => {
      if (props.external) {
        return true;
      }
      const path = props.to || props.href || "";
      if (typeof path === "object") {
        return false;
      }
      return path === "" || isAbsoluteUrl.value;
    });
    const to = computed(() => {
      const path = props.to || props.href || "";
      if (isExternal.value) {
        return path;
      }
      return resolveTrailingSlashBehavior(path, router.resolve, props.trailingSlash);
    });
    const link = isExternal.value ? void 0 : useBuiltinLink?.({ ...props, to });
    const href = computed(() => {
      const effectiveTrailingSlash = props.trailingSlash ?? options.trailingSlash;
      if (!to.value || isAbsoluteUrl.value || isHashLinkWithoutHashMode(to.value)) {
        return to.value;
      }
      if (isExternal.value) {
        const path = typeof to.value === "object" && "path" in to.value ? resolveRouteObject(to.value) : to.value;
        const href2 = typeof path === "object" ? router.resolve(path).href : path;
        return applyTrailingSlashBehavior(href2, effectiveTrailingSlash);
      }
      if (typeof to.value === "object") {
        return router.resolve(to.value)?.href ?? null;
      }
      return applyTrailingSlashBehavior(joinURL(config.app.baseURL, to.value), effectiveTrailingSlash);
    });
    return {
      to,
      hasTarget,
      isAbsoluteUrl,
      isExternal,
      //
      href,
      isActive: link?.isActive ?? computed(() => to.value === router.currentRoute.value.path),
      isExactActive: link?.isExactActive ?? computed(() => to.value === router.currentRoute.value.path),
      route: link?.route ?? computed(() => router.resolve(to.value)),
      async navigate(_e) {
        await navigateTo(href.value, { replace: props.replace, external: isExternal.value || hasTarget.value });
      }
    };
  }
  return defineComponent({
    name: componentName,
    props: {
      // Routing
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      // Attributes
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Prefetching
      prefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      prefetchOn: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      noPrefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Styling
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      prefetchedClass: {
        type: String,
        default: void 0,
        required: false
      },
      // Vue Router's `<RouterLink>` additional props
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      // Edge cases handling
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Slot API
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Behavior
      trailingSlash: {
        type: String,
        default: void 0,
        required: false
      }
    },
    useLink: useNuxtLink,
    setup(props, { slots }) {
      const router = useRouter();
      const { to, href, navigate, isExternal, hasTarget, isAbsoluteUrl } = useNuxtLink(props);
      shallowRef(false);
      const el = void 0;
      const elRef = void 0;
      async function prefetch(nuxtApp = useNuxtApp()) {
        {
          return;
        }
      }
      return () => {
        if (!isExternal.value && !hasTarget.value && !isHashLinkWithoutHashMode(to.value)) {
          const routerLinkProps = {
            ref: elRef,
            to: to.value,
            activeClass: props.activeClass || options.activeClass,
            exactActiveClass: props.exactActiveClass || options.exactActiveClass,
            replace: props.replace,
            ariaCurrentValue: props.ariaCurrentValue,
            custom: props.custom
          };
          if (!props.custom) {
            routerLinkProps.rel = props.rel || void 0;
          }
          return h(
            resolveComponent("RouterLink"),
            routerLinkProps,
            slots.default
          );
        }
        const target = props.target || null;
        const rel = firstNonUndefined(
          // converts `""` to `null` to prevent the attribute from being added as empty (`rel=""`)
          props.noRel ? "" : props.rel,
          options.externalRelAttribute,
          /*
          * A fallback rel of `noopener noreferrer` is applied for external links or links that open in a new tab.
          * This solves a reverse tabnapping security flaw in browsers pre-2021 as well as improving privacy.
          */
          isAbsoluteUrl.value || hasTarget.value ? "noopener noreferrer" : ""
        ) || null;
        if (props.custom) {
          if (!slots.default) {
            return null;
          }
          return slots.default({
            href: href.value,
            navigate,
            prefetch,
            get route() {
              if (!href.value) {
                return void 0;
              }
              const url = new URL(href.value, "http://localhost");
              return {
                path: url.pathname,
                fullPath: url.pathname,
                get query() {
                  return parseQuery(url.search);
                },
                hash: url.hash,
                params: {},
                name: void 0,
                matched: [],
                redirectedFrom: void 0,
                meta: {},
                href: href.value
              };
            },
            rel,
            target,
            isExternal: isExternal.value || hasTarget.value,
            isActive: false,
            isExactActive: false
          });
        }
        return h("a", {
          ref: el,
          href: href.value || null,
          // converts `""` to `null` to prevent the attribute from being added as empty (`href=""`)
          rel,
          target,
          onClick: (event) => {
            if (isExternal.value || hasTarget.value) {
              return;
            }
            event.preventDefault();
            return props.replace ? router.replace(href.value) : router.push(href.value);
          }
        }, slots.default?.());
      };
    }
  });
}
const __nuxt_component_0$1 = /* @__PURE__ */ defineNuxtLink(nuxtLinkDefaults);
function applyTrailingSlashBehavior(to, trailingSlash) {
  const normalizeFn = trailingSlash === "append" ? withTrailingSlash : withoutTrailingSlash;
  const hasProtocolDifferentFromHttp = hasProtocol(to) && !to.startsWith("http");
  if (hasProtocolDifferentFromHttp) {
    return to;
  }
  return normalizeFn(to, true);
}
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "pinia",
  setup(nuxtApp) {
    const pinia = createPinia();
    nuxtApp.vueApp.use(pinia);
    setActivePinia(pinia);
    {
      nuxtApp.payload.pinia = toRaw(pinia.state.value);
    }
    return {
      provide: {
        pinia
      }
    };
  }
});
const components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
const useUserStore = defineStore("user", () => {
  const user = ref(null);
  const isInitialized = ref(false);
  const userCookie = useCookie("user_data", {
    path: "/",
    sameSite: "lax"
  });
  const tokenCookie = useCookie("access_token", {
    path: "/",
    sameSite: "lax"
  });
  const isAuthenticated = computed(() => !!user.value);
  const userRole = computed(() => user.value?.role || "STUDENT");
  const userName = computed(() => user.value?.name || "Друг");
  const setUser = (newUser, accessToken = null, remember = true) => {
    user.value = newUser;
    const maxAge = remember ? 60 * 60 * 24 * 7 : void 0;
    const cookieOptions = {
      path: "/",
      sameSite: "lax",
      maxAge
    };
    if (newUser) {
      const { id, email, name, avatar, role, createdAt, updatedAt } = newUser;
      useCookie("user_data", cookieOptions).value = JSON.stringify({
        id,
        email,
        name,
        avatar,
        role,
        createdAt,
        updatedAt
      });
    } else {
      useCookie("user_data", cookieOptions).value = null;
    }
    if (accessToken) {
      useCookie("access_token", cookieOptions).value = accessToken;
    } else if (newUser === null) {
      useCookie("access_token", cookieOptions).value = null;
    }
  };
  const clearUser = () => {
    user.value = null;
    tokenCookie.value = null;
    userCookie.value = null;
  };
  const initStore = () => {
    if (isInitialized.value) return;
    if (userCookie.value) {
      try {
        const data = typeof userCookie.value === "string" ? JSON.parse(userCookie.value) : userCookie.value;
        if (data && typeof data === "object") {
          const d = data;
          const sanitized = {
            id: String(d.id),
            email: String(d.email),
            name: d.name ? String(d.name) : void 0,
            avatar: d.avatar ? String(d.avatar) : void 0,
            role: d.role || "STUDENT",
            createdAt: String(d.createdAt || (/* @__PURE__ */ new Date()).toISOString()),
            updatedAt: String(d.updatedAt || (/* @__PURE__ */ new Date()).toISOString())
          };
          user.value = sanitized;
        }
      } catch (e) {
        console.error("[UserStore] Failed to initialize from cookie:", e);
        clearUser();
      }
    }
    isInitialized.value = true;
  };
  return {
    user,
    isInitialized,
    isAuthenticated,
    userRole,
    userName,
    setUser,
    clearUser,
    initStore
  };
});
const auth_KUdagv3oyvSBS3mO749eP0dD8u9oBnRf_V2qaChjLVc = /* @__PURE__ */ defineNuxtPlugin((_nuxtApp) => {
  const userStore = useUserStore();
  userStore.initStore();
});
const toasts = ref([]);
let counter$1 = 0;
const useToast = () => {
  const show = (message, options = {}) => {
    const id = ++counter$1;
    const { type = "info", duration = 4e3, action } = options;
    const toast = { id, message, type, duration, action };
    toasts.value.push(toast);
    if (duration > 0) {
      setTimeout(() => {
        remove(id);
      }, duration);
    }
    return id;
  };
  const success = (message, duration, action) => show(message, { type: "success", duration, action });
  const error = (message, duration, action) => show(message, { type: "error", duration, action });
  const info = (message, duration, action) => show(message, { type: "info", duration, action });
  const warning = (message, duration, action) => show(message, { type: "warning", duration, action });
  const remove = (id) => {
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  };
  return {
    toasts,
    show,
    success,
    error,
    info,
    warning,
    remove
  };
};
const toast_y0U9eSv3IuAnLziNkb4uy1NnIkgN0HZ_JZuWXvOwAx4 = /* @__PURE__ */ defineNuxtPlugin(() => {
  const toast = useToast();
  return {
    provide: {
      toast
    }
  };
});
const plugins = [
  payloadPlugin,
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  plugin$1,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  plugin,
  components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4,
  auth_KUdagv3oyvSBS3mO749eP0dD8u9oBnRf_V2qaChjLVc,
  toast_y0U9eSv3IuAnLziNkb4uy1NnIkgN0HZ_JZuWXvOwAx4
];
const layouts = {
  app: defineAsyncComponent(() => import('./app-CTy1oj9z.mjs').then((m) => m.default || m)),
  default: defineAsyncComponent(() => import('./default-D5Qn1AZN.mjs').then((m) => m.default || m))
};
const routeRulesMatcher = _routeRulesMatcher;
const LayoutLoader = defineComponent({
  name: "LayoutLoader",
  inheritAttrs: false,
  props: {
    name: String,
    layoutProps: Object
  },
  setup(props, context) {
    return () => h(layouts[props.name], props.layoutProps, context.slots);
  }
});
const nuxtLayoutProps = {
  name: {
    type: [String, Boolean, Object],
    default: null
  },
  fallback: {
    type: [String, Object],
    default: null
  }
};
const __nuxt_component_0 = defineComponent({
  name: "NuxtLayout",
  inheritAttrs: false,
  props: nuxtLayoutProps,
  setup(props, context) {
    const nuxtApp = useNuxtApp();
    const injectedRoute = inject(PageRouteSymbol);
    const shouldUseEagerRoute = !injectedRoute || injectedRoute === useRoute();
    const route = shouldUseEagerRoute ? useRoute$1() : injectedRoute;
    const layout = computed(() => {
      let layout2 = unref(props.name) ?? route?.meta.layout ?? routeRulesMatcher(route?.path).appLayout ?? "default";
      if (layout2 && !(layout2 in layouts)) {
        if (props.fallback) {
          layout2 = unref(props.fallback);
        }
      }
      return layout2;
    });
    const layoutRef = shallowRef();
    context.expose({ layoutRef });
    const done = nuxtApp.deferHydration();
    let lastLayout;
    return () => {
      const hasLayout = layout.value && layout.value in layouts;
      const transitionProps = route?.meta.layoutTransition ?? appLayoutTransition;
      const previouslyRenderedLayout = lastLayout;
      lastLayout = layout.value;
      return _wrapInTransition(hasLayout && transitionProps, {
        default: () => h(Suspense, { suspensible: true, onResolve: () => {
          nextTick(done);
        } }, {
          default: () => h(
            LayoutProvider,
            {
              layoutProps: mergeProps(context.attrs, route.meta.layoutProps ?? {}, { ref: layoutRef }),
              key: layout.value || void 0,
              name: layout.value,
              shouldProvide: !props.name,
              isRenderingNewLayout: (name) => {
                return name !== previouslyRenderedLayout && name === layout.value;
              },
              hasTransition: !!transitionProps
            },
            context.slots
          )
        })
      }).default();
    };
  }
});
const LayoutProvider = defineComponent({
  name: "NuxtLayoutProvider",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean]
    },
    layoutProps: {
      type: Object
    },
    hasTransition: {
      type: Boolean
    },
    shouldProvide: {
      type: Boolean
    },
    isRenderingNewLayout: {
      type: Function,
      required: true
    }
  },
  setup(props, context) {
    const name = props.name;
    if (props.shouldProvide) {
      provide(LayoutMetaSymbol, {
        // When name=false, always return true so NuxtPage doesn't skip rendering
        isCurrent: (route) => name === false || name === (route.meta.layout ?? routeRulesMatcher(route.path).appLayout ?? "default")
      });
    }
    const injectedRoute = inject(PageRouteSymbol);
    const isNotWithinNuxtPage = injectedRoute && injectedRoute === useRoute();
    if (isNotWithinNuxtPage) {
      const vueRouterRoute = useRoute$1();
      const reactiveChildRoute = {};
      for (const _key in vueRouterRoute) {
        const key = _key;
        Object.defineProperty(reactiveChildRoute, key, {
          enumerable: true,
          get: () => {
            return props.isRenderingNewLayout(props.name) ? vueRouterRoute[key] : injectedRoute[key];
          }
        });
      }
      provide(PageRouteSymbol, shallowReactive(reactiveChildRoute));
    }
    return () => {
      if (!name || typeof name === "string" && !(name in layouts)) {
        return context.slots.default?.();
      }
      return h(
        LayoutLoader,
        { key: name, layoutProps: props.layoutProps, name },
        context.slots
      );
    };
  }
});
const defineRouteProvider = (name = "RouteProvider") => defineComponent({
  name,
  props: {
    route: {
      type: Object,
      required: true
    },
    vnode: Object,
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
        enumerable: true
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      if (!props.vnode) {
        return props.vnode;
      }
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const RouteProvider = defineRouteProvider();
const __nuxt_component_1 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, slots, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    inject(PageRouteSymbol, null);
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    nuxtApp.deferHydration();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          return h(Suspense, { suspensible: true }, {
            default() {
              return h(RouteProvider, {
                vnode: slots.default ? normalizeSlot(slots.default, routeProps) : routeProps.Component,
                route: routeProps.route,
                vnodeRef: pageRef
              });
            }
          });
        }
      });
    };
  }
});
function normalizeSlot(slot, data) {
  const slotContent = slot(data);
  return slotContent.length === 1 ? h(slotContent[0]) : h(Fragment, void 0, slotContent);
}
const _sfc_main$7 = /* @__PURE__ */ Object.assign({
  name: "NuxtErrorBoundary",
  inheritAttrs: false
}, {
  __name: "nuxt-error-boundary",
  __ssrInlineRender: true,
  emits: ["error"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const error = shallowRef(null);
    function clearError2() {
      error.value = null;
    }
    __expose({ error, clearError: clearError2 });
    return (_ctx, _push, _parent, _attrs) => {
      if (error.value) {
        ssrRenderSlot(_ctx.$slots, "error", { error: error.value, clearError: clearError2 }, null, _push, _parent);
      } else {
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      }
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "ErrorBoundary",
  __ssrInlineRender: true,
  setup(__props) {
    const isDev = false;
    const handleError = (error) => {
      console.error("[ErrorBoundary] Caught error:", error);
    };
    const handleRetry = (clearError2) => {
      clearError2();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtErrorBoundary = _sfc_main$7;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "contents" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_NuxtErrorBoundary, { onError: handleError }, {
        error: withCtx(({ error, clearError: clearError2 }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-nunito overflow-x-hidden"${_scopeId}><div class="w-full max-w-[90%] sm:max-w-lg md:max-w-xl lg:max-w-2xl text-center transition-all duration-300"${_scopeId}><div class="bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-14 lg:p-16 shadow-premium border-4 border-red-50 space-y-6 sm:space-y-8 relative overflow-hidden text-center"${_scopeId}><div class="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -mr-16 -mt-16"${_scopeId}></div><div class="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto transition-transform hover:scale-110 duration-500"${_scopeId}><div class="absolute inset-0 bg-red-500/10 rounded-full animate-pulse"${_scopeId}></div><div class="absolute inset-2 sm:inset-4 bg-red-500/20 rounded-full"${_scopeId}></div><div class="absolute inset-0 flex items-center justify-center"${_scopeId}><span class="text-4xl sm:text-6xl"${_scopeId}>🐍💔</span></div></div><div class="space-y-2 sm:space-y-4"${_scopeId}><h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-800 tracking-tight"${_scopeId}> Упс! Что-то пошло не так </h1><p class="text-slate-500 font-medium leading-relaxed max-w-sm md:max-w-md mx-auto text-sm sm:text-base md:text-lg"${_scopeId}> Наша змейка немного запуталась, но мы уже разбираемся! </p></div>`);
            if (unref(isDev) && error) {
              _push2(`<div class="text-left bg-slate-900 rounded-2xl p-4 sm:p-6 overflow-auto max-h-32 sm:max-h-48 border border-white/10"${_scopeId}><div class="flex items-center gap-2 mb-2"${_scopeId}><span class="w-2 h-2 rounded-full bg-red-500"${_scopeId}></span><span class="text-[10px] uppercase font-bold text-slate-500 tracking-widest"${_scopeId}>Debug Info</span></div><code class="text-[10px] sm:text-xs text-red-400 font-mono whitespace-pre-wrap"${_scopeId}>${ssrInterpolate(error.message || error)}</code></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 sm:pt-6"${_scopeId}><button class="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-brand-green text-white font-black text-sm sm:text-lg rounded-xl sm:rounded-2xl hover:bg-brand-green-hover transition-all active:scale-95 shadow-lg shadow-brand-green/20 flex items-center justify-center gap-2"${_scopeId}> Попробовать снова </button>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/",
              class: "w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-slate-100 text-slate-700 font-black text-sm sm:text-lg rounded-xl sm:rounded-2xl hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2",
              onClick: clearError2
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` На главную `);
                } else {
                  return [
                    createTextVNode(" На главную ")
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`</div></div><div class="mt-8 space-y-4"${_scopeId}><p class="text-slate-400 text-xs sm:text-sm font-medium"${_scopeId}> Проблема повторяется? <a href="mailto:support@zmeyka.io" class="text-brand-green hover:underline font-bold transition-colors"${_scopeId}> Напиши нам </a></p><div class="text-[10px] uppercase font-black text-slate-300 tracking-[0.3em]"${_scopeId}> © 2026 ZMEYKA.IO </div></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-nunito overflow-x-hidden" }, [
                createVNode("div", { class: "w-full max-w-[90%] sm:max-w-lg md:max-w-xl lg:max-w-2xl text-center transition-all duration-300" }, [
                  createVNode("div", { class: "bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-14 lg:p-16 shadow-premium border-4 border-red-50 space-y-6 sm:space-y-8 relative overflow-hidden text-center" }, [
                    createVNode("div", { class: "absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -mr-16 -mt-16" }),
                    createVNode("div", { class: "relative w-24 h-24 sm:w-32 sm:h-32 mx-auto transition-transform hover:scale-110 duration-500" }, [
                      createVNode("div", { class: "absolute inset-0 bg-red-500/10 rounded-full animate-pulse" }),
                      createVNode("div", { class: "absolute inset-2 sm:inset-4 bg-red-500/20 rounded-full" }),
                      createVNode("div", { class: "absolute inset-0 flex items-center justify-center" }, [
                        createVNode("span", { class: "text-4xl sm:text-6xl" }, "🐍💔")
                      ])
                    ]),
                    createVNode("div", { class: "space-y-2 sm:space-y-4" }, [
                      createVNode("h1", { class: "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-800 tracking-tight" }, " Упс! Что-то пошло не так "),
                      createVNode("p", { class: "text-slate-500 font-medium leading-relaxed max-w-sm md:max-w-md mx-auto text-sm sm:text-base md:text-lg" }, " Наша змейка немного запуталась, но мы уже разбираемся! ")
                    ]),
                    unref(isDev) && error ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-left bg-slate-900 rounded-2xl p-4 sm:p-6 overflow-auto max-h-32 sm:max-h-48 border border-white/10"
                    }, [
                      createVNode("div", { class: "flex items-center gap-2 mb-2" }, [
                        createVNode("span", { class: "w-2 h-2 rounded-full bg-red-500" }),
                        createVNode("span", { class: "text-[10px] uppercase font-bold text-slate-500 tracking-widest" }, "Debug Info")
                      ]),
                      createVNode("code", { class: "text-[10px] sm:text-xs text-red-400 font-mono whitespace-pre-wrap" }, toDisplayString(error.message || error), 1)
                    ])) : createCommentVNode("", true),
                    createVNode("div", { class: "flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 sm:pt-6" }, [
                      createVNode("button", {
                        onClick: ($event) => handleRetry(clearError2),
                        class: "w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-brand-green text-white font-black text-sm sm:text-lg rounded-xl sm:rounded-2xl hover:bg-brand-green-hover transition-all active:scale-95 shadow-lg shadow-brand-green/20 flex items-center justify-center gap-2"
                      }, " Попробовать снова ", 8, ["onClick"]),
                      createVNode(_component_NuxtLink, {
                        to: "/",
                        class: "w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-slate-100 text-slate-700 font-black text-sm sm:text-lg rounded-xl sm:rounded-2xl hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2",
                        onClick: clearError2
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" На главную ")
                        ]),
                        _: 1
                      }, 8, ["onClick"])
                    ])
                  ]),
                  createVNode("div", { class: "mt-8 space-y-4" }, [
                    createVNode("p", { class: "text-slate-400 text-xs sm:text-sm font-medium" }, [
                      createTextVNode(" Проблема повторяется? "),
                      createVNode("a", {
                        href: "mailto:support@zmeyka.io",
                        class: "text-brand-green hover:underline font-bold transition-colors"
                      }, " Напиши нам ")
                    ]),
                    createVNode("div", { class: "text-[10px] uppercase font-black text-slate-300 tracking-[0.3em]" }, " © 2026 ZMEYKA.IO ")
                  ])
                ])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("shared/ui/ErrorBoundary.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const isOpen = ref(false);
const actions = ref([]);
const useCommandPalette = () => {
  const open = () => {
    isOpen.value = true;
  };
  const close = () => {
    isOpen.value = false;
  };
  const toggle = () => {
    isOpen.value = !isOpen.value;
  };
  const registerActions = (newActions) => {
    const existingIds = new Set(actions.value.map((a) => a.id));
    const uniqueNew = newActions.filter((a) => !existingIds.has(a.id));
    actions.value = [...actions.value, ...uniqueNew];
  };
  const clearActions = () => {
    actions.value = [];
  };
  const removeAction = (id) => {
    actions.value = actions.value.filter((a) => a.id !== id);
  };
  return {
    isOpen,
    actions,
    open,
    close,
    toggle,
    registerActions,
    clearActions,
    removeAction
  };
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "TheCommandPalette",
  __ssrInlineRender: true,
  setup(__props) {
    const { isOpen: isOpen2, actions: actions2 } = useCommandPalette();
    const searchQuery = ref("");
    const selectedIndex = ref(0);
    const inputRef = ref(null);
    const filteredActions = computed(() => {
      if (!searchQuery.value) return actions2.value;
      const query = searchQuery.value.toLowerCase();
      return actions2.value.filter(
        (a) => a.title.toLowerCase().includes(query) || a.subtitle?.toLowerCase().includes(query)
      );
    });
    watch(isOpen2, (val) => {
      if (val) {
        searchQuery.value = "";
        selectedIndex.value = 0;
        nextTick(() => {
          inputRef.value?.focus();
        });
      }
    });
    watch(filteredActions, () => {
      selectedIndex.value = 0;
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(isOpen2)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] px-4 md:px-0" }, _attrs))} data-v-d28ce296><div class="absolute inset-0 bg-slate-900/40 backdrop-blur-md" data-v-d28ce296></div><div class="relative w-full max-w-2xl bg-white rounded-[2.5rem] border-8 border-white shadow-[0_30px_100px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col animate-in slide-in-from-top-4 duration-300" data-v-d28ce296><div class="p-6 border-b-4 border-slate-50 flex items-center gap-4" data-v-d28ce296><span class="text-2xl opacity-40" data-v-d28ce296>🔍</span><input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="Что вы хотите сделать? (Напр: &#39;новый урок&#39;)" class="flex-grow bg-transparent border-none outline-none font-black text-xl text-slate-800 placeholder:text-slate-200 uppercase tracking-tight" data-v-d28ce296><div class="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-200" data-v-d28ce296> ESC </div></div><div class="max-h-[50vh] overflow-y-auto no-scrollbar p-3 space-y-2" data-v-d28ce296><!--[-->`);
        ssrRenderList(filteredActions.value, (action, index) => {
          _push(`<div class="${ssrRenderClass([
            index === selectedIndex.value ? "bg-brand-blue text-white shadow-cartoon-sm scale-[1.02] -translate-y-0.5" : "hover:bg-slate-50 text-slate-600",
            "group px-6 py-4 rounded-3xl flex items-center justify-between transition-all cursor-pointer"
          ])}" data-v-d28ce296><div class="flex items-center gap-5" data-v-d28ce296><span class="text-2xl group-hover:scale-110 transition-transform" data-v-d28ce296>${ssrInterpolate(action.icon)}</span><div class="flex flex-col" data-v-d28ce296><span class="font-black text-xs uppercase tracking-widest leading-none" data-v-d28ce296>${ssrInterpolate(action.title)}</span>`);
          if (action.subtitle) {
            _push(`<span class="${ssrRenderClass([index === selectedIndex.value ? "text-white/60" : "text-slate-400", "text-[10px] font-bold uppercase tracking-widest mt-1"])}" data-v-d28ce296>${ssrInterpolate(action.subtitle)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
          if (action.shortcut) {
            _push(`<div class="flex gap-1 items-center" data-v-d28ce296><!--[-->`);
            ssrRenderList(action.shortcut, (key) => {
              _push(`<div class="${ssrRenderClass([
                index === selectedIndex.value ? "bg-white/20 border-white/20 text-white" : "bg-white border-slate-100 text-slate-400",
                "px-2 py-0.5 rounded-md text-[9px] font-black uppercase border-2 transition-colors"
              ])}" data-v-d28ce296>${ssrInterpolate(key)}</div>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]-->`);
        if (filteredActions.value.length === 0) {
          _push(`<div class="py-12 text-center" data-v-d28ce296><div class="text-5xl opacity-20 mb-4" data-v-d28ce296>🛸</div><p class="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]" data-v-d28ce296> Команда не найдена </p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="p-4 bg-slate-50/50 border-t-4 border-slate-50 flex items-center justify-between px-8" data-v-d28ce296><div class="flex items-center gap-6" data-v-d28ce296><div class="flex items-center gap-2" data-v-d28ce296><div class="w-4 h-4 rounded border border-slate-200 bg-white flex items-center justify-center text-[8px] text-slate-400" data-v-d28ce296> ↑↓ </div><span class="text-[9px] font-black text-slate-400 uppercase tracking-widest tracking-widest" data-v-d28ce296>Навигация</span></div><div class="flex items-center gap-2" data-v-d28ce296><div class="w-8 h-4 rounded border border-slate-200 bg-white flex items-center justify-center text-[8px] text-slate-400" data-v-d28ce296> ENTER </div><span class="text-[9px] font-black text-slate-400 uppercase tracking-widest" data-v-d28ce296>Выбрать</span></div></div><div class="text-[9px] font-black text-slate-300 uppercase tracking-widest italic flex items-center gap-2" data-v-d28ce296><span class="w-1.5 h-1.5 bg-brand-green rounded-full" data-v-d28ce296></span> Zmeyka Engine V1.0 </div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("shared/ui/TheCommandPalette.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const TheCommandPalette = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-d28ce296"]]);
const modals = ref([]);
let counter = 0;
const useModal = () => {
  const show = (options) => {
    return new Promise((resolve) => {
      const id = ++counter;
      modals.value.push({
        id,
        ...options,
        type: options.type || "info",
        confirmText: options.confirmText || "ОК",
        cancelText: options.cancelText || "Отмена",
        resolve
      });
    });
  };
  const confirm = (title, message) => {
    return show({
      title,
      message,
      type: "confirm",
      confirmText: "Да, удалить",
      cancelText: "Нет, оставить"
    });
  };
  const prompt = (title, placeholder, initialValue = "") => {
    return show({
      title,
      placeholder,
      initialValue,
      type: "prompt",
      confirmText: "Создать",
      cancelText: "Отмена"
    });
  };
  const close = (id, value) => {
    const index = modals.value.findIndex((m) => m.id === id);
    if (index !== -1) {
      const modal = modals.value[index];
      modals.value.splice(index, 1);
      modal.resolve(value);
    }
  };
  return {
    modals,
    show,
    confirm,
    prompt,
    close
  };
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "TheModals",
  __ssrInlineRender: true,
  setup(__props) {
    const { modals: modals2 } = useModal();
    const inputValue = ref("");
    watch(
      () => modals2.value.length,
      (newLen) => {
        if (newLen > 0) {
          const active = modals2.value[modals2.value.length - 1];
          inputValue.value = active.initialValue || "";
        }
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 z-[10000] pointer-events-none" }, _attrs))} data-v-fb11df62><!--[-->`);
      ssrRenderList(unref(modals2), (modal) => {
        _push(`<div class="fixed inset-0 flex items-center justify-center p-6 pointer-events-auto" data-v-fb11df62><div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md" data-v-fb11df62></div><div class="${ssrRenderClass([modal.type === "preview" ? "max-w-6xl h-[85vh]" : "max-w-lg", "relative w-full bg-white rounded-[3rem] border-8 border-white shadow-2xl overflow-hidden animate-modal-in"])}" data-v-fb11df62>`);
        if (modal.type === "preview") {
          _push(`<div class="h-full flex flex-col" data-v-fb11df62><div class="p-4 border-b-2 border-slate-50 flex items-center justify-between bg-slate-50/50" data-v-fb11df62><div class="flex items-center gap-3" data-v-fb11df62><span class="text-xl" data-v-fb11df62>👁️</span><p class="text-xs font-black text-slate-400 uppercase tracking-widest" data-v-fb11df62>${ssrInterpolate(modal.title)}</p></div><button class="w-10 h-10 rounded-xl bg-white border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-all font-black" data-v-fb11df62> × </button></div><iframe${ssrRenderAttr("src", modal.url)} class="flex-grow w-full border-none" data-v-fb11df62></iframe></div>`);
        } else {
          _push(`<div class="p-10 space-y-8" data-v-fb11df62><div class="flex flex-col items-center text-center space-y-4" data-v-fb11df62><div class="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-4xl shadow-sm border-4 border-slate-100 italic" data-v-fb11df62>${ssrInterpolate(modal.type === "confirm" ? "⚠️" : modal.type === "prompt" ? "📝" : "ℹ️")}</div><h3 class="text-2xl font-black text-slate-800 uppercase tracking-tight italic" data-v-fb11df62>${ssrInterpolate(modal.title)}</h3>`);
          if (modal.message) {
            _push(`<p class="text-slate-400 font-bold leading-relaxed" data-v-fb11df62>${ssrInterpolate(modal.message)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          if (modal.type === "prompt") {
            _push(`<div class="relative" data-v-fb11df62><input${ssrRenderAttr("value", inputValue.value)} type="text"${ssrRenderAttr("placeholder", modal.placeholder)} class="w-full px-8 py-5 bg-slate-50 border-4 border-slate-50 rounded-2xl font-black text-slate-700 outline-none focus:border-brand-blue focus:bg-white transition-all text-center uppercase tracking-widest placeholder:text-slate-200" autofocus data-v-fb11df62></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="grid grid-cols-2 gap-4" data-v-fb11df62><button class="py-5 bg-slate-50 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all border-4 border-transparent active:scale-95" data-v-fb11df62>${ssrInterpolate(modal.cancelText)}</button><button class="${ssrRenderClass([
            modal.type === "confirm" ? "bg-red-500 text-white shadow-[0_8px_0_0_#991b1b]" : "bg-brand-blue text-white shadow-[0_8px_0_0_#1e40af]",
            "py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-cartoon-sm active:translate-y-1 active:shadow-none active:scale-95"
          ])}" data-v-fb11df62>${ssrInterpolate(modal.confirmText)}</button></div></div>`);
        }
        _push(`</div></div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("shared/ui/TheModals.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const TheModals = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-fb11df62"]]);
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "TheToasts",
  __ssrInlineRender: true,
  setup(__props) {
    const { toasts: toasts2, remove } = useToast();
    const getIcon = (type) => {
      switch (type) {
        case "success":
          return "✅";
        case "error":
          return "❌";
        case "warning":
          return "⚠️";
        default:
          return "ℹ️";
      }
    };
    const getIconBg = (type) => {
      switch (type) {
        case "success":
          return "bg-brand-green/20";
        case "error":
          return "bg-red-100";
        case "warning":
          return "bg-amber-100";
        default:
          return "bg-brand-blue/10";
      }
    };
    const getTypeStyles = (type) => {
      switch (type) {
        case "success":
          return "hover:border-brand-green/20";
        case "error":
          return "hover:border-red-200";
        case "warning":
          return "hover:border-amber-200";
        default:
          return "hover:border-brand-blue/20";
      }
    };
    const getBarColor = (type) => {
      switch (type) {
        case "success":
          return "bg-brand-green";
        case "error":
          return "bg-red-500";
        case "warning":
          return "bg-amber-500";
        default:
          return "bg-brand-blue";
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed top-6 right-6 z-[9999] flex flex-col gap-4 w-full max-w-[400px] pointer-events-none" }, _attrs))} data-v-d291fe35><div${ssrRenderAttrs({
        name: "toast",
        class: "flex flex-col gap-3 items-end"
      })} data-v-d291fe35>`);
      ssrRenderList(unref(toasts2), (toast) => {
        _push(`<div class="${ssrRenderClass([getTypeStyles(toast.type), "pointer-events-auto group relative flex items-center gap-4 bg-white/90 backdrop-blur-xl p-5 rounded-[2rem] border-4 shadow-[0_20px_40px_rgba(0,0,0,0.1)] border-white transition-all hover:scale-[1.02]"])}" data-v-d291fe35><div class="${ssrRenderClass([getIconBg(toast.type), "w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-sm"])}" data-v-d291fe35>${ssrInterpolate(getIcon(toast.type))}</div><div class="flex-grow flex items-center justify-between gap-4" data-v-d291fe35><p class="text-xs font-black text-slate-800 leading-tight" data-v-d291fe35>${ssrInterpolate(toast.message)}</p>`);
        if (toast.action) {
          _push(`<button class="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shrink-0" data-v-d291fe35>${ssrInterpolate(toast.action.label)}</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><button class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-300 hover:bg-slate-50 hover:text-slate-500 transition-all text-lg" data-v-d291fe35> × </button>`);
        if (toast.duration) {
          _push(`<div class="absolute bottom-0 left-6 right-6 h-1 bg-slate-100 rounded-full overflow-hidden" data-v-d291fe35><div class="${ssrRenderClass([getBarColor(toast.type), "h-full transition-all linear"])}" style="${ssrRenderStyle({
            animationName: "toast-progress",
            animationDuration: toast.duration + "ms",
            animationTimingFunction: "linear"
          })}" data-v-d291fe35></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("shared/ui/TheToasts.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const TheToasts = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-d291fe35"]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    const userStore = useUserStore();
    userStore.initStore();
    useHead({
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap"
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      const _component_NuxtPage = __nuxt_component_1;
      _push(ssrRenderComponent(_sfc_main$6, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_NuxtLayout, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_NuxtPage, null, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_NuxtPage)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(TheToasts, null, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(TheModals, null, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(TheCommandPalette, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_NuxtLayout, null, {
                default: withCtx(() => [
                  createVNode(_component_NuxtPage)
                ]),
                _: 1
              }),
              createVNode(TheToasts),
              createVNode(TheModals),
              createVNode(TheCommandPalette)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "error",
  __ssrInlineRender: true,
  props: {
    error: {}
  },
  setup(__props) {
    const props = __props;
    const isDev = false;
    const errorTitle = computed(() => {
      switch (props.error?.statusCode) {
        case 404:
          return "Страница не найдена";
        case 403:
          return "Доступ запрещён";
        case 401:
          return "Требуется авторизация";
        case 500:
          return "Ошибка сервера";
        default:
          return "Что-то пошло не так";
      }
    });
    const errorMessage = computed(() => {
      switch (props.error?.statusCode) {
        case 404:
          return "Такой страницы не существует. Возможно, она была удалена или вы ввели неверный адрес.";
        case 403:
          return "У вас нет доступа к этой странице. Попробуйте войти в аккаунт.";
        case 401:
          return "Для доступа к этой странице необходимо войти в систему.";
        case 500:
          return "Наши серверы временно недоступны. Мы уже работаем над этим!";
        default:
          return "Произошла непредвиденная ошибка. Попробуйте обновить страницу.";
      }
    });
    const handleError = () => clearError({ redirect: "/" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-nunito overflow-x-hidden" }, _attrs))} data-v-baed3d53><div class="w-full max-w-[90%] sm:max-w-lg md:max-w-xl lg:max-w-2xl text-center transition-all duration-300" data-v-baed3d53><div class="bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-14 lg:p-16 shadow-premium border-4 border-slate-100 space-y-6 sm:space-y-8 relative overflow-hidden" data-v-baed3d53><div class="absolute top-0 right-0 w-32 h-32 bg-brand-green/5 rounded-full blur-3xl -mr-16 -mt-16" data-v-baed3d53></div><div class="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -ml-16 -mb-16" data-v-baed3d53></div><div class="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto transition-transform hover:scale-110 duration-500" data-v-baed3d53><div class="absolute inset-0 bg-brand-green/10 rounded-full animate-pulse" data-v-baed3d53></div><div class="absolute inset-2 sm:inset-4 bg-brand-green/20 rounded-full" data-v-baed3d53></div><div class="absolute inset-0 flex items-center justify-center" data-v-baed3d53><span class="text-4xl sm:text-6xl animate-float" data-v-baed3d53>🐍</span></div></div><div class="space-y-2 sm:space-y-4" data-v-baed3d53><h1 class="text-6xl sm:text-8xl md:text-9xl font-black text-slate-200 leading-none tracking-tighter" data-v-baed3d53>${ssrInterpolate(__props.error?.statusCode || 500)}</h1><h2 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-800 tracking-tight" data-v-baed3d53>${ssrInterpolate(unref(errorTitle))}</h2><p class="text-slate-500 font-medium leading-relaxed max-w-sm md:max-w-md mx-auto text-sm sm:text-base md:text-lg" data-v-baed3d53>${ssrInterpolate(unref(errorMessage))}</p></div>`);
      if (unref(isDev) && __props.error?.message) {
        _push(`<div class="text-left bg-slate-900 rounded-2xl p-4 sm:p-6 overflow-auto max-h-32 sm:max-h-48 border border-white/10" data-v-baed3d53><div class="flex items-center gap-2 mb-2" data-v-baed3d53><span class="w-2 h-2 rounded-full bg-red-500" data-v-baed3d53></span><span class="text-[10px] uppercase font-bold text-slate-500 tracking-widest" data-v-baed3d53>Debug Info</span></div><code class="text-[10px] sm:text-xs text-red-400 font-mono whitespace-pre-wrap" data-v-baed3d53>${ssrInterpolate(__props.error.message)}</code></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 sm:pt-6" data-v-baed3d53><button class="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-brand-green text-white font-black text-sm sm:text-lg rounded-xl sm:rounded-2xl hover:bg-brand-green-hover transition-all active:scale-95 shadow-lg shadow-brand-green/20 flex items-center justify-center gap-2" data-v-baed3d53> ← Назад </button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-slate-100 text-slate-700 font-black text-sm sm:text-lg rounded-xl sm:rounded-2xl hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2",
        onClick: handleError
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` 🏠 На главную `);
          } else {
            return [
              createTextVNode(" 🏠 На главную ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="mt-8 space-y-4" data-v-baed3d53><p class="text-slate-400 text-xs sm:text-sm font-medium" data-v-baed3d53> Если проблема повторяется, <a href="mailto:support@zmeyka.io" class="text-brand-green hover:underline font-bold transition-colors" data-v-baed3d53> свяжитесь с нами </a></p><div class="text-[10px] uppercase font-black text-slate-300 tracking-[0.3em]" data-v-baed3d53> © 2026 ZMEYKA.IO </div></div></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("error.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ErrorComponent = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-baed3d53"]]);
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = /* @__PURE__ */ useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(ErrorComponent), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext && (ssrContext["~renderResponse"] || ssrContext._renderResponse)) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry_default = ((ssrContext) => entry(ssrContext));

export { _export_sfc as _, __nuxt_component_1$1 as a, __nuxt_component_0$1 as b, useSeoMeta as c, useHead as d, entry_default as default, useRouter as e, useCookie as f, useRuntimeConfig as g, useNuxtApp as h, _sfc_main$6 as i, asyncDataDefaults as j, createError as k, useRoute as l, useToast as m, navigateTo as n, useModal as o, useCommandPalette as p, defineNuxtRouteMiddleware as q, useUserStore as u };
//# sourceMappingURL=server.mjs.map
