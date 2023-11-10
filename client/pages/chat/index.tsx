import withAuth from "@/HOC/withAuth";
import ChatContent from "@/components/ChatContent";
import MainLayout from "@/layouts/MainLayout";

const Chat = () => (
  <MainLayout>
    <ChatContent/>
  </MainLayout>
);

export default withAuth(Chat);
