import { defineNuxtConfig } from 'nuxt/config'
// @ts-ignore: Missing type declarations for tailwindcss vite plugin
import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    // @ts-ignore: compatibilityDate might not be recognized by older Nuxt 3 type definitions
    compatibilityDate: '2024-11-01',
    devtools: { enabled: false },
    srcDir: 'src/',

    devServer: {
        port: 3000
    },

    runtimeConfig: {
        public: {
            apiBase: (process.env.NUXT_PUBLIC_API_BASE as string) || 'https://api.zmeyka.io'
        }
    },

    modules: [
        '@pinia/nuxt'
    ],

    vite: {
        plugins: [
            tailwindcss(),
        ],
    },

    alias: {
        '@app': '~/app',
        '@pages': '~/pages',
        '@widgets': '~/widgets',
        '@features': '~/features',
        '@entities': '~/entities',
        '@shared': '~/shared',
        '@services': '~/services'
    },

    css: ['~/app/index.css'],

    app: {
        head: {
            title: 'Zmeyka — Твой интерактивный ИИ-наставник в мире IT',
            meta: [
                { name: 'description', content: 'Освой Python и основы IT с помощью самого доброго в мире ИИ-наставника.' },
                { property: 'og:title', content: 'Zmeyka — Твой интерактивный ИИ-наставник в мире IT' },
                { property: 'og:description', content: 'Освой Python и основы IT с помощью самого доброго в мире ИИ-наставника.' },
                { property: 'og:type', content: 'website' },
                { property: 'og:url', content: 'https://zmeyka.io' },
                { property: 'og:image', content: 'https://zmeyka.io/og-image.png' }
            ]
        }
    }
} as any)
