import {
  User,
  UserResponse,
  GetFriendsResponse,
  mapUserToUserResponse,
} from '@edotnet/shared-lib';
import { FriendsQueryResponse } from './user.types';

export const mapFriendsToGetFriendsResponse = (
  friends: FriendsQueryResponse[],
): GetFriendsResponse[] =>
  friends.map((f) => ({
    id: f.id,
    userName: f.userName || `${f.firstName} ${f.lastName}`,
    profilePicture: f.profilePicture,
    isFriend: f.isFriend,
    me: f.me,
  }));

export const mapUsersToGetUsersResponse = (users: User[]): UserResponse[] =>
  users.map((u: User) => mapUserToUserResponse(u));