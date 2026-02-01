import { describe, it, expect } from 'vitest'

describe('Zmeyka Platform Sanity Check', () => {
    it('should pass basic math', () => {
        expect(1 + 1).toBe(2)
    })

    it('should have correct environment', () => {
        expect(process.env.NODE_ENV).toBeDefined()
    })
})
