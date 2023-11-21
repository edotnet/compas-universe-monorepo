import { Module } from '@nestjs/common';
import { WsServerGateway } from './ws-server.gateway';
import { JwtModule } from '@nestjs/jwt';
import { WsServerService } from './ws-server.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomLoggerService, EventsManagerService } from '@edotnet/shared-lib';
@Module({
  imports: [
      JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => {
          return {
            secret: configService.get<string>('JWT_KEY'),
            expiresIn: configService.get<string>('JWT_EXPIRE_TIME'),
          };
        },
        inject: [ConfigService],
      }),
  ],
  providers: [WsServerGateway, WsServerService, CustomLoggerService],
})
export class WsServerModule {}
