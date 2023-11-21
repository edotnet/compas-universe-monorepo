import {
  Chat,
  ExtendedMessageResponse,
  GetChatsResponse,
  User,
  UserChat,
  mapChatToChatResponse,
  mapUserToUserResponse,
} from '@edotnet/shared-lib';

export const mapChatsToGetChatsResponse = (
  user: User,
  count: number,
  chat?: Chat,
  userChat?: UserChat,
  message?: ExtendedMessageResponse,
): GetChatsResponse => ({
  friend: mapUserToUserResponse(user),
  ...(chat && {
    chat: mapChatToChatResponse(chat),
  }),
  ...(message && {
    lastMessage: message,
  }),
  ...(userChat && {
    inChat: userChat.inChat,
  }),
  newMessagesCount: count,
});
