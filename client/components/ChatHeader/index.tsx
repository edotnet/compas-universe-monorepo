import { useContext } from "react";
import ChatHeaderIcons from "../ChatHeaderIcons";
import styles from "./index.module.scss";
import { ChatContext } from "@/context/Chat.context";
import { GlobalContext } from "@/context/Global.context";

const ChatHeader = () => {
  const { currentChat, activeChat } = useContext(ChatContext)!;
  const { me } = useContext(GlobalContext)!;

  const friend = activeChat?.users.find((u) => u.id !== me?.id);

  return (
    <div className={styles.chatHeader}>
      <div className={styles.profile}>
        <picture>
          <img
            src={
              currentChat?.friend.profilePicture ||
              friend?.profilePicture ||
              "/images/no-profile-picture.jpeg"
            }
            alt="profile"
            width={52}
            height={52}
          />
        </picture>
        <div className={styles.info}>
          <p>{currentChat?.friend.userName || friend?.userName}</p>
          {/* <p>Active Now</p> */}
        </div>
      </div>
      <ChatHeaderIcons />
    </div>
  );
};

export default ChatHeader;
