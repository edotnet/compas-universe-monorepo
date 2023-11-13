import ChatHeader from "../ChatHeader";
import styles from "./index.module.scss";

const ChatStart = () => {
  return (
    <div className={styles.chatStart}>
      <div className={styles.chatHeader}></div>
      <div className={styles.chatStartContent}></div>
    </div>
  );
};

export default ChatStart;
