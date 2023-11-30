import { ClientProviderOptions, Transport } from "@nestjs/microservices";
import { CustomSerializer } from "../../../tools";

export const FeedServiceName = "feed";

export const FeedMicroservice = {
  logger: process.env.DEBUG
    ? ["error", "warn", "log", "debug"]
    : ["error", "warn"],
  transport: Transport.RMQ,
  options: {
    urls: [
      `${process.env.RMQ_PREFIX}${process.env.RMQ_USER}:${process.env.RMQ_PASSWORD}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`,
    ],
    queue: FeedServiceName,
    queueOptions: {
      durable: true,
    },
  },
};

export const FeedServiceClientOptions: ClientProviderOptions = {
  name: FeedServiceName,
  transport: Transport.RMQ,
  options: {
    urls: [
      `${process.env.RMQ_PREFIX}${process.env.RMQ_USER}:${process.env.RMQ_PASSWORD}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`,
    ],
    queue: FeedServiceName,
    queueOptions: {
      durable: true,
    },
    serializer: new CustomSerializer(),
  },
};
