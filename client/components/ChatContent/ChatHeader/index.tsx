import { useContext } from "react";
import ChatHeaderIcons from "../ChatHeaderIcons";
import { ChatContext } from "@/context/Chat.context";
import { GlobalContext } from "@/context/Global.context";
import ProfilePicture from "@/components/ProfileContent/ProfilePicture";
import styles from "./index.module.scss";

const ChatHeader = () => {
  const { currentChat, activeChat } = useContext(ChatContext)!;

  const { me } = useContext(GlobalContext)

  const friend = activeChat?.users?.find((u) => u.id !== me?.id);

  return (
    <div
      className={`${styles.chatHeader} d-flex align-items-center justify-content-between`}
    >
      <div className="d-flex align-items-center gap-3">
        <ProfilePicture
          src={
            currentChat
              ? currentChat.friend.profilePicture
              : friend?.profilePicture!
          }
          width={52}
          height={52}
          borderRadius="50%"
        />
        <p>{currentChat?.friend.userName || friend?.userName}</p>
      </div>
      <ChatHeaderIcons />
    </div>
  );
};

export default ChatHeader;
