import { useEffect, useState } from "react";
import { authApi } from "@/utils/axios";
import styles from "./index.module.scss";
import ChatLeftSide from "../ChatLeftSide";
import ChatRightSide from "../ChatRightSide";
import { IChatResponse } from "@/utils/types/chat.types";
import { ChatProvider } from "@/context/Chat.context";

const ChatContent = () => {
  const [chats, setChats] = useState<IChatResponse[]>([]);

  useEffect(() => {
    try {
      (async () => {
        const { data } = await authApi.get("/chat");
        if (data) {
          setChats(data);
        }
      })();
    } catch (error) {}
  }, []);

  return (
    <div className={styles.chatContent}>
      <ChatProvider>
        <ChatLeftSide chats={chats} />
        {/* {chatOpen ? <ChatRightSide /> : <ChatStart />} */}
        <ChatRightSide />
      </ChatProvider>
    </div>
  );
};

export default ChatContent;
