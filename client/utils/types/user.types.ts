export declare enum UserTypes {
    SINGER = "Singer"
}

export interface IUser {
  id: number;
  userName: string;
  profilePicture: string;
}

export interface IExtendedUser extends IUser {
    type: UserTypes
}
