import { Dispatch, SetStateAction } from "react";
import { IChatResponse } from "@/utils/types/chat.types";
import ChatSearch from "../ChatSearch";
import Chats from "../Chats";
import styles from "./index.module.scss";

interface IProps {
  chats: IChatResponse[];
}

const ChatLeftSide = ({ chats }: IProps) => {
  return (
    <div className={styles.chatLeftSide}>
      <ChatSearch />
      <Chats chats={chats} />
    </div>
  );
};

export default ChatLeftSide;
