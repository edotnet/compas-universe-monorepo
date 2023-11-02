import { User } from "./user.entity";
import { Provider } from "./provider.entity";
import { UserFriend } from "./user-friends.entity";
import { UserProfile } from "./user-profile.entity";
import { UserProvider } from "./user-provider.entity";

export * from "./user.entity";
export * from "./provider.entity";
export * from "./user-profile.entity";
export * from "./user-friends.entity";
export * from "./user-provider.entity";

export const userEntitiesPostgres = [
  User,
  Provider,
  UserFriend,
  UserProfile,
  UserProvider,
];
