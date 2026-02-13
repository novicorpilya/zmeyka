import { Ref } from 'vue'

import { Socket } from '../shared/types'

declare module '#app' {
  interface NuxtApp {
    $socket: Ref<Socket | null>
  }
}

declare module '@nuxt/schema' {
  interface NuxtApp {
    $socket: Ref<Socket | null>
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $socket: Ref<Socket | null>
  }
}

export {}
