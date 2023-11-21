import { User } from "./user.entity";
import { Chat } from "./chat.entity";
import { Provider } from "./provider.entity";
import { UserChat } from "./user-chats.entity";
import { UserFriend } from "./user-friends.entity";
import { UserProfile } from "./user-profile.entity";
import { UserProvider } from "./user-provider.entity";

export * from "./chat.entity";
export * from "./user.entity";
export * from "./provider.entity";
export * from "./user-chats.entity";
export * from "./user-profile.entity";
export * from "./user-friends.entity";
export * from "./user-provider.entity";

export const userEntitiesPostgres = [
  User,
  Chat,
  Provider,
  UserChat,
  UserFriend,
  UserProfile,
  UserProvider,
];
