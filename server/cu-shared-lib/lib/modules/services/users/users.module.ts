import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { UsersService } from "./users.service";
import { ClientsModule } from "@nestjs/microservices";
import { UsersServiceClientOptions, UsersServiceName } from "../options";


@Module({
  imports: [
    BullModule.registerQueue({
      name: UsersServiceName,
    }),
    ClientsModule.register([UsersServiceClientOptions]),
  ],
  controllers: [],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
