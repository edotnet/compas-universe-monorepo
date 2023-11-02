import { IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { BaseEvent } from "../../events/base.event";

export class WsReceiver {
  @IsOptional()
  @ApiProperty()
  userId?: number;
}

export class WsMessageRequest {
  @IsNotEmpty()
  @ApiProperty({ type: WsReceiver })
  receiver: WsReceiver;

  @IsNotEmpty()
  @ApiProperty()
  message: string;

  @IsNotEmpty()
  @ApiProperty()
  data: unknown;
}
