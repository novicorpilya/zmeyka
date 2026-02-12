import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { PrismaService } from '../prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import { UnauthorizedException, ConflictException } from '@nestjs/common'

describe('AuthService', () => {
  let service: AuthService
  let prisma: PrismaService
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let jwtService: JwtService

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    userActivity: {
      create: jest.fn().mockResolvedValue({}),
    },
  }

  const mockJwtService = {
    signAsync: jest.fn(),
  }

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'JWT_SECRET') return 'test_secret'
      if (key === 'JWT_REFRESH_SECRET') return 'test_refresh_secret'
      return null
    }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    prisma = module.get<PrismaService>(PrismaService)
    jwtService = module.get<JwtService>(JwtService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    }

    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: 'STUDENT',
      name: 'Test User',
    }

    it('should return tokens on successful login', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser)
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true))
      mockJwtService.signAsync.mockResolvedValue('mock_token')
      mockPrismaService.user.update.mockResolvedValue(mockUser)

      const result = await service.login(loginDto)

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: loginDto.email } })
      expect(result).toHaveProperty('accessToken', 'mock_token')
      expect(result).toHaveProperty('refreshToken', 'mock_token')
    })

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null)

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException)
    })

    it('should throw UnauthorizedException if password does not match', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser)
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false))

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('register', () => {
    const registerDto = {
      email: 'new@example.com',
      password: 'password123',
      name: 'New User',
      role: 'STUDENT' as const,
    }

    it('should create a new user and return tokens', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null) // User does not exist
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashedpassword'))

      const createdUser = {
        id: 'new-user-123',
        ...registerDto,
        password: 'hashedpassword',
      }

      mockPrismaService.user.create.mockResolvedValue(createdUser)
      mockJwtService.signAsync.mockResolvedValue('mock_token')
      mockPrismaService.user.update.mockResolvedValue(createdUser)

      // AuthService register logic calls getTokens which updates database (refreshToken) so user.update is called.
      const result = await service.register(registerDto)

      expect(prisma.user.create).toHaveBeenCalled()
      expect(result).toHaveProperty('accessToken', 'mock_token')
    })

    it('should throw ConflictException if user already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'exists' })

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException)
    })
  })
})
