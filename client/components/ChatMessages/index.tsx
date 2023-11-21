import { useContext } from "react";
import { ChatContext } from "@/context/Chat.context";
import styles from "./index.module.scss";
const ChatMessages = () => {
  const { messages } = useContext(ChatContext)!;

  return (
    <div className={styles.chatMessages}>
      {messages.map((m, index) =>
        m.me ? (
          <div key={index} className={styles.myMessage}>
            <div className={styles.messageBox}>
              <div className={styles.text}>
                <p>{m.text}</p>
              </div>
              <picture>
                <img
                  src={
                    m.user?.profilePicture || "/images/no-profile-picture.jpeg"
                  }
                  alt="profile"
                  width={36}
                  height={36}
                />
              </picture>
            </div>
            <div className={styles.messageInfo}>
              <picture>
                <img
                  src={
                    m.seen
                      ? "/images/icons/seen.svg"
                      : "/images/icons/recieved.svg"
                  }
                  alt="profile"
                  width={17}
                  height={17}
                />
              </picture>
              <p className={styles.date}>
                {new Date(m.createdAt).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </p>
            </div>
          </div>
        ) : (
          <div key={index} className={styles.friendMessage}>
            <div className={styles.messageBox}>
              <picture>
                <img
                  src={
                    m.user?.profilePicture || "/images/no-profile-picture.jpeg"
                  }
                  alt="profile"
                  width={36}
                  height={36}
                />
              </picture>
              <div className={styles.text}>
                <p>{m.text}</p>
              </div>
            </div>
            <div className={styles.messageInfo}>
              <picture>
                <img
                  src={
                    m.seen
                      ? "/images/icons/seen.svg"
                      : "/images/icons/recieved.svg"
                  }
                  alt="profile"
                  width={17}
                  height={17}
                />
              </picture>
              <p className={styles.date}>
                {new Date(m.createdAt).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default ChatMessages;
