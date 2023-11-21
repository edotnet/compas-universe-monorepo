import { Global, Module } from "@nestjs/common";
import { RabbitMQModule } from "./rabbitmq";
import {
  RABBITMQ_GLOBAL_EXCHANGE,
  RABBITMQ_GLOBAL_EXCHANGE_TYPE,
} from "./events.constants";
import { EventsManagerService } from "./events-manager.service";
import { CustomLoggerService } from "../../../common";

// TODO: Currently every event handler will open a connection to amqp.
// Think how we can manage one connection per service for resource optimization
@Global()
@Module({
  imports: [
    RabbitMQModule.forRoot({
      uri: `${process.env.RMQ_PREFIX}${process.env.RMQ_USER}:${process.env.RMQ_PASSWORD}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`,
      exchanges: [
        {
          name: RABBITMQ_GLOBAL_EXCHANGE,
          type: RABBITMQ_GLOBAL_EXCHANGE_TYPE,
        },
      ],
    }),
  ],
  exports: [RabbitMQModule, EventsManagerService],
  providers: [EventsManagerService, CustomLoggerService],
})
export class EventsModule {}
