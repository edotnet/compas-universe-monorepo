import { IChatResponse } from "@/utils/types/chat.types";
import { memo, useContext } from "react";
import styles from "./index.module.scss";
import { authApi } from "@/utils/axios";
import { errorHelper } from "@/utils/helpers/error.helper";
import { ToastError } from "@/utils/toastify";
import { ChatContext } from "@/context/Chat.context";

interface IProps {
  chat: IChatResponse;
}

const Chat = ({ chat }: IProps) => {
  const {
    setCurrentChat,
    setMessages,
    chats,
    setChats,
    currentChat,
    activeChat,
    setActiveChat,
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

        if (currentChat?.chat.id !== chat.chat.id) {
          await authApi.put("/chat/switch-active", { chatId: chat.chat.id });
        }
      } catch (error) {}
    } else {
      try {
        const { data } = await authApi.post("/chat", { friendId: userId });
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
          <span>5s</span>
          {false ? (
            <div className={styles.newMessage}>
              <p>2</p>
            </div>
          ) : (
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
          )}
        </div>
      )}
    </div>
  );
};

export default memo(Chat);
