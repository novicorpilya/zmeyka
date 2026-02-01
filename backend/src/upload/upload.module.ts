import { Module } from '@nestjs/common'
import { UploadController } from './upload.controller'
import { StorageService } from './storage.service'
import { SupabaseStorageService } from './supabase-storage.service'

@Module({
  controllers: [UploadController],
  providers: [
    {
      provide: StorageService,
      useClass: SupabaseStorageService,
    },
  ],
  exports: [StorageService],
})
export class UploadModule { }
