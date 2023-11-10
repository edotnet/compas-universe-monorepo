import { useContext, useEffect } from "react";
import { authApi } from "@/utils/axios";
import { ChatContext } from "@/context/Chat.context";
import styles from "./index.module.scss";
import { WebsocketContext } from "@/context/Websocket.Context";
import SOCKET_EVENT from "@/utils/types/enums/socket.enum";

const ChatMessages = () => {
  const { messages } = useContext(ChatContext)!;

  return (
    <div className={styles.chatMessages}>
      {messages.map((m, index) =>
        m.me ? (
          <div key={index} className={styles.myMessage}>
            <div className={styles.text}>
              <p>{m.text}</p>
            </div>
            <picture>
              <img
                src={m.user.profilePicture || "/images/no-profile-picture.jpeg"}
                alt="profile"
                width={36}
                height={36}
              />
            </picture>
          </div>
        ) : (
          <div key={index} className={styles.friendMessage}>
            <picture>
              <img
                src={m.user.profilePicture || "/images/no-profile-picture.jpeg"}
                alt="profile"
                width={36}
                height={36}
              />
            </picture>
            <div className={styles.text}>
              <p>{m.text}</p>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default ChatMessages;
