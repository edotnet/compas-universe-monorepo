import { memo, useContext, useEffect, useState } from "react";
import { authApi } from "@/utils/axios";
import { ToastError } from "@/utils/toastify";
import { ChatContext } from "@/context/Chat.context";
import { errorHelper } from "@/utils/helpers/error.helper";
import { calculateTimeAgo } from "@/utils/helpers/calculate-time-ago.helper";
import { IChatResponse } from "@/utils/types/chat.types";
import ProfilePicture from "@/components/ProfileContent/ProfilePicture";
import styles from "./index.module.scss";

interface IProps {
  chat: IChatResponse;
}

const Chat = ({ chat }: IProps) => {
  const [timeAgo, setTimeAgo] = useState<string>("");

  const {
    chats,
    setChats,
    activeChat,
    currentChat,
    setMessages,
    setActiveChat,
    setCurrentChat,
  } = useContext(ChatContext)!;

  const handleChatCreation = async (userId: number) => {
    setCurrentChat({ ...chat });

    if (chat?.chat?.id) {
      setActiveChat(chat.chat);

      try {
        const { data } = await authApi.get(`/chat/messages/${chat?.chat?.id}`);
        if (data) {
          setMessages(data);
        }

        if (currentChat?.chat?.id !== chat.chat.id) {
          await authApi.put("/chat/switch-active", { chatId: chat.chat.id });
        }

        setChats((prev) => [
          ...prev.map((ch) =>
            chat.chat?.id === ch.chat?.id ? { ...ch, newMessagesCount: 0 } : ch
          ),
        ]);
      } catch (error) {}
    } else {
      try {
        const { data } = await authApi.post("/chat", { friendId: userId });

        if (data) {
          const { data: messagesData } = await authApi.get(
            `/chat/messages/${data.chat.id}`
          );
          setMessages(messagesData);
        }

        const index = chats.findIndex(
          (chat) => chat.friend.id === data.friend.id
        );

        if (index !== -1) {
          const updatedChats = [...chats];
          updatedChats[index] = data;

          setChats(updatedChats);
        }
        setCurrentChat(data);
        setActiveChat(data.chat);
      } catch (error: any) {
        ToastError(errorHelper(error?.response?.data.message));
      }
    }
  };

  useEffect(() => {
    chat.lastMessage &&
      calculateTimeAgo(chat.lastMessage?.createdAt, setTimeAgo);
  }, [chat]);

  return (
    <div
      className={`${
        styles.chat
      } d-flex align-items-center justify-content-between ${
        activeChat && activeChat.id === chat?.chat?.id && styles.active
      }`}
      onClick={() => handleChatCreation(chat.friend.id)}
    >
      <div className="d-flex align-items-center gap-3">
        <ProfilePicture
          src={chat.friend.profilePicture}
          height={58}
          width={58}
          borderRadius="50%"
        />
        <div className="d-flex flex-column gap-1">
          <p>{chat.friend.userName}</p>
          <p className="ellipsis-standard text-93-4-14">
            {chat.lastMessage?.text}
          </p>
        </div>
      </div>
      {chat.lastMessage && (
        <div
          className={`${styles.messageInfo} d-flex flex-column justify-content-between`}
        >
          <span className="text-93-5-14">{timeAgo}</span>
          {chat?.newMessagesCount ? (
            <div className={styles.newMessage}>
              <p className="text-ff-9-12">{chat?.newMessagesCount}</p>
            </div>
          ) : chat.lastMessage?.me ? (
            <picture>
              <img
                src={
                  chat.lastMessage?.seen
                    ? "/images/icons/seen.svg"
                    : "/images/icons/received.svg"
                }
                alt="message-status"
              />
            </picture>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(Chat);
