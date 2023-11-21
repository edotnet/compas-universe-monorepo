import { v4 as uuidv4 } from "uuid";
import { Injectable } from "@nestjs/common";
import { AmqpConnection } from "./rabbitmq";
import { RABBITMQ_GLOBAL_EXCHANGE } from "./events.constants";
import { CustomLoggerService } from "../../../common";
import { BaseEvent } from "../../../dtos/events/base.event";

@Injectable()
export class EventsManagerService {
  constructor(
    private readonly rabbitmqService: AmqpConnection,
    private readonly logger: CustomLoggerService
  ) {}

  public raise<T extends BaseEvent>(pattern: string, data: T): string {
    const eventId = uuidv4();

    this.logger.info(
      `EventManager: ${eventId} Raising event of type - ${pattern}. Data: ${JSON.stringify(
        data
      )}`
    );

    try {
      this.rabbitmqService.publish(RABBITMQ_GLOBAL_EXCHANGE, pattern, {
        ...data,
        eventId,
      });

      this.logger.info(`EventManager: ${pattern}:${eventId} Event Published`);

      return eventId;
    } catch (error) {
      this.logger.error(
        `EventManager: ${pattern}:${eventId} Event failed. Error details: ${JSON.stringify(
          error
        )}`
      );
    }
  }
}
