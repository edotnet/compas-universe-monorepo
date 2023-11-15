import { authApi } from "@/utils/axios";
import { IChat, IChatResponse, IMessage } from "@/utils/types/chat.types";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface IProps {
  children: ReactNode;
}

interface IChatContextProps {
  chats: IChatResponse[];
  setChats: Dispatch<SetStateAction<IChatResponse[]>>;
  messages: IMessage[];
  activeChat: IChat;
  setMessages: Dispatch<SetStateAction<IMessage[]>>;
  currentChat: IChatResponse;
  setActiveChat: Dispatch<SetStateAction<IChat>>;
  setCurrentChat: Dispatch<SetStateAction<IChatResponse>>;
}

export const ChatContext = createContext<IChatContextProps>(null!);

export const ChatProvider = ({ children }: IProps) => {
  const [chats, setChats] = useState<IChatResponse[]>([]);
  const [currentChat, setCurrentChat] = useState<IChatResponse>(null!);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [activeChat, setActiveChat] = useState<IChat>(null!);

  useEffect(() => {
    (async () => {
      try {
        const { data: activeChatData } = await authApi.get("/chat/active");

        if (activeChatData) {
          setActiveChat({ ...activeChatData });
          const { data: activeChatMessagesData } = await authApi.get(
            `/chat/messages/${activeChatData.id}`
          );
          setMessages(activeChatMessagesData);
        }
      } catch (error) {}
    })();
  }, []);

  const value = useMemo(
    () => ({
      chats,
      setChats,
      messages,
      activeChat,
      setMessages,
      currentChat,
      setActiveChat,
      setCurrentChat,
    }),
    [
      chats,
      setChats,
      messages,
      activeChat,
      setMessages,
      currentChat,
      setActiveChat,
      setCurrentChat,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
