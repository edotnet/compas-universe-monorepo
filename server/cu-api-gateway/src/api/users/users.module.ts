import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  controllers: [UsersController],
  imports: [
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
  ],
})
export class UsersModule {}
