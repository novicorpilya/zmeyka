import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@WebSocketGateway({
  cors: {
    origin: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean),
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server

  private logger: Logger = new Logger('EventsGateway')

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      const token = client.handshake.auth.token?.split(' ')[1] || client.handshake.query.token
      if (!token) {
        this.logger.warn(`Client ${client.id} connected without token. Disconnecting...`)
        client.disconnect()
        return
      }

      const payload = await this.jwtService.verifyAsync(token as string)
      client.data.user = payload

      // Join a room specific to this user
      void client.join(`user_${payload.sub}`)

      this.logger.log(`Client connected: ${client.id} (User: ${payload.sub})`)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e)
      this.logger.error(`Connection verification failed: ${message}`)
      client.disconnect()
    }
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`)
  }

  sendToUser(userId: string, event: string, data: unknown): void {
    this.server.to(`user_${userId}`).emit(event, data)
  }

  broadcast(event: string, data: unknown): void {
    this.server.emit(event, data)
  }
}
