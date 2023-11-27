import styles from "./index.module.scss";

const ChatStart = () => {
  return (
    <div className={styles.chatStart}>
      <div className={`${styles.chatHeader} d-flex align-items-center justify-content-between`}></div>
      <div className={styles.chatStartContent}></div>
    </div>
  );
};

export default ChatStart;
