import app from "C:/Users/novik/OneDrive/Рабочий стол/zmeyka/src/layouts/app.vue";
import _default from "C:/Users/novik/OneDrive/Рабочий стол/zmeyka/src/layouts/default.vue";
import type { ComputedRef, MaybeRef } from 'vue'
declare module 'nuxt/app' {
  interface NuxtLayouts {
    'app': InstanceType<typeof app>['$props'],
    'default': InstanceType<typeof _default>['$props'],
}
  export type LayoutKey = keyof NuxtLayouts extends never ? string : keyof NuxtLayouts
  interface PageMeta {
    layout?: MaybeRef<LayoutKey | false> | ComputedRef<LayoutKey | false>
  }
}