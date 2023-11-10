import { IsArray, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class WsReceiver {
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @ApiProperty()
  userIds?: number[];
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
