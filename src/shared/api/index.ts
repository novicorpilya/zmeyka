export const useApi = () => {
    // These are auto-imported by Nuxt 3 from #app and #imports
    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase

    const fetchApi = async (endpoint: string, options: any = {}) => {
        return await $fetch(`${apiBase}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        })
    }

    return {
        fetchApi
    }
}
