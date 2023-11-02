import { User, UserResponse, mapUserToUserResponse } from '@edotnet/shared-lib';

export const mapUsersToGetUsersResponse = (users: User[]): UserResponse[] =>
  users.map((u: User) => mapUserToUserResponse(u));
