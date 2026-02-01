import { Test, TestingModule } from '@nestjs/testing'
import { DashboardService } from './dashboard.service'
import { PrismaService } from '../prisma/prisma.service'
import { NotFoundException } from '@nestjs/common'

describe('DashboardService', () => {
  let service: DashboardService
  let prisma: PrismaService

  const mockPrisma = {
    userStats: {
      findUnique: jest.fn(),
    },
    course: {
      findMany: jest.fn(),
    },
    userActivity: {
      findMany: jest.fn(),
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DashboardService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile()

    service = module.get<DashboardService>(DashboardService)
    prisma = module.get<PrismaService>(PrismaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getSummary', () => {
    it('should throw NotFoundException if stats not found', async () => {
      mockPrisma.userStats.findUnique.mockResolvedValue(null)
      await expect(service.getSummary('user-1')).rejects.toThrow(NotFoundException)
    })

    it('should correctly format courses with progress', async () => {
      const mockStats = { xp: 100, level: 1, streak: 5, completedCourses: 0, completedLessons: 2 }
      mockPrisma.userStats.findUnique.mockResolvedValue(mockStats)

      const mockCourses = [
        {
          id: 'course-1',
          title: 'Course 1',
          thumbnail: null,
          teacher: { name: 'Teacher 1' },
          modules: [
            {
              lessons: [
                { progress: [{ isCompleted: true }] },
                { progress: [{ isCompleted: false }] },
              ],
            },
          ],
        },
      ]
      mockPrisma.course.findMany.mockResolvedValue(mockCourses)
      mockPrisma.userActivity.findMany.mockResolvedValue([])

      const result = await service.getSummary('user-1')

      expect(result.stats.xp).toBe(100)
      expect(result.activeCourses[0].progress).toBe(50)
      expect(result.activeCourses[0].totalLessons).toBe(2)
      expect(result.activeCourses[0].completedLessons).toBe(1)
    })
  })
})
