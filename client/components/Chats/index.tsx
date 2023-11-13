import { IChatResponse } from "@/utils/types/chat.types";
import Chat from "../Chat";
import styles from "./index.module.scss";

interface IProps {
  chats: IChatResponse[];
}

const Chats = ({ chats }: IProps) => {
  return (
    <div className={styles.chats}>
      {chats?.length ?
        chats.map((chat) => <Chat key={chat.friend.id} chat={chat} />) : <></>}
    </div>
  );
};

export default Chats;
