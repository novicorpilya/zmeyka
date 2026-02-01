import { Test, TestingModule } from '@nestjs/testing'
import { CoursesService } from './courses.service'
import { PrismaService } from '../prisma/prisma.service'
import { NotFoundException } from '@nestjs/common'

describe('CoursesService', () => {
  let service: CoursesService
  let prisma: PrismaService

  const mockPrisma = {
    course: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoursesService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile()

    service = module.get<CoursesService>(CoursesService)
    prisma = module.get<PrismaService>(PrismaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findOne', () => {
    it('should calculate progress and XP when userId is provided', async () => {
      const mockCourse = {
        id: 'course-1',
        title: 'Test Course',
        teacher: { name: 'Teacher' },
        modules: [
          {
            lessons: [
              { id: 'lesson-1', progress: [{ isCompleted: true }] },
              { id: 'lesson-2', progress: [] },
            ],
          },
        ],
      }
      mockPrisma.course.findUnique.mockResolvedValue(mockCourse)

      const result = await service.findOne('course-1', 'user-1')

      expect(result.calculatedProgress).toBe(50)
      expect(result.calculatedXp).toBe(10) // 1 lesson * 10 xp = 10
      // Let's check the code: completedLessons * 10
    })

    it('should throw NotFoundException if course does not exist', async () => {
      mockPrisma.course.findUnique.mockResolvedValue(null)
      await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException)
    })
  })
})
