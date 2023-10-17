import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_KEY'),
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRE_TIME'),
          },
        };
      },
      inject: [ConfigService],
    }),
    ClientsModule.register([
      {
        name: 'users',
        transport: Transport.RMQ,
        options: {
          urls: [
            `${process.env.RMQ_PREFIX}${process.env.RMQ_USER}:${process.env.RMQ_PASSWORD}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`,
          ],
          queue: 'users',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    ConfigModule,
  ],
  providers: [GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
