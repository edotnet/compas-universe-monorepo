import { IsNotEmpty } from "class-validator";
import { ChatResponse } from "../../chat.response";
import { UserResponse } from "../../user.response";
import { MediaData } from "../../../entities";

export class MessageResponse {
  @IsNotEmpty()
  user: UserResponse;

  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  seen: boolean;

  @IsNotEmpty()
  media: MediaData[];
}

export class GetChatsResponse {
  @IsNotEmpty()
  chat: ChatResponse;

  @IsNotEmpty()
  friend: UserResponse;

  @IsNotEmpty()
  lastMessage: MessageResponse;
}
