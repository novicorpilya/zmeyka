export const formatFileUrl = (path?: string, baseUrl?: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path

  let apiBase = baseUrl
  if (!apiBase) {
    try {
      const config = useRuntimeConfig()
      apiBase = config.public.apiBase as string
    } catch (_e) {
      // Fallback for non-Nuxt context if needed
      apiBase = ''
    }
  }

  if (!apiBase) return path

  try {
    const url = new URL(apiBase)
    return `${url.origin}${path.startsWith('/') ? '' : '/'}${path}`
  } catch (_e) {
    return path
  }
}
