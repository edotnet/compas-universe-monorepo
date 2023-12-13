import { FC, useContext } from "react";
import { ChatContext } from "@/context/Chat.context";
import ProfilePicture from "@/components/ProfileContent/ProfilePicture";
import { CardText } from "reactstrap";
import styles from "./index.module.scss";

const ChatMessages: FC = (): JSX.Element => {
  const { messages } = useContext(ChatContext)!;

  return (
    <div
      className={`${styles.chatMessages} d-flex flex-column-reverse gap-5 vanish-scroll`}
    >
      {messages.map((m, index) =>
        m.me ? (
          <div
            key={index}
            className="d-flex flex-column align-items-end align-self-end gap-3"
          >
            <div className="d-flex align-items-end justify-content-between gap-2">
              <div className={`${styles.text} ${styles.me}`}>
                <CardText>{m.text}</CardText>
              </div>
              <ProfilePicture
                src={m.user?.profilePicture}
                width={36}
                height={36}
                borderRadius="50%"
              />
            </div>
            <div
              className="d-flex align-items-center gap-1"
              style={{ marginRight: 50 }}
            >
              <picture>
                <img
                  src={
                    m.seen
                      ? "/images/icons/seen.svg"
                      : "/images/icons/received.svg"
                  }
                  alt={m.seen ? "seen" : "received"}
                  width={17}
                  height={17}
                />
              </picture>
              <p className="medium-grey-5-11">
                {new Date(m.createdAt).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </p>
            </div>
          </div>
        ) : (
          <div
            key={index}
            className="d-flex flex-column align-self-start gap-3"
            style={{ maxWidth: 600 }}
          >
            <div className="d-flex align-items-end gap-2">
              <ProfilePicture
                src={m.user?.profilePicture}
                width={36}
                height={36}
                borderRadius="50%"
              />
              <div className={`${styles.text} ${styles.friend}`}>
                <CardText>{m.text}</CardText>
              </div>
            </div>
            <div className="d-flex gap-1" style={{ marginLeft: 46 }}>
              <p className="medium-grey-5-11">
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
