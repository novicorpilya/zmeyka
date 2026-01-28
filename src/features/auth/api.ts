import { useRuntimeConfig } from '#app'

export const useAuthApi = () => {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase || 'http://localhost:3001'

    const register = async (data: any) => {
        return await $fetch(`${apiBase}/auth/register`, {
            method: 'POST',
            body: data
        })
    }

    const login = async (data: any) => {
        return await $fetch(`${apiBase}/auth/login`, {
            method: 'POST',
            body: data
        })
    }

    return {
        register,
        login
    }
}
