import MainLayout from "@/layouts/MainLayout";
import withAuth from "@/HOC/withAuth";
import { FeedProvider } from "@/context/Feed.context";
import FeedContent from "@/components/FeedContent";
import { GlobalProvider } from "@/context/Global.context";

const Feed = () => {
  return (
    <GlobalProvider>
      <MainLayout>
        <FeedProvider>
          <FeedContent />
        </FeedProvider>
      </MainLayout>
    </GlobalProvider>
  );
};

export default withAuth(Feed);
