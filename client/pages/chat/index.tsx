import withAuth from "@/HOC/withAuth";
import ChatContent from "@/components/ChatContent";
import { ChatProvider } from "@/context/Chat.context";
import { GlobalProvider } from "@/context/Global.context";
import MainLayout from "@/layouts/MainLayout";

const Chat = () => (
  <GlobalProvider>
    <MainLayout>
      <ChatProvider>
        <ChatContent />
      </ChatProvider>
    </MainLayout>
  </GlobalProvider>
);

export default withAuth(Chat);
