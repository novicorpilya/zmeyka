import js from '@eslint/js';
import globals from 'globals';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import vueEslintParser from 'vue-eslint-parser';
import vuePlugin from 'eslint-plugin-vue';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import boundaries from 'eslint-plugin-boundaries';
import importPlugin from 'eslint-plugin-import';

export default [
    {
        ignores: ['dist/**', '.nuxt/**', '.output/**', 'node_modules/**', 'backend/**'],
    },
    js.configs.recommended,
    {
        files: ['src/**/*.{ts,vue}'],
        languageOptions: {
            parser: vueEslintParser,
            parserOptions: {
                parser: tsParser,
                ecmaVersion: 2022,
                sourceType: 'module',
                extraFileExtensions: ['.vue'],
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                // Common browser and node globals
                process: 'readonly',
                window: 'readonly',
                document: 'readonly',
                console: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                // Nuxt auto-imports (essential ones)
                defineNuxtConfig: 'readonly',
                defineNuxtPlugin: 'readonly',
                useRuntimeConfig: 'readonly',
                useState: 'readonly',
                useFetch: 'readonly',
                useAsyncData: 'readonly',
                useLazyFetch: 'readonly',
                useLazyAsyncData: 'readonly',
                useCookie: 'readonly',
                useRouter: 'readonly',
                useRoute: 'readonly',
                navigateTo: 'readonly',
                definePageMeta: 'readonly',
                computed: 'readonly',
                reactive: 'readonly',
                ref: 'readonly',
                onMounted: 'readonly',
                onUnmounted: 'readonly',
                onBeforeUnmount: 'readonly',
                onBeforeMount: 'readonly',
                onUpdated: 'readonly',
                nextTick: 'readonly',
                watch: 'readonly',
                $fetch: 'readonly',
                defineNuxtRouteMiddleware: 'readonly',
                useHead: 'readonly',
                useSeoMeta: 'readonly',
                useNuxtApp: 'readonly',
                clearError: 'readonly',
                defineProps: 'readonly',
                defineEmits: 'readonly',
                defineExpose: 'readonly',
                HeadersInit: 'readonly',
                NodeJS: 'readonly',
            }
        },
        plugins: {
            '@typescript-eslint': typescriptEslint,
            vue: vuePlugin,
            prettier: prettier,
            boundaries: boundaries,
            import: importPlugin,
        },
        settings: {
            'import/resolver': {
                typescript: true,
            },
            'boundaries/elements': [
                { type: 'app', pattern: 'src/app/*' },
                { type: 'pages', pattern: 'src/pages/*' },
                { type: 'widgets', pattern: 'src/widgets/*' },
                { type: 'features', pattern: 'src/features/*' },
                { type: 'entities', pattern: 'src/entities/*' },
                { type: 'shared', pattern: 'src/shared/*' },
            ],
        },
        rules: {
            // TypeScript rules
            ...typescriptEslint.configs.recommended.rules,

            // Vue 3 rules (manually specifying crucial ones to avoid crashes)
            'vue/multi-word-component-names': 'off',
            'vue/no-side-effects-in-computed-properties': 'error',
            'vue/no-unused-vars': 'error',
            'vue/return-in-computed-property': 'error',

            ...prettierConfig.rules,
            'prettier/prettier': 'error',

            // Type Safety
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': ['error', {
                argsIgnorePattern: '^_|err|to|from',
                varsIgnorePattern: '^_|err',
                caughtErrorsIgnorePattern: '^_|err'
            }],
            '@typescript-eslint/no-non-null-assertion': 'off',

            // FSD Architectural Boundaries
            'boundaries/element-types': [
                'error',
                {
                    default: 'disallow',
                    rules: [
                        { from: 'app', allow: ['pages', 'widgets', 'features', 'entities', 'shared'] },
                        { from: 'pages', allow: ['widgets', 'features', 'entities', 'shared'] },
                        { from: 'widgets', allow: ['features', 'entities', 'shared'] },
                        { from: 'features', allow: ['entities', 'shared'] },
                        { from: 'entities', allow: ['entities', 'shared'] },
                        { from: 'shared', allow: ['shared'] },
                    ],
                },
            ],

            // Import ordering
            'import/order': [
                'error',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                    'newlines-between': 'always',
                    alphabetize: { order: 'asc', caseInsensitive: true },
                },
            ],

            // General
            'no-undef': 'warn', // Downgraded to warn for auto-imports compatibility
            'no-empty': ['error', { allowEmptyCatch: true }],
        },
    },
];
