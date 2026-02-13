import _default from "C:/Users/novik/OneDrive/Рабочий стол/zmeyka/src/layouts/default.vue";
import main from "C:/Users/novik/OneDrive/Рабочий стол/zmeyka/src/layouts/main.vue";
import type { ComputedRef, MaybeRef } from 'vue'
declare module 'nuxt/app' {
  interface NuxtLayouts {
    'default': InstanceType<typeof _default>['$props'],
    'main': InstanceType<typeof main>['$props'],
}
  export type LayoutKey = keyof NuxtLayouts extends never ? string : keyof NuxtLayouts
  interface PageMeta {
    layout?: MaybeRef<LayoutKey | false> | ComputedRef<LayoutKey | false>
  }
}