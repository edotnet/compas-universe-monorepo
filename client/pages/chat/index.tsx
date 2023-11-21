import withAuth from "@/HOC/withAuth";
import ChatContent from "@/components/ChatContent";
import { ChatProvider } from "@/context/Chat.context";
import MainLayout from "@/layouts/MainLayout";

const Chat = () => (
  <MainLayout>
    <ChatProvider>
      <ChatContent />
    </ChatProvider>
  </MainLayout>
);

export default withAuth(Chat);
