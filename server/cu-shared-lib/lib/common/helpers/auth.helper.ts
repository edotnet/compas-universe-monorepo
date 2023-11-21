import { User } from "../../entities/postgres";
import { InjectAuth } from "./types";

export const ComposeAuthorizedDto = <T>(user: User, dto: T): InjectAuth<T> => ({
  userId: user.id,
  ...dto,
});
