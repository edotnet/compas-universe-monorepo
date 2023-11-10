import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { HttpStatus, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  CustomLoggerService,
  EventsManagerService,
  WsMessageRequest,
} from '@edotnet/shared-lib';
import { BaseEvent } from '@edotnet/shared-lib/dist/dtos/events/base.event';

@WebSocketGateway({
  path: '/ws',
  namespace: '/ws',
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class WsServerGateway implements OnGatewayConnection, OnModuleInit {
  private readonly MAX_CONNECTIONS_PER_USER = 3;
  private sockets: Map<number, Socket[]> = new Map();

  constructor(
    private readonly jwtService: JwtService,
    private readonly logger: CustomLoggerService,
    private readonly eventManager: EventsManagerService,
  ) {}

  @WebSocketServer() server: Server;

  async onModuleInit() {
    this.logger.info('Websocket is initialized.');
  }

  async handleConnection(client: Socket) {
    const token = Array.isArray(client.handshake.query.accessToken)
      ? client.handshake.query.accessToken[0]
      : client.handshake.query.accessToken;

    try {
      const { id: userId } = this.jwtService.verify(token);
      const userSockets = this.sockets.get(userId) || [];

      if (userSockets.length >= this.MAX_CONNECTIONS_PER_USER) {
        client.disconnect();

        return;
      }

      userSockets.push(client);
      this.sockets.set(userId, userSockets);
      client.join(String(userId));

      client.on('disconnect', () => {
        this.handleDisconnection(client.id, userId);
      });
    } catch (err) {
      this.logger.error(err);
      client.disconnect();
    }
  }

  private handleDisconnection(clientId: string, userId: number) {
    try {
      const userSockets = this.sockets.get(userId);

      if (userSockets) {
        const updatedSockets = userSockets.filter(
          (socket) => socket.id !== clientId,
        );
        if (updatedSockets.length === 0) {
          this.sockets.delete(userId);
        } else {
          this.sockets.set(userId, updatedSockets);
        }
      }
    } catch (err) {
      this.logger.error(err);
    }
  }

  public emit(message: WsMessageRequest) {
    delete (message.data as BaseEvent).userId;

    if (message.receiver.userIds.length) {
      message.receiver.userIds.map((id) => {
        if (this.sockets.has(id)) {
          const sockets = this.sockets.get(id);

          sockets.forEach((socket: Socket) => {
            socket.emit(message.message, message.data);
          });
        }
      });
    }
  }
}
