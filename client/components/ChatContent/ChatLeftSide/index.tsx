import { FC } from "react";
import ChatSearch from "../ChatSearch";
import Chats from "../Chats";

const ChatLeftSide: FC = (): JSX.Element => {
  return (
    <div
      className="py-4"
      style={{ borderLeft: "1px solid #E3E8E7", flexBasis: "25%" }}
    >
      <ChatSearch />
      <Chats />
    </div>
  );
};

export default ChatLeftSide;
