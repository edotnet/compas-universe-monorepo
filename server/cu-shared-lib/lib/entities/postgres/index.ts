import { userEntitiesPostgres } from "./users";
import { notificationtEntitiesPostgres } from "./notifications";

export * from "./users";
export * from "./notifications";

export const entitiesPostgres = [
  ...userEntitiesPostgres,
  ...notificationtEntitiesPostgres,
];
