import { useContext } from "react";
import { ChatContext } from "@/context/Chat.context";
import styles from "./index.module.scss";
import ProfilePicture from "@/components/ProfileContent/ProfilePicture";

const ChatMessages = () => {
  const { messages } = useContext(ChatContext)!;

  return (
    <div className={`${styles.chatMessages} d-flex flex-column-reverse gap-5`}>
      {messages.map((m, index) =>
        m.me ? (
          <div key={index} className="d-flex flex-column align-items-end align-self-end gap-3">
            <div className="d-flex align-self-end gap-2">
              <div className={styles.text}>
                <p>{m.text}</p>
              </div>
              <ProfilePicture
                src={m.user?.profilePicture}
                width={36}
                height={36}
                borderRadius="50%"
              />
            </div>
            <div className={styles.messageInfo}>
              <picture>
                <img
                  src={
                    m.seen
                      ? "/images/icons/seen.svg"
                      : "/images/icons/received.svg"
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
          <div key={index} className="d-flex flex-column align-items-end align-self-start gap-3">
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
                      : "/images/icons/received.svg"
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
