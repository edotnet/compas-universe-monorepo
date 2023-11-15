import { Prop, Schema } from "@nestjs/mongoose";
import mongoose, { now, ObjectId } from "mongoose";

@Schema({ timestamps: true })
export class BaseMongoModel {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  })
  _id: ObjectId;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}
