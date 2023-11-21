import { ApiModelProperty } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { NotificationResponse } from "../../notification.response";

export class GetNotificationsResponse {
  @ApiModelProperty()
  unReadNotificationsCount: number;

  @ApiModelProperty({ type: NotificationResponse, isArray: true })
  notifications: NotificationResponse[];
}
