import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ChatService } from './chat.service';
import {
  ChatResponse,
  CreateChatRequest,
  EmptyRequest,
  EmptyResponse,
  GetChatMessagesRequest,
  GetChatMessagesResponse,
  GetChatsRequest,
  GetChatsResponse,
  InjectAuth,
  SendMessageRequest,
  USER_CHATS_GET,
  USER_CHAT_ACTIVE_GET,
  USER_CHAT_CREATE,
  USER_CHAT_MESSAGES_GET,
  USER_SEND_CHAT_MESSAGE,
} from '@edotnet/shared-lib';

@Controller()
export class ChatController {
  constructor(@Inject(ChatService) private service: ChatService) {}

  @MessagePattern(USER_CHAT_CREATE)
  async createChat(dto: InjectAuth<CreateChatRequest>): Promise<EmptyResponse> {
    return this.service.createChat(dto.userId, dto);
  }

  @MessagePattern(USER_CHATS_GET)
  async getChats(
    dto: InjectAuth<GetChatsRequest>,
  ): Promise<GetChatsResponse[]> {
    return this.service.getChats(dto.userId, dto);
  }

  @MessagePattern(USER_SEND_CHAT_MESSAGE)
  async sendMessage(
    dto: InjectAuth<SendMessageRequest>,
  ): Promise<EmptyResponse> {
    return this.service.sendMessage(dto.userId, dto);
  }

  @MessagePattern(USER_CHAT_MESSAGES_GET)
  async getChatMessages(
    dto: InjectAuth<GetChatMessagesRequest>,
  ): Promise<GetChatMessagesResponse[]> {
    return this.service.getChatMessages(dto.userId, dto);
  }

  @MessagePattern(USER_CHAT_ACTIVE_GET)
  async getActiveChat(dto: InjectAuth<EmptyRequest>): Promise<ChatResponse> {
    return this.service.getActiveChat(dto.userId);
  }
}
