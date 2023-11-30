import MainLayout from "@/layouts/MainLayout";
import withAuth from "@/HOC/withAuth";
import { FeedProvider } from "@/context/Feed.context";
import FeedContent from "@/components/FeedContent";

const Feed = () => {
  return (
    <MainLayout>
      <FeedProvider>
        <FeedContent/>
      </FeedProvider>
    </MainLayout>
  );
};

export default withAuth(Feed);
