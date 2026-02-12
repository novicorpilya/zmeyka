import { Module, Global, forwardRef } from '@nestjs/common'
import { EventsGateway } from './gateways/events.gateway'
import { AuthModule } from '../auth/auth.module'

@Global()
@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class SharedModule {}
