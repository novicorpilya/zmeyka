import { defineNuxtConfig } from 'nuxt/config'
// @ts-ignore: Missing type declarations for tailwindcss vite plugin
import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    // Force refresh config
    compatibilityDate: '2024-11-01',
    devtools: { enabled: false },
    srcDir: 'src/',

    devServer: {
        port: 3000
    },

    runtimeConfig: {
        public: {
            apiBase: (process.env.NUXT_PUBLIC_API_BASE as string) || 'http://localhost:3001/api',
        }
    },

    modules: [
        '@pinia/nuxt',
        '@sentry/nuxt/module',
    ],

    alias: {
        '@app': '~/app',
        '@pages': '~/pages',
        '@widgets': '~/widgets',
        '@features': '~/features',
        '@entities': '~/entities',
        '@shared': '~/shared',
        '@services': '~/services'
    },

    // Tailwind 4 integration via Vite
    vite: {
        plugins: [
            tailwindcss(),
        ],
    },

    css: ['~/app/index.css'],

    app: {
        pageTransition: { name: 'page', mode: 'out-in' },
        layoutTransition: { name: 'layout', mode: 'out-in' },
        head: {
            script: [
                {
                    src: 'https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js',
                    defer: true,
                    crossorigin: 'anonymous'
                },
                {
                    src: 'https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js',
                    defer: true,
                    crossorigin: 'anonymous'
                }
            ],
            meta: [
                { name: 'description', content: 'Освой Python и основы IT с помощью самого доброго в мире ИИ-наставника.' },
                { property: 'og:title', content: 'Змейка — Твой интерактивный ИИ-наставник в мире IT' },
                { property: 'og:description', content: 'Освой Python и основы IT с помощью самого доброго в мире ИИ-наставника.' },
                { property: 'og:type', content: 'website' },
                { property: 'og:url', content: 'https://zmeyka.ru' },
                { property: 'og:image', content: 'https://zmeyka.ru/og-image.png' }
            ]
        }
    }
})
