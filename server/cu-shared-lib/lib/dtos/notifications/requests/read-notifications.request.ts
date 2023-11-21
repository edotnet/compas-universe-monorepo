import { ApiProperty } from "@nestjs/swagger";

export class ReadNotificationsRequest {
  @ApiProperty()
  ids: number[];
}
