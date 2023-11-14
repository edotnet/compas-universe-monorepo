import ChatSearch from "../ChatSearch";
import Chats from "../Chats";
import styles from "./index.module.scss";

const ChatLeftSide = () => {
  return (
    <div className={styles.chatLeftSide}>
      <ChatSearch />
      <Chats/>
    </div>
  );
};

export default ChatLeftSide;
