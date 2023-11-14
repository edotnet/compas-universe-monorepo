import {
  ChatResponse,
  ComposeAuthorizedDto,
  CreateChatRequest,
  EmptyResponse,
  GetChatMessagesRequest,
  GetChatMessagesResponse,
  GetChatsRequest,
  GetChatsResponse,
  SendMessageRequest,
  CHATS_GET,
  CHAT_ACTIVE_GET,
  CHAT_CREATE,
  CHAT_MESSAGES_GET,
  SEND_CHAT_MESSAGE,
  User,
  UsersServiceName,
  SwitchActiveChatRequest,
  CHAT_SWITCH_ACTIVE,
} from '@edotnet/shared-lib';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserGuard } from '../auth/guards/user.guard';

@ApiTags('chat')
@Controller('chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(@Inject(UsersServiceName) private readonly client: ClientProxy) {}

  @Post()
  @ApiOkResponse({ type: GetChatsResponse })
  async createChat(
    @UserGuard() user: User,
    @Body() dto: CreateChatRequest,
  ): Promise<GetChatsResponse> {
    return this.client
      .send(CHAT_CREATE, ComposeAuthorizedDto(user, dto))
      .toPromise();
  }

  @Get()
  @ApiOkResponse({ type: GetChatsResponse, isArray: true })
  async getChats(
    @UserGuard() user: User,
    @Query() dto: GetChatsRequest,
  ): Promise<GetChatsResponse[]> {
    return this.client
      .send(CHATS_GET, ComposeAuthorizedDto(user, dto))
      .toPromise();
  }

  @Post('/send-message')
  @ApiOkResponse({ type: EmptyResponse })
  async sendMessage(
    @UserGuard() user: User,
    @Body() dto: SendMessageRequest,
  ): Promise<EmptyResponse> {
    return this.client
      .send(SEND_CHAT_MESSAGE, ComposeAuthorizedDto(user, dto))
      .toPromise();
  }

  @Get('/messages/:chatId')
  @ApiOkResponse({ type: GetChatMessagesResponse, isArray: true })
  async getChatMessages(
    @UserGuard() user: User,
    @Param() dto: GetChatMessagesRequest,
  ): Promise<GetChatMessagesResponse[]> {
    return this.client
      .send(CHAT_MESSAGES_GET, ComposeAuthorizedDto(user, dto))
      .toPromise();
  }

  @Get('/active')
  @ApiOkResponse({ type: ChatResponse })
  async getActiveChat(@UserGuard() user: User): Promise<ChatResponse> {
    return this.client
      .send(CHAT_ACTIVE_GET, ComposeAuthorizedDto(user, {}))
      .toPromise();
  }

  @Put('/switch-active')
  @ApiOkResponse({ type: EmptyResponse })
  async switchActiveChat(
    @UserGuard() user: User,
    @Body() dto: SwitchActiveChatRequest,
  ): Promise<EmptyResponse> {
    return this.client
      .send(CHAT_SWITCH_ACTIVE, ComposeAuthorizedDto(user, dto))
      .toPromise();
  }
}
