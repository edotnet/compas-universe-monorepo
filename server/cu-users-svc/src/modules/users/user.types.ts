import { Nullable } from '@edotnet/shared-lib';

export interface FriendsQueryResponse {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  profilePicture: Nullable<string>;
  isFriend: boolean;
  me: boolean;
}
