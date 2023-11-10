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
  const { setCurrentChat, setMessages } = useContext(ChatContext)!;

  const handleChatCreation = async (userId: number) => {
    setCurrentChat({ ...chat });

    if (chat?.chat?.id) {
      try {
        const { data } = await authApi.get(`/chat/messages/${chat?.chat?.id}`);
        if (data) {
          setMessages(data);
        }
      } catch (error) {}
    } else {
      try {
        await authApi.post("/chat", { userIds: [userId] });
      } catch (error: any) {
        ToastError(errorHelper(error?.response?.data.message));
      }
    }
  };

  return (
    <div
      className={styles.chat}
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
