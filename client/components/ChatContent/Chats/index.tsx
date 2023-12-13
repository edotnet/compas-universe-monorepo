import { FC, useContext } from "react";
import { ChatContext } from "@/context/Chat.context";
import Chat from "../Chat";

const Chats: FC = (): JSX.Element => {
  const { chats } = useContext(ChatContext)!;

  return (
    <div className="w-100 mt-3">
      {chats?.length ? (
        chats.map((chat) => <Chat key={chat.friend.id} chat={chat} />)
      ) : (
        <></>
      )}
    </div>
  );
};

export default Chats;
