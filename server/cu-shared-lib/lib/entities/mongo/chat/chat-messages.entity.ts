import { UserResponse } from "../../../dtos";
import { BaseMongoModel } from "../base-mongo.entity";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum MediaTypes {
  VOICE = "VOICE",
  PHOTO = "PHOTO",
  VIDEO = "VIDEO",
  FILE = "FILE",
}

export class MediaData {
  @Prop()
  type: MediaTypes;

  @Prop({ type: Object })
  meta: Object;
}

@Schema()
export class ChatMessages extends BaseMongoModel {
  @Prop()
  chatId: number;

  @Prop({ type: Object })
  user: UserResponse;

  @Prop()
  text: string;

  @Prop({ type: Array })
  media: MediaData[];

  @Prop()
  seen: boolean;
}

export const ChatMessagesSchema = SchemaFactory.createForClass(ChatMessages);
