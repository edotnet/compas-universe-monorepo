import { Nullable } from '@edotnet/shared-lib';

export class FeedQueryResponse {
  id: number;
  content: object;
  createdAt: Date;
  commentsCount: number;
  likesCount: number;
  userId: number;
  firstName: string;
  lastName: string;
  userName: string;
  profilePicture: Nullable<string>;
}
