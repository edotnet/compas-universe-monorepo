import { FormEvent, useCallback, useContext, KeyboardEvent } from "react";
import { authApi } from "@/utils/axios";
import { ToastError } from "@/utils/toastify";
import { errorHelper } from "@/utils/helpers/error.helper";
import { ChatContext } from "@/context/Chat.context";
import styles from "./index.module.scss";

const ChatSendMessage = () => {
  const { currentChat, activeChat } = useContext(ChatContext)!;

  const handleInputExpand = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const maxHeight = 80;
    const target = e.target as HTMLTextAreaElement;

    if (!e.shiftKey && e.key === "Enter") {
      e.preventDefault();
      if ((currentChat || activeChat) && target.value.trim()) {
        await sendMessageRequest(
          target,
          currentChat?.chat?.id || activeChat?.id
        );
      }
    } else {
      target.style.height = "auto";
      target.style.height = `${Math.min(target.scrollHeight, maxHeight)}px`;
    }
  };

  const handleSendMessage = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const target = e.target as HTMLFormElement;
      const input = target[0] as HTMLTextAreaElement;

      if ((currentChat || activeChat) && input.value.trim()) {
        await sendMessageRequest(
          input,
          currentChat?.chat?.id || activeChat?.id
        );
      }
    },
    [currentChat]
  );

  const sendMessageRequest = async (
    target: HTMLTextAreaElement,
    chatId: number
  ) => {
    // setMessages((prev) => [
    //   {
    //     text: target.value,
    //     me: true,
    //     seen: true,
    //     media: [],
    //     user: {
    //       id: me.id,
    //       userName: me.userName,
    //       profilePicture: me.profilePicture,
    //     },
    //     createdAt: new Date(),
    //   },
    //   ...prev,
    // ]);
    const data = {
      text: target.value,
      chatId,
    };

    try {
      await authApi.post("/chat/send-message", data);
      target.value = "";
      target.style.height = "auto";
    } catch (error: any) {
      ToastError(errorHelper(error?.response?.data.message));
    }
  };

  return (
    <div className={styles.chatSendMessage}>
      <div className={styles.messageArea}>
        <form onSubmit={handleSendMessage}>
          <textarea
            onKeyDown={handleInputExpand}
            rows={1}
            placeholder="Message..."
          />
          <button>
            <picture>
              <img
                src={"/images/icons/send.svg"}
                alt="video"
                width={20}
                height={20}
              />
            </picture>
          </button>
        </form>
      </div>
      <div className={styles.messageIcons}>
        <div>
          <picture>
            <img
              src={"/images/icons/video.svg"}
              alt="video"
              width={20}
              height={20}
            />
          </picture>
          <picture>
            <img
              src={"/images/icons/voice.svg"}
              alt="video"
              width={20}
              height={20}
            />
          </picture>
        </div>
        <div>
          <picture>
            <img
              src={"/images/icons/smile.svg"}
              alt="video"
              width={20}
              height={20}
            />
          </picture>
          <picture>
            <img
              src={"/images/icons/file.svg"}
              alt="video"
              width={20}
              height={20}
            />
          </picture>
          <picture>
            <img
              src={"/images/icons/notes.svg"}
              alt="video"
              width={20}
              height={20}
            />
          </picture>
        </div>
        <div>
          <picture>
            <img
              src={"/images/icons/dots-vertical.svg"}
              alt="video"
              width={20}
              height={20}
            />
          </picture>
        </div>
      </div>
    </div>
  );
};

export default ChatSendMessage;
