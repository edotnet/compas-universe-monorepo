import { ChatMessages, ChatMessagesSchema } from "./chat-messages.entity";

export * from "./chat-messages.entity";

export const chatEntitiesMongo = [
  { name: ChatMessages.name, schema: ChatMessagesSchema },
];
