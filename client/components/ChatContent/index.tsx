import { useContext, useEffect } from "react";
import { authApi } from "@/utils/axios";
import { ChatContext } from "@/context/Chat.context";
import { WebsocketContext } from "@/context/Websocket.Context";
import SOCKET_EVENT from "@/utils/types/enums/socket.enum";
import { IMessageEvent } from "@/utils/types/socket-event.types";
import ChatLeftSide from "./ChatLeftSide";
import ChatRightSide from "./ChatRightSide";
import ChatStart from "./ChatStart";

const ChatContent = () => {
  const { setMessages, currentChat, setChats, chats, activeChat } =
    useContext(ChatContext)!;

  const socket = useContext(WebsocketContext);

  useEffect(() => {
    try {
      (async () => {
        const { data } = await authApi.get("/chat");
        if (data) {
          setChats(data);
        }
      })();
    } catch (error) {}

    socket
      .off(SOCKET_EVENT.MESSAGE_NEW)
      .on(SOCKET_EVENT.MESSAGE_NEW, async (data: IMessageEvent) => {
        if (data) {
          if (data.chatId === activeChat?.id) {
            setMessages((prev) => [data.message, ...prev]);
          }

          setChats((prev) => [
            ...prev.map((chat) =>
              chat?.chat?.id === data.chatId
                ? {
                    ...chat,
                    lastMessage: data.message,
                    inChat: data.inChat,
                  }
                : chat
            ),
          ]);

          if (!data.inChat) {
            setChats((prev) => [
              ...prev.map((chat) =>
                chat?.chat?.id === data.chatId && !chat.lastMessage?.me
                  ? {
                      ...chat,
                      newMessagesCount: chat.newMessagesCount + 1,
                    }
                  : !chat?.chat && chat.friend.id === data.friendId
                  ? { ...chat, chat: { id: data.chatId, users: [] } }
                  : chat
              ),
            ]);
          }
        }
      });

    socket
      .off(SOCKET_EVENT.MESSAGE_SEEN)
      .on(SOCKET_EVENT.MESSAGE_SEEN, async (data: IMessageEvent) => {
        if (data) {
          setChats((prev) => [
            ...prev.map((chat) =>
              chat?.chat?.id === data.chatId
                ? { ...chat, lastMessage: data.message }
                : chat
            ),
          ]);

          setMessages((prev) => [
            ...prev.map((message) => ({ ...message, seen: true })),
          ]);
        }
      });

    return () => {
      socket.off(SOCKET_EVENT.MESSAGE_SEEN);
      socket.off(SOCKET_EVENT.MESSAGE_NEW);
    };
  }, [activeChat, currentChat]);

  return (
    <div className="d-flex w-100">
      <ChatLeftSide />
      {(chats.length && currentChat) || (chats.length && activeChat) ? (
        <ChatRightSide />
      ) : (
        <ChatStart />
      )}
    </div>
  );
};

export default ChatContent;
