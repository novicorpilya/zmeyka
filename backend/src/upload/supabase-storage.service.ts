import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { ConfigService } from '@nestjs/config'
import { StorageService, StorageResult } from './storage.service'
import { extname } from 'path'

@Injectable()
export class SupabaseStorageService extends StorageService {
    private supabase: SupabaseClient
    private readonly bucketName = 'zmeyka-assets' // User will need to create this bucket

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

        const { data, error } = await this.supabase.storage
            .from(this.bucketName)
            .upload(path, file.buffer || file.path, {
                contentType: file.mimetype,
                upsert: false,
            })

        if (error) {
            console.error('Supabase upload error:', error)
            throw new InternalServerErrorException(`Failed to upload to Supabase: ${error.message}`)
        }

        const { data: { publicUrl } } = this.supabase.storage
            .from(this.bucketName)
            .getPublicUrl(path)

        return {
            url: publicUrl,
            key: path,
            filename: filename,
            size: file.size,
        }
    }

    getFilePath(_filename: string, _type: 'video' | 'static'): string {
        throw new Error('Direct file path access is not supported for Supabase storage.')
    }
}
