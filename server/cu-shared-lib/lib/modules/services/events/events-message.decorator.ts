import { RABBITMQ_GLOBAL_EXCHANGE } from "./events.constants";
import { makeRabbitDecorator } from "./rabbitmq";

export const EventsMessage = (
  messageName: string,
  queue: string
): MethodDecorator =>
  makeRabbitDecorator({ type: "subscribe" })({
    exchange: RABBITMQ_GLOBAL_EXCHANGE,
    routingKey: messageName,
    queue: `${queue}_${messageName}`,
  });
