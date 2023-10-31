import { IsNotEmpty } from "class-validator";
import { User, UserTypes, getFullName } from "../entities";

export class UserResponse {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  profilePicture: string;
}

export class UserExtendedResponse extends UserResponse {
  @IsNotEmpty()
  type: UserTypes;
}

export const mapUserToUserResponse = (user: User): UserResponse => ({
  id: user.id,
  userName: user.profile.userName || getFullName(user.profile),
  profilePicture: user.profile.profilePicture,
});

export const mapUserToUserExtendedResponse = (
  user: User
): UserExtendedResponse => ({
  ...mapUserToUserResponse(user),
  type: user.profile.type,
});
