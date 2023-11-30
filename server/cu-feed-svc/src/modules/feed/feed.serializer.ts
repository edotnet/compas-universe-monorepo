import { PostExtendedResponse } from '@edotnet/shared-lib';
import { FeedQueryResponse } from './feed.types';

export const mapPostsToGetPostsResponse = (
  posts: FeedQueryResponse[],
): PostExtendedResponse[] =>
  posts.map((p: FeedQueryResponse) => ({
    id: p.id,
    content: p.content,
    commentsCount: p.commentsCount,
    likesCount: p.likesCount,
    createdAt: p.createdAt,
    user: {
      id: p.userId,
      userName: p.userName || `${p.firstName} ${p.lastName}`,
      profilePicture: p.profilePicture,
    },
  }));
