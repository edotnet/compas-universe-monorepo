import { feedEntitiesPostgres } from "./feed";
import { userEntitiesPostgres } from "./users";
import { notificationsEntitiesPostgres } from "./notifications";

export * from "./feed";
export * from "./users";
export * from "./notifications";

export const entitiesPostgres = [
  ...feedEntitiesPostgres,
  ...userEntitiesPostgres,
  ...notificationsEntitiesPostgres,
];
