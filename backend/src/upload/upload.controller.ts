import { AuthenticatedRequest } from '../shared/interfaces/request.interface'
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Get,
  Param,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { basename } from 'path'
import { Public } from '../auth/public.decorator'
import { Response } from 'express'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'
import { Role } from '@prisma/client'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { StorageService } from './storage.service'

@ApiTags('upload')
@Controller('upload')
@UseGuards(RolesGuard)
export class UploadController {
  constructor(private readonly storageService: StorageService) {}

  @Post('video')
  @ApiBearerAuth()
  @Roles(Role.TEACHER, Role.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads/temp', // Temporary landing
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(mp4|quicktime|x-msvideo|x-matroska)$/)) {
          return cb(new BadRequestException('Only video files are allowed!'), false)
        }
        cb(null, true)
      },
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB
      },
    }),
  )
  async uploadVideo(@UploadedFile() file: Express.Multer.File, @Req() req: AuthenticatedRequest) {
    if (!file) {
      throw new BadRequestException('File is required')
    }
    return this.storageService.upload(file, req.user.id, 'video')
  }

  @Post('file')
  @ApiBearerAuth()
  @Roles(Role.TEACHER, Role.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads/temp', // Temporary landing
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: AuthenticatedRequest) {
    if (!file) {
      throw new BadRequestException('File is required')
    }
    return this.storageService.upload(file, req.user.id, 'static')
  }

  @Public()
  @Get('stream/:filename')
  streamVideo(@Param('filename') filename: string, @Res() res: Response) {
    const safeName = basename(filename)
    const path = this.storageService.getFilePath(safeName, 'video')
    return res.sendFile(path)
  }

  @Public()
  @Get('static/:filename')
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    const safeName = basename(filename)
    const path = this.storageService.getFilePath(safeName, 'static')
    return res.sendFile(path)
  }
}
