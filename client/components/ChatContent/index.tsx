import { useContext, useEffect, useState } from "react";
import { authApi } from "@/utils/axios";
import styles from "./index.module.scss";
import ChatLeftSide from "../ChatLeftSide";
import ChatRightSide from "../ChatRightSide";
import { IChatResponse } from "@/utils/types/chat.types";
import { ChatContext } from "@/context/Chat.context";
import { WebsocketContext } from "@/context/Websocket.Context";
import SOCKET_EVENT from "@/utils/types/enums/socket.enum";
import ChatStart from "../ChatStart";
import { IMessageEvent } from "@/utils/types/socket-event.types";

const ChatContent = () => {
  const [chats, setChats] = useState<IChatResponse[]>([]);
  const { setMessages, activeChat } = useContext(ChatContext)!;

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
          setMessages((prev) => [data, ...prev]);
          setChats((prev) => [
            ...prev.map((chat) =>
              chat?.chat?.id === data.chatId
                ? { ...chat, lastMessage: data }
                : chat
            ),
          ]);
        }
      });
  }, []);

  return (
    <div className={styles.chatContent}>
      <ChatLeftSide chats={chats} />
      {chats.length && activeChat ? <ChatRightSide /> : <ChatStart />}
    </div>
  );
};

export default ChatContent;
