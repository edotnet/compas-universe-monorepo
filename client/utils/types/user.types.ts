export declare enum UserTypes {
  SINGER = "Singer",
}

export interface IUser {
  id: number;
  userName: string;
  profilePicture: string;
}

export interface IExtendedUser extends IUser {
  type: UserTypes;
}

export interface IUserProfileResponse {
  user: IExtendedUser;
  isFriend: boolean;
}

export interface IFriend extends IUser {
  isFriend: boolean;
  me: boolean;
}
