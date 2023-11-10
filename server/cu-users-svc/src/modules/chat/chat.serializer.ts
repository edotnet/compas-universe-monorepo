import {
  Chat,
  ChatMessages,
  GetChatMessagesResponse,
  GetChatsResponse,
  User,
  mapChatMessageToChatMessageResponse,
  mapChatToChatResponse,
  mapUserToUserResponse,
} from '@edotnet/shared-lib';

export const mapChatsToGetChatsResponse = (
  user: User,
  chat?: Chat,
  message?: ChatMessages,
): GetChatsResponse => ({
  friend: mapUserToUserResponse(user),
  ...(chat && {
    chat: mapChatToChatResponse(chat),
  }),
  ...(message && {
    lastMessage: {
      user: mapUserToUserResponse(user),
      ...mapChatMessageToChatMessageResponse(message),
    },
  }),
});
