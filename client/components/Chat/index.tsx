import { memo, useContext, useEffect, useState } from "react";
import { authApi } from "@/utils/axios";
import { ToastError } from "@/utils/toastify";
import { ChatContext } from "@/context/Chat.context";
import { errorHelper } from "@/utils/helpers/error.helper";
import { calculateTimeAgo } from "@/utils/helpers/calculate-time-ago.helper";
import { IChatResponse } from "@/utils/types/chat.types";
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
      className={
        activeChat && activeChat.id === chat?.chat?.id
          ? `${styles.active} ${styles.chat}`
          : styles.chat
      }
      onClick={() => handleChatCreation(chat.friend.id)}
    >
      <div className={styles.friendProfile}>
        <picture>
          <img
            src={
              chat.friend.profilePicture || "/images/no-profile-picture.jpeg"
            }
            alt="profile"
            width={58}
            height={58}
          />
        </picture>
        <div className={styles.info}>
          <p>{chat.friend.userName}</p>
          <p>{chat.lastMessage?.text}</p>
          {/* <p>MEDIA</p> */}
        </div>
      </div>
      {chat.lastMessage && (
        <div className={styles.messageInfo}>
          <span>{timeAgo}</span>
          {chat?.newMessagesCount ? (
            <div className={styles.newMessage}>
              <p>{chat?.newMessagesCount}</p>
            </div>
          ) : chat.lastMessage?.me ? (
            <picture>
              <img
                src={
                  chat.lastMessage?.seen
                    ? "/images/icons/seen.svg"
                    : "/images/icons/recieved.svg"
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
