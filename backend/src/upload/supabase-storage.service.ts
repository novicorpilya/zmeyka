import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { ConfigService } from '@nestjs/config'
import { StorageService, StorageResult } from './storage.service'
import { extname } from 'path'
import * as fs from 'fs'

@Injectable()
export class SupabaseStorageService extends StorageService {
  private readonly logger = new Logger(SupabaseStorageService.name)
  private supabase: SupabaseClient
  private readonly bucketName = 'zmeyka-assets'

  constructor(private configService: ConfigService) {
    super()
    const url = this.configService.get<string>('SUPABASE_URL')
    const key = this.configService.get<string>('SUPABASE_KEY')

    if (!url || !key) {
      throw new Error('SUPABASE_URL or SUPABASE_KEY missing in environment')
    }

    this.supabase = createClient(url, key)
  }

  async upload(
    file: Express.Multer.File,
    userId: string,
    type: 'video' | 'static',
  ): Promise<StorageResult> {
    if (!file) throw new BadRequestException('File is required')

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const filename = `${userId}-${uniqueSuffix}${extname(file.originalname)}`
    const path = `${type}s/${filename}`

    let fileContent: Buffer | null = file.buffer

    if (!fileContent && file.path) {
      fileContent = fs.readFileSync(file.path)
    }

    if (!fileContent) {
      throw new BadRequestException('No file content found to upload')
    }

    const { error } = await this.supabase.storage.from(this.bucketName).upload(path, fileContent, {
      contentType: file.mimetype,
      upsert: false,
    })

    if (error) {
      this.logger.error(
        `Supabase upload error for bucket "${this.bucketName}": ${error.message}`,
        error,
      )
      throw new InternalServerErrorException(
        `Supabase Storage Error: ${error.message}. Make sure the bucket "${this.bucketName}" exists and is public.`,
      )
    }

    const {
      data: { publicUrl },
    } = this.supabase.storage.from(this.bucketName).getPublicUrl(path)

    return {
      url: publicUrl,
      key: path,
      filename: filename,
      size: file.size,
    }
  }

  async delete(filename: string, type: 'video' | 'static'): Promise<void> {
    const path = `${type}s/${filename}`
    const { error } = await this.supabase.storage.from(this.bucketName).remove([path])

    if (error) {
      this.logger.error(`Supabase delete error: ${error.message}`, error)
    }
  }

  getFilePath(_filename: string, _type: 'video' | 'static'): string {
    throw new Error('Direct file path access is not supported for Supabase storage.')
  }
}
