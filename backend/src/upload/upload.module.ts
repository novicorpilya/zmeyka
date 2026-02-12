import { Module } from '@nestjs/common'
import { UploadController } from './upload.controller'
import { LocalStorageService, StorageService } from './storage.service'

@Module({
  controllers: [UploadController],
  providers: [
    {
      provide: StorageService,
      useClass: LocalStorageService, // Switch to Local for local dev stability
    },
  ],
  exports: [StorageService],
})
export class UploadModule {}
