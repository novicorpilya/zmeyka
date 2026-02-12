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
  Delete,
} from '@nestjs/common'
import { SkipThrottle } from '@nestjs/throttler'
import { FileInterceptor } from '@nestjs/platform-express'
import { basename } from 'path'
import { Public } from '../auth/public.decorator'
import { Response } from 'express'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'
import { Role } from '@prisma/client'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { StorageService } from './storage.service'
import { UPLOAD_LIMITS, ALLOWED_EXTENSIONS } from './upload.constants'

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
        if (!file.mimetype.match(ALLOWED_EXTENSIONS.VIDEO)) {
          return cb(new BadRequestException('Only video files are allowed!'), false)
        }
        cb(null, true)
      },
      limits: {
        fileSize: UPLOAD_LIMITS.VIDEO_SIZE,
      },
    }),
  )
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ url: string; filename: string }> {
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
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(ALLOWED_EXTENSIONS.STATIC)) {
          // DENY HTML, SVG, XML, PHP, EXE, ETC.
          return cb(new BadRequestException('File type not allowed!'), false)
        }
        cb(null, true)
      },
      limits: {
        fileSize: UPLOAD_LIMITS.FILE_SIZE,
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ url: string; filename: string }> {
    if (!file) {
      throw new BadRequestException('File is required')
    }
    return this.storageService.upload(file, req.user.id, 'static')
  }

  @Public()
  @SkipThrottle()
  @Get('stream/:filename')
  streamVideo(@Param('filename') filename: string, @Res() res: Response): void {
    const safeName = basename(filename)
    const path = this.storageService.getFilePath(safeName, 'video')

    // Explicitly set headers to allow cross-origin loading of media
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'video/mp4')
    res.setHeader('Timing-Allow-Origin', '*')

    return res.sendFile(path)
  }

  @Public()
  @SkipThrottle()
  @Get('static/:filename')
  getFile(@Param('filename') filename: string, @Res() res: Response): void {
    const safeName = basename(filename)
    const path = this.storageService.getFilePath(safeName, 'static')

    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
    res.setHeader('Access-Control-Allow-Origin', '*')

    // SECURITY: Force download to prevent Stored XSS via HTML/SVG
    return res.download(path, safeName)
  }

  @Delete('video/:filename')
  @ApiBearerAuth()
  @Roles(Role.TEACHER, Role.ADMIN)
  async deleteVideo(@Param('filename') filename: string): Promise<{ success: boolean }> {
    await this.storageService.delete(filename, 'video')
    return { success: true }
  }

  @Delete('file/:filename')
  @ApiBearerAuth()
  @Roles(Role.TEACHER, Role.ADMIN)
  async deleteFile(@Param('filename') filename: string): Promise<{ success: boolean }> {
    await this.storageService.delete(filename, 'static')
    return { success: true }
  }
}
