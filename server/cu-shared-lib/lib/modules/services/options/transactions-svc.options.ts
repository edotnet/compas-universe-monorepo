import { ClientProviderOptions, Transport } from "@nestjs/microservices";
import { CustomSerializer } from "../../../tools";

export const TransactionsServiceName = "transactions";

export const TransactionsMicroservice = {
  logger: process.env.DEBUG
    ? ["error", "warn", "log", "debug"]
    : ["error", "warn"],
  transport: Transport.RMQ,
  options: {
    urls: [
      `${process.env.RMQ_PREFIX}${process.env.RMQ_USER}:${process.env.RMQ_PASSWORD}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`,
    ],
    queue: TransactionsServiceName,
    queueOptions: {
      durable: true,
    },
  },
};

export const TransactionsServiceClientOptions: ClientProviderOptions = {
  name: TransactionsServiceName,
  transport: Transport.RMQ,
  options: {
    urls: [
      `${process.env.RMQ_PREFIX}${process.env.RMQ_USER}:${process.env.RMQ_PASSWORD}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`,
    ],
    queue: TransactionsServiceName,
    queueOptions: {
      durable: true,
    },
    serializer: new CustomSerializer(),
  },
};
