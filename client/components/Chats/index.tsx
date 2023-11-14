import { useContext } from "react";
import Chat from "../Chat";
import styles from "./index.module.scss";
import { ChatContext } from "@/context/Chat.context";

const Chats = () => {
  const { chats } = useContext(ChatContext)!;

  return (
    <div className={styles.chats}>
      {chats?.length ? (
        chats.map((chat) => <Chat key={chat.friend.id} chat={chat} />)
      ) : (
        <></>
      )}
    </div>
  );
};

export default Chats;
