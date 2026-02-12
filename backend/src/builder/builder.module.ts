import { Module } from '@nestjs/common'
import { BuilderService } from './builder.service'
import { BuilderController } from './builder.controller'
import { PrismaModule } from '../prisma/prisma.module'
import { AIModule } from '../ai/ai.module'

@Module({
  imports: [PrismaModule, AIModule],
  controllers: [BuilderController],
  providers: [BuilderService],
})
export class BuilderModule {}
