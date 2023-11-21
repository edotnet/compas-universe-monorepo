import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { Repository, Brackets, DeepPartial, SelectQueryBuilder } from 'typeorm';
import {
  EmptyResponse,
  UserFriend,
  ChatMessages,
  Chat,
  UserChat,
  mapUserToUserResponse,
  GetChatsRequest,
  GetChatsResponse,
  SendMessageRequest,
  mapChatMessageToChatMessageResponse,
  CreateChatRequest,
  EventsManagerService,
  ChatResponse,
  mapChatToChatResponse,
  MessageEvent,
  NEW_MESSAGE_EVENT,
  User,
  ExtendedMessageResponse,
  MESSAGE_SEEN_EVENT,
  MessageSeenEvent,
} from '@edotnet/shared-lib';
import { mapChatsToGetChatsResponse } from './chat.serializer';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRequest } from '@edotnet/shared-lib/dist/dtos/chat/requests/chat.request';

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
  ): Promise<GetChatsResponse> {
    const isFriend: UserFriend = await this.userFriendsRepository.findOne({
      where: { friend: { id: dto.friendId }, user: { id: userId } },
      relations: ['friend.profile'],
    });

    if (!isFriend) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'USER_IS_NOT_FRIEND',
      });
    }

    const userIds: number[] = [dto.friendId, userId];

    const existingChat = await this.getChatForUsers(userIds);

    if (existingChat) {
      await this.inactivateUserInChat(userId, existingChat.id);
      const count = await this.getUnSeenMessagesCount(userId, existingChat.id);

      return mapChatsToGetChatsResponse(isFriend.friend, count, existingChat);
    }

    const chat: DeepPartial<Chat> = new Chat();
    chat.users = userIds.map(
      (id: number): DeepPartial<UserChat> => ({
        chat,
        user: { id },
        inChat: id === userId,
      }),
    );

    await this.chatRepository.save(chat);

    const createdChat: Chat = await this.getChatForUsers(userIds);

    await this.inactivateUserInChat(userId, createdChat.id);
    const count = await this.getUnSeenMessagesCount(userId, createdChat.id);

    return mapChatsToGetChatsResponse(isFriend.friend, count, createdChat);
  }

  async getChats(
    userId: number,
    dto: GetChatsRequest,
  ): Promise<GetChatsResponse[]> {
    const friends: UserFriend[] = await this.getUserFriends(
      userId,
      dto.searchTerm,
    );

    const chats: GetChatsResponse[] = await Promise.all(
      friends.map(async (f) => {
        const userIds: number[] = [f.friend.id, userId];
        const chat: Chat = await this.getChatForUsers(userIds);

        let message: ExtendedMessageResponse;

        if (chat) {
          const count = await this.getUnSeenMessagesCount(userId, chat.id);

          const userChat = await this.userChatsRepository.findOne({
            where: { chat: { id: chat.id }, user: { id: userId } },
          });

          message = await this.getLastMessage(chat.id, userId);

          return mapChatsToGetChatsResponse(
            f.friend,
            count,
            chat,
            userChat,
            message,
          );
        }

        return mapChatsToGetChatsResponse(f.friend, 0);
      }),
    );

    return chats;
  }

  async sendMessage(
    userId: number,
    dto: SendMessageRequest,
  ): Promise<EmptyResponse> {
    const chat: Chat = await this.chatRepository.findOne({
      where: { id: dto.chatId, archived: false },
      relations: ['users.user.profile'],
    });

    if (!chat) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'CHAT_DOES_NOT_EXIST',
      });
    }

    const chatUser: UserChat = await this.userChatsRepository.findOne({
      where: {
        user: { id: userId },
        chat: { id: dto.chatId },
      },
      relations: ['user.profile'],
    });

    const chatFriend: UserChat = await this.userChatsRepository.findOne({
      where: {
        user: { id: chat.users.find((u) => u.user.id != userId).user.id },
        chat: { id: dto.chatId },
      },
    });

    const newMessage: ChatMessages = new ChatMessages();

    newMessage.chatId = dto.chatId;
    newMessage.text = dto.text;
    newMessage.seen = chatFriend.inChat;
    newMessage.user = mapUserToUserResponse(chatUser.user);
    // newMessage.media = dto.media

    const message = new this.chatMessagesRepository(newMessage);
    await message.save();

    chat.users.forEach((u) => {
      this.eventManager.raise(NEW_MESSAGE_EVENT, {
        userId: u.user.id,
        message: {
          ...mapChatMessageToChatMessageResponse(message),
          me: u.user.id === userId,
        },
        inChat: u.inChat,
        chatId: chat.id,
      } as MessageEvent);
    });

    return {};
  }

  async getChatMessages(
    userId: number,
    dto: ChatRequest,
  ): Promise<ExtendedMessageResponse[]> {
    const chat: Chat = await this.chatRepository.findOne({
      where: { id: dto.chatId },
    });

    if (!chat) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'CHAT_DOES_NOT_EXIST',
      });
    }

    const messages: ExtendedMessageResponse[] =
      await this.chatMessagesRepository.aggregate([
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
    const userChat: UserChat = await this.userChatsRepository.findOne({
      where: { user: { id: userId }, inChat: true, chat: { archived: false } },
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
    dto: ChatRequest,
  ): Promise<EmptyResponse> {
    await this.inactivateUserInChat(userId, dto.chatId);

    const switchedChat: UserChat = await this.userChatsRepository.findOne({
      where: { user: { id: userId }, chat: { id: dto.chatId } },
      relations: ['chat.users.user'],
    });

    switchedChat.inChat = true;

    await this.userChatsRepository.save(switchedChat);

    const friend: User = switchedChat.chat.users.find(
      (u) => u.user.id !== userId,
    ).user;

    const lastMessage: ExtendedMessageResponse = await this.getLastMessage(
      dto.chatId,
      friend.id,
    );

    if (lastMessage && lastMessage.seen) {
      return;
    }

    const messages: ChatMessages[] = await this.chatMessagesRepository.find({
      chatId: dto.chatId,
      'user.id': friend.id,
    });

    await this.chatMessagesRepository.updateMany(
      { _id: { $in: messages.map((message: ChatMessages) => message._id) } },
      { $set: { seen: true } },
    );

    const updatedLastMessage: ExtendedMessageResponse =
      await this.getLastMessage(dto.chatId, friend.id);

    this.eventManager.raise(MESSAGE_SEEN_EVENT, {
      userId: friend.id,
      message: updatedLastMessage,
      chatId: dto.chatId,
    } as MessageSeenEvent);

    return {};
  }

  async removeConfersations(userId: number, friends: UserFriend[]) {
    if (friends.length) {
      friends.map(async (f: UserFriend) => {
        const userIds: number[] = [f.friend.id, userId];

        const chat: Chat = await this.getChatForUsers(userIds);
        if (chat) {
          chat.archived = true;

          await this.chatRepository.save(chat);
          await this.chatMessagesRepository.deleteMany(
            {
              chatId: chat.id,
            },
            { $eq: ['$user.id', userId] },
          );
        }
      });
    }
  }

  private async getUserFriends(
    userId: number,
    searchTerm?: string,
  ): Promise<UserFriend[]> {
    const querybuilder: SelectQueryBuilder<UserFriend> =
      this.userFriendsRepository
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

  private async getChatForUsers(userIds: number[]): Promise<Chat> {
    const queryBuilder: SelectQueryBuilder<Chat> =
      this.chatRepository.createQueryBuilder('chat');

    userIds.forEach((id, index) => {
      const alias: string = `users${index + 1}`;
      queryBuilder
        .innerJoin('chat.users', alias)
        .andWhere(`${alias}.user.id = :userId${index + 1}`, {
          [`userId${index + 1}`]: id,
        });
    });

    const chat: Chat = await queryBuilder
      .leftJoinAndSelect('chat.users', 'users')
      .leftJoinAndSelect('users.user', 'user')
      .leftJoinAndSelect('user.profile', 'profile')
      .andWhere('chat.archived = :archived', { archived: false })
      .getOne();

    return chat;
  }

  private async getUnSeenMessagesCount(userId: number, chatId: number) {
    const userChat = await this.userChatsRepository.findOne({
      where: { user: { id: userId }, chat: { id: chatId }, inChat: false },
      relations: ['chat.users.user'],
    });

    const friend: User = userChat?.chat.users.find(
      (u) => u.user.id !== userId,
    ).user;

    const count: number = await this.chatMessagesRepository.count({
      chatId: userChat?.chat.id,
      seen: false,
      'user.id': friend?.id,
    });

    return count;
  }

  private async inactivateUserInChat(
    userId: number,
    chatId: number,
  ): Promise<void> {
    const activeChat: UserChat = await this.userChatsRepository.findOne({
      where: { user: { id: userId }, inChat: true },
      relations: ['chat'],
    });

    if (!activeChat) {
      const userChat: UserChat = await this.userChatsRepository.findOne({
        where: { user: { id: userId }, chat: { id: chatId } },
        relations: ['chat'],
      });

      userChat.inChat = true;

      await this.userChatsRepository.save(userChat);
    }

    if (activeChat && activeChat.chat.id !== chatId) {
      activeChat.inChat = false;

      await this.userChatsRepository.save(activeChat);
    }
  }

  private async getLastMessage(
    chatId: number,
    userId: number,
  ): Promise<ExtendedMessageResponse> {
    const message = await this.chatMessagesRepository.aggregate([
      { $match: { chatId } },
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
      { $limit: 1 },
    ]);

    return message[0];
  }
}
