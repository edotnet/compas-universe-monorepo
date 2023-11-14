import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ChatService } from './chat.service';
import {
  CHATS_GET,
  CHAT_ACTIVE_GET,
  CHAT_CREATE,
  CHAT_MESSAGES_GET,
  CHAT_SWITCH_ACTIVE,
  ChatResponse,
  CreateChatRequest,
  EmptyRequest,
  EmptyResponse,
  GetChatMessagesRequest,
  GetChatMessagesResponse,
  GetChatsRequest,
  GetChatsResponse,
  InjectAuth,
  SEND_CHAT_MESSAGE,
  SendMessageRequest,
  SwitchActiveChatRequest,
} from '@edotnet/shared-lib';

@Controller()
export class ChatController {
  constructor(@Inject(ChatService) private service: ChatService) {}

  @MessagePattern(CHAT_CREATE)
  async createChat(
    dto: InjectAuth<CreateChatRequest>,
  ): Promise<GetChatsResponse> {
    return this.service.createChat(dto.userId, dto);
  }

  @MessagePattern(CHATS_GET)
  async getChats(
    dto: InjectAuth<GetChatsRequest>,
  ): Promise<GetChatsResponse[]> {
    return this.service.getChats(dto.userId, dto);
  }

  @MessagePattern(SEND_CHAT_MESSAGE)
  async sendMessage(
    dto: InjectAuth<SendMessageRequest>,
  ): Promise<EmptyResponse> {
    return this.service.sendMessage(dto.userId, dto);
  }

  @MessagePattern(CHAT_MESSAGES_GET)
  async getChatMessages(
    dto: InjectAuth<GetChatMessagesRequest>,
  ): Promise<GetChatMessagesResponse[]> {
    return this.service.getChatMessages(dto.userId, dto);
  }

  @MessagePattern(CHAT_ACTIVE_GET)
  async getActiveChat(dto: InjectAuth<EmptyRequest>): Promise<ChatResponse> {
    return this.service.getActiveChat(dto.userId);
  }

  @MessagePattern(CHAT_SWITCH_ACTIVE)
  async switchActiveChat(
    dto: InjectAuth<SwitchActiveChatRequest>,
  ): Promise<EmptyResponse> {
    return this.service.switchActiveChat(dto.userId, dto);
  }
}
