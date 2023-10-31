import { UserResponse, mapUserToUserResponse } from '@edotnet/shared-lib';
import { User } from './entities/user.entity';

export const mapUsersToGetUsersResponse = (users: User[]): UserResponse[] =>
  users.map((u: User) => mapUserToUserResponse(u));
