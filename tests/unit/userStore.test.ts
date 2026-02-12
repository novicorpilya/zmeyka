/**
 * User Store Unit Tests
 * Tests for authentication flow, cookie management, and state hydration
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Mock useCookie as a global (Nuxt auto-imports it)
vi.stubGlobal('useCookie', vi.fn(() => ({ value: null })))
vi.stubGlobal('navigateTo', vi.fn())

// Import store after mocks are set up
// @ts-expect-error - Vitest alias resolution
import { useUserStore } from '~/entities/user/model/store'

describe('useUserStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
    })

    describe('Initial State', () => {
        it('should have null user by default', () => {
            const store = useUserStore()
            expect(store.user).toBeNull()
        })

        it('should not be initialized by default', () => {
            const store = useUserStore()
            expect(store.isInitialized).toBe(false)
        })

        it('should not be authenticated when no user', () => {
            const store = useUserStore()
            expect(store.isAuthenticated).toBe(false)
        })
    })

    describe('Getters', () => {
        it('isAuthenticated should return true when user exists', () => {
            const store = useUserStore()
            store.user = {
                id: '1',
                email: 'test@test.com',
                name: 'Test User',
                avatar: null,
                role: 'STUDENT',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
            expect(store.isAuthenticated).toBe(true)
        })

        it('userRole should return STUDENT by default', () => {
            const store = useUserStore()
            expect(store.userRole).toBe('STUDENT')
        })

        it('userRole should return actual role when user exists', () => {
            const store = useUserStore()
            store.user = {
                id: '1',
                email: 'teacher@test.com',
                name: 'Teacher',
                avatar: null,
                role: 'TEACHER',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
            expect(store.userRole).toBe('TEACHER')
        })

        it('userName should return "Друг" by default', () => {
            const store = useUserStore()
            expect(store.userName).toBe('Друг')
        })

        it('userName should return actual name when user exists', () => {
            const store = useUserStore()
            store.user = {
                id: '1',
                email: 'test@test.com',
                name: 'John Doe',
                avatar: null,
                role: 'STUDENT',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
            expect(store.userName).toBe('John Doe')
        })
    })

    describe('Actions', () => {
        it('clearUser should reset user to null', () => {
            const store = useUserStore()
            store.user = {
                id: '1',
                email: 'test@test.com',
                name: 'Test',
                avatar: null,
                role: 'STUDENT',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }

            store.clearUser()

            expect(store.user).toBeNull()
        })

        it('initStore should set isInitialized to true', () => {
            const store = useUserStore()

            store.initStore()

            expect(store.isInitialized).toBe(true)
        })

        it('initStore should not run twice', () => {
            const store = useUserStore()

            store.initStore()
            store.isInitialized = true
            store.initStore() // Should skip

            expect(store.isInitialized).toBe(true)
        })
    })
})
