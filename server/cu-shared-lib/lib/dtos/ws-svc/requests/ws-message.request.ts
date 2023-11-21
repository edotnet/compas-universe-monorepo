import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class WsReceiver {
  @IsOptional()
  @IsNumber()
  userId?: number;
}

export class WsMessageRequest<T> {
  @IsNotEmpty()
  receiver: WsReceiver;

  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  data: T;
}
