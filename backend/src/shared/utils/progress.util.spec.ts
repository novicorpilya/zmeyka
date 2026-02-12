import { ProgressUtil } from './progress.util'

describe('ProgressUtil', () => {
  const mockModules = [
    {
      id: 'mod-1',
      lessons: [
        { id: 'les-1', progress: [{ isCompleted: true }] },
        { id: 'les-2', progress: [{ isCompleted: false }] },
      ],
    },
    {
      id: 'mod-2',
      lessons: [
        { id: 'les-3', progress: [] },
        { id: 'les-4', progress: [{ isCompleted: true }] },
      ],
    },
  ]

  it('should calculate 50% progress for 2/4 completed lessons', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = ProgressUtil.calculateProgress(mockModules as any, 'user-1')
    expect(result.progress).toBe(50)
    expect(result.xp).toBe(20)
    expect(result.totalLessons).toBe(4)
    expect(result.completedLessons).toBe(2)
  })

  it('should calculate 0% progress if no userId is provided', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = ProgressUtil.calculateProgress(mockModules as any)
    expect(result.progress).toBe(0)
    expect(result.xp).toBe(0)
  })

  it('should return 0 for empty modules array', () => {
    const result = ProgressUtil.calculateProgress([])
    expect(result.progress).toBe(0)
    expect(result.totalLessons).toBe(0)
  })

  it('should handle modules with no lessons', () => {
    const modules = [{ id: 'mod-1', lessons: [] }]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = ProgressUtil.calculateProgress(modules as any, 'user-1')
    expect(result.progress).toBe(0)
    expect(result.totalLessons).toBe(0)
  })
})
