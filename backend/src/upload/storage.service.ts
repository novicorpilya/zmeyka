import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common'
import { extname, join } from 'path'
import * as fs from 'fs'
import * as fsPromises from 'fs/promises'
import { PrismaService } from '../prisma/prisma.service'

export interface StorageResult {
  url: string
  key: string
  filename: string
  size: number
}

export abstract class StorageService {
  abstract upload(
    file: Express.Multer.File,
    userId: string,
    type: 'video' | 'static',
  ): Promise<StorageResult>
  abstract getFilePath(filename: string, type: 'video' | 'static'): string
}

@Injectable()
export class LocalStorageService extends StorageService {
  private readonly baseDir = join(process.cwd(), 'uploads')
  private readonly directories = {
    video: 'videos',
    static: 'files',
    temp: 'temp',
  }
  private readonly USER_QUOTA = 500 * 1024 * 1024 // 500MB per user

  constructor(private prisma: PrismaService) {
    super()
    this.ensureDirectories()
  }

  private ensureDirectories() {
    Object.values(this.directories).forEach((dir) => {
      const fullPath = join(this.baseDir, dir)
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true })
      }
    })
  }

  async upload(
    file: Express.Multer.File,
    userId: string,
    type: 'video' | 'static',
  ): Promise<StorageResult> {
    if (!file) throw new BadRequestException('File is required')

    // Check user quota
    const currentUsage = await this.getUserStorageUsage(userId)
    if (currentUsage + file.size > this.USER_QUOTA) {
      throw new BadRequestException('Storage quota exceeded (500MB limit)')
    }

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const filename = `${userId}-${uniqueSuffix}${extname(file.originalname)}`
    const targetDir = join(this.baseDir, this.directories[type])
    const targetPath = join(targetDir, filename)

    try {
      if (file.path) {
        await fsPromises.rename(file.path, targetPath)
      } else if (file.buffer) {
        await fsPromises.writeFile(targetPath, file.buffer)
      } else {
        throw new InternalServerErrorException('Invalid file upload state')
      }
    } catch (error) {
      console.error('File save error:', error)
      throw new InternalServerErrorException('Failed to save file')
    }

    return {
      url: type === 'video' ? `/api/upload/stream/${filename}` : `/api/upload/static/${filename}`,
      key: filename,
      filename: filename,
      size: file.size,
    }
  }

  async getUserStorageUsage(userId: string): Promise<number> {
    // Simple implementation: scan directories for files starting with userId-
    // In production, this should be tracked in the database for performance.
    let totalSize = 0
    for (const dir of [this.directories.video, this.directories.static]) {
      const fullDir = join(this.baseDir, dir)
      const files = await fsPromises.readdir(fullDir)
      for (const file of files) {
        if (file.startsWith(userId + '-')) {
          const stats = await fsPromises.stat(join(fullDir, file))
          totalSize += stats.size
        }
      }
    }
    return totalSize
  }

  getFilePath(filename: string, type: 'video' | 'static'): string {
    const safeName = filename.replace(/(\.\.[\/\\])+/g, '')
    return join(this.baseDir, this.directories[type], safeName)
  }
}
