import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as any,
        token: null as string | null,
        isLoggedIn: false
    }),
    actions: {
        init() {
            if (process.client) {
                const token = localStorage.getItem('token')
                const user = localStorage.getItem('user')
                if (token && user) {
                    this.token = token
                    this.user = JSON.parse(user)
                    this.isLoggedIn = true
                }
            }
        },
        setUser(user: any, token: string) {
            this.user = user
            this.token = token
            this.isLoggedIn = !!user

            if (process.client) {
                localStorage.setItem('token', token)
                localStorage.setItem('user', JSON.stringify(user))
            }
        },
        logout() {
            this.user = null
            this.token = null
            this.isLoggedIn = false
            if (process.client) {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
            }
        }
    }
})
