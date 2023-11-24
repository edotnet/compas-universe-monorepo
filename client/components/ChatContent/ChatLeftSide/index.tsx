import ChatSearch from "../ChatSearch";
import Chats from "../Chats";

const ChatLeftSide = () => {
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
