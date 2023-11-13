import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { Repository, Brackets, DeepPartial, In } from 'typeorm';
import {
  EmptyResponse,
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
  NEW_MESSAGE_EVENT,
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
    const friends = await this.getUserFriends(userId, dto.searchTerm);

    const chats: GetChatsResponse[] = await Promise.all(
      friends.map(async (f) => {
        const users = [f.friend.id, userId];
        const queryBuilder = this.chatRepository.createQueryBuilder('chat');

        users.forEach((id, index) => {
          const alias = `users${index + 1}`;
          queryBuilder
            .innerJoin('chat.users', alias)
            .andWhere(`${alias}.user.id = :userId${index + 1}`, {
              [`userId${index + 1}`]: id,
            });
        });

        const chat = await queryBuilder
          .leftJoinAndSelect('chat.users', 'fullUsers')
          .leftJoinAndSelect('fullUsers.user', 'user')
          .leftJoinAndSelect('user.profile', 'profile')
          .getOne();

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

    return chats;
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

    this.eventManager.raise(NEW_MESSAGE_EVENT, {
      userId,
      user: mapUserToUserResponse(chatUser.user),
      message: mapChatMessageToChatMessageResponse(message),
      userIds: chat.users.map((u) => u.user.id),
      chatId: chat.id,
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

  async switchActiveChat(
    userId: number,
    dto: GetChatMessagesRequest,
  ): Promise<EmptyResponse> {
    const userChat = await this.userChatsRepository.findOne({
      where: { user: { id: userId }, inChat: true },
    });

    userChat.inChat = false;

    await this.userChatsRepository.save(userChat);

    const switchedChat = await this.userChatsRepository.findOne({
      where: { user: { id: userId }, chat: { id: dto.chatId } },
    });

    switchedChat.inChat = true;

    await this.userChatsRepository.save(switchedChat);

    return {};
  }

  async removeConfersations(userId: number, friends: UserFriend[]) {
    friends.map(async (f) => {
      const users = [f.friend.id, userId];
      const queryBuilder = this.chatRepository.createQueryBuilder('chat');

      users.forEach((id, index) => {
        const alias = `users${index + 1}`;
        queryBuilder
          .innerJoin('chat.users', alias)
          .andWhere(`${alias}.user.id = :userId${index + 1}`, {
            [`userId${index + 1}`]: id,
          });
      });

      const chat = await queryBuilder
        .leftJoinAndSelect('chat.users', 'fullUsers')
        .leftJoinAndSelect('fullUsers.user', 'user')
        .leftJoinAndSelect('user.profile', 'profile')
        .getOne();

      chat.archived = true;
      await this.chatRepository.save(chat);

      if (chat) {
        await this.chatMessagesRepository.deleteMany(
          {
            chatId: chat.id,
          },
          { $eq: ['$user.id', userId] },
        );
      }
    });
  }

  private async getUserFriends(
    userId: number,
    searchTerm?: string,
  ): Promise<UserFriend[]> {
    const querybuilder = this.userFriendsRepository
      .createQueryBuilder('friends')
      .leftJoinAndSelect('friends.friend', 'friend')
      .leftJoinAndSelect('friend.profile', 'profile')
      .where('friends."userId" = :userId', { userId });

    if (searchTerm) {
      querybuilder.andWhere(
        new Brackets((qb) => {
          qb.where('profile.firstName ILIKE :searchTerm', {
            searchTerm: `%${searchTerm}%`,
          });
          qb.orWhere('profile.lastName ILIKE :searchTerm', {
            searchTerm: `%${searchTerm}%`,
          });
          qb.orWhere('profile.userName ILIKE :searchTerm', {
            searchTerm: `%${searchTerm}%`,
          });
        }),
      );
    }

    return await querybuilder.getMany();
  }
}
