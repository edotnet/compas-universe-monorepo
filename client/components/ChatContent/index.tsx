import { useContext, useEffect } from "react";
import { authApi } from "@/utils/axios";
import { ChatContext } from "@/context/Chat.context";
import { WebsocketContext } from "@/context/Websocket.Context";
import ChatStart from "../ChatStart";
import ChatLeftSide from "../ChatLeftSide";
import ChatRightSide from "../ChatRightSide";
import SOCKET_EVENT from "@/utils/types/enums/socket.enum";
import { IMessageEvent } from "@/utils/types/socket-event.types";
import styles from "./index.module.scss";

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
      .off(`${SOCKET_EVENT.NEW_MESSAGE}`)
      .on(`${SOCKET_EVENT.NEW_MESSAGE}`, async (data: IMessageEvent) => {
        if (data) {
          if (data.chatId === activeChat?.id) {
            setMessages((prev) => [data, ...prev]);
          }
          setChats((prev) => [
            ...prev.map((chat) =>
              chat?.chat?.id === data.chatId
                ? { ...chat, lastMessage: data }
                : chat
            ),
          ]);
        }
      });
  }, [activeChat]);

  return (
    <div className={styles.chatContent}>
      <ChatLeftSide />
      {(chats.length && currentChat) || activeChat ? (
        <ChatRightSide />
      ) : (
        <ChatStart />
      )}
    </div>
  );
};

export default ChatContent;
