import { IUploadedFile } from "./files.types";
import { IUser } from "./user.types";

export interface IContent {
  description?: string;
  media?: IUploadedFile[];
}

export interface IPost {
  id: number;
  content: IContent;
  user: IUser;
  createdAt: Date;
}

export interface IPostExtended extends IPost {
  commentsCount: number;
  likesCount: number;
  liked: boolean;
  lastComment: IExtendedComment;
}

export interface IComment {
  id: number;
  postId: number;
  content: string;
  replyTo: number;
  createdAt: Date;
  user: IUser;
}

export interface IExtendedComment extends IComment {
  replies: IExtendedComment[];
  replyCount: number;
  liked: boolean;
}
