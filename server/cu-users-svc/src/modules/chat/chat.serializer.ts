import {
  Chat,
  ExtendedMessageResponse,
  GetChatsResponse,
  User,
  mapChatToChatResponse,
  mapUserToUserResponse,
} from '@edotnet/shared-lib';

export const mapChatsToGetChatsResponse = (
  user: User,
  chat?: Chat,
  message?: ExtendedMessageResponse,
): GetChatsResponse => ({
  friend: mapUserToUserResponse(user),
  ...(chat && {
    chat: mapChatToChatResponse(chat),
  }),
  ...(message && {
    lastMessage: { ...message, user: mapUserToUserResponse(user) },
  }),
});
