import ChatHeader from "../ChatHeader";
import ChatMessages from "../ChatMessages";
import ChatSendMessage from "../ChatSendMessage";
import styles from "./index.module.scss";

const ChatRightSide = () => {
  return (
    <div className={styles.chatRightSide}>
      <ChatHeader />
      <div
        className={`${styles.messagesContainer} d-flex flex-column justify-content-end`}
      >
        <ChatMessages />
        <ChatSendMessage />
      </div>
    </div>
  );
};

export default ChatRightSide;
