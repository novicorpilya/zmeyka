import { Controller, Get, Param, Res, UseGuards, Req } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { Response } from 'express'
import { CertificatesService } from './certificates.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { AuthenticatedRequest } from '../shared/interfaces/request.interface'

@ApiTags('certificates')
@Controller('certificates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get(':courseId')
  @ApiOperation({ summary: 'Generate and download course certificate' })
  async downloadCertificate(
    @Param('courseId') courseId: string,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ): Promise<void> {
    return this.certificatesService.generateCertificate(req.user.id, courseId, res)
  }
}
