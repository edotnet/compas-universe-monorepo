import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { Repository, Not, Brackets, DeepPartial, In } from 'typeorm';
import {
  EmptyResponse,
  User,
  UserFriend,
  ChatMessages,
  Chat,
  UserChat,
  mapUserToUserResponse,
  GetChatsRequest,
  GetChatsResponse,
  GetChatMessagesRequest,
  SendMessageRequest,
  mapChatMessageToChatMessageResponse,
  CreateChatRequest,
  EventsManagerService,
  GetChatMessagesResponse,
  ChatResponse,
  mapChatToChatResponse,
  MessageEvent,
} from '@edotnet/shared-lib';
import { mapChatsToGetChatsResponse } from './chat.serializer';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(UserFriend)
    private userFriendsRepository: Repository<UserFriend>,
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(UserChat)
    private userChatsRepository: Repository<UserChat>,
    @InjectModel(ChatMessages.name)
    private chatMessagesRepository: Model<ChatMessages>,
    private readonly eventManager: EventsManagerService,
  ) {}

  async createChat(
    userId: number,
    dto: CreateChatRequest,
  ): Promise<EmptyResponse> {
    const isFriend = await this.userFriendsRepository.findOne({
      where: { friend: { id: In(dto.userIds) }, user: { id: userId } },
    });

    if (!isFriend) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'USER_IS_NOT_FRIEND',
      });
    }

    dto.userIds.push(userId);

    const chat: DeepPartial<Chat> = new Chat();
    chat.users = dto.userIds.map((id: number) => ({
      chat,
      user: { id },
      inChat: true,
    }));

    await this.chatRepository.save(chat);

    return {};
  }

  async getChats(
    userId: number,
    dto: GetChatsRequest,
  ): Promise<GetChatsResponse[]> {
    const querybuilder = this.userFriendsRepository
      .createQueryBuilder('friends')
      .leftJoinAndSelect('friends.friend', 'friend')
      .leftJoinAndSelect('friend.profile', 'profile')
      .where('friends."userId" = :userId', { userId });

    if (dto.searchTerm) {
      querybuilder.andWhere(
        new Brackets((qb) => {
          qb.where('profile.firstName ILIKE :searchTerm', {
            searchTerm: `%${dto.searchTerm}%`,
          });
          qb.orWhere('profile.lastName ILIKE :searchTerm', {
            searchTerm: `%${dto.searchTerm}%`,
          });
          qb.orWhere('profile.userName ILIKE :searchTerm', {
            searchTerm: `%${dto.searchTerm}%`,
          });
        }),
      );
    }

    const friends = await querybuilder.getMany();

    const users: GetChatsResponse[] = await Promise.all(
      friends.map(async (f) => {
        const chat = await this.chatRepository.findOne({
          where: {
            users: { user: { id: f.friend.id } },
          },
          relations: ['users.user.profile'],
        });

        let message: ChatMessages;

        if (chat) {
          message = await this.chatMessagesRepository
            .findOne(
              {
                chatId: chat.id,
              },
              {},
              { $eq: ['$user.id', userId] },
            )
            .sort({ createdAt: 'desc', _id: 'desc' });

          return mapChatsToGetChatsResponse(f.friend, chat, message);
        }

        return mapChatsToGetChatsResponse(f.friend);
      }),
    );

    return users;
  }

  async sendMessage(
    userId: number,
    dto: SendMessageRequest,
  ): Promise<EmptyResponse> {
    const chat = await this.chatRepository.findOne({
      where: { id: dto.chatId, archived: false },
      relations: ['users.user.profile'],
    });

    if (!chat) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'CHAT_DOES_NOT_EXIST',
      });
    }

    const chatUser = await this.userChatsRepository.findOne({
      where: {
        user: { id: userId },
        chat: { id: dto.chatId },
      },
      relations: ['user.profile'],
    });

    const newMessage = new ChatMessages();

    newMessage.chatId = dto.chatId;
    newMessage.text = dto.text;
    newMessage.seen = chatUser.inChat;
    newMessage.user = mapUserToUserResponse(chatUser.user);
    // newMessage.media = dto.media

    const message = new this.chatMessagesRepository(newMessage);
    await message.save();

    this.eventManager.raise('NEW_MESSAGE_EVENT', {
      userId,
      user: mapUserToUserResponse(chatUser.user),
      message: mapChatMessageToChatMessageResponse(message),
      userIds: chat.users.map((u) => u.user.id),
    } as MessageEvent);

    return {};
  }

  async getChatMessages(
    userId: number,
    dto: GetChatMessagesRequest,
  ): Promise<GetChatMessagesResponse[]> {
    const chat = await this.chatRepository.findOne({
      where: { id: dto.chatId },
    });

    if (!chat) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'CHAT_DOES_NOT_EXIST',
      });
    }

    const messages = await this.chatMessagesRepository.aggregate([
      { $match: { chatId: chat.id } },
      {
        $project: {
          user: 1,
          text: 1,
          media: 1,
          seen: 1,
          me: { $eq: ['$user.id', userId] },
          createdAt: 1,
        },
      },
      { $sort: { createdAt: -1, _id: -1 } },
    ]);

    return messages;
  }

  async getActiveChat(userId: number): Promise<ChatResponse> {
    const userChat = await this.userChatsRepository.findOne({
      where: { user: { id: userId }, inChat: true },
      relations: ['chat.users.user.profile'],
    });

    if (!userChat) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'CHAT_DOES_NOT_EXIST',
      });
    }

    return mapChatToChatResponse(userChat.chat);
  }
}
