/**
 * Sentry Configuration Plugin
 * Initializes Sentry for error tracking in production
 *
 * To enable:
 * 1. Add SENTRY_DSN to your .env file
 * 2. Uncomment the sentry module in nuxt.config.ts
 */
export default defineNuxtPlugin(() => {
  // Sentry is auto-initialized by @sentry/nuxt module
  // This plugin is for any custom configuration
  // Only log in development
  // Only log in development (log removed)
  // You can add custom tags, context, or breadcrumbs here
  // Example:
  // Sentry.setTag('app.version', runtimeConfig.public.appVersion)
  // Sentry.setContext('environment', { mode: 'production' })
})
