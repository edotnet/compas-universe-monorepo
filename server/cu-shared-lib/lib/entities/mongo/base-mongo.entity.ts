import { Prop, Schema } from "@nestjs/mongoose";
import { now } from "mongoose";

@Schema({ timestamps: true })
export class BaseMongoModel {
  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}
