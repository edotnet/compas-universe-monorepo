import ChatHeader from "../ChatHeader";
import ChatMessages from "../ChatMessages";
import ChatSendMessage from "../ChatSendMessage";
import styles from "./index.module.scss";

const ChatRightSide = () => {
  return (
    <div className={styles.chatRightSide}>
      <ChatHeader />
      <div className={styles.messagesContainer}>
        <ChatMessages />
        <ChatSendMessage />
      </div>
    </div>
  );
};

export default ChatRightSide;
