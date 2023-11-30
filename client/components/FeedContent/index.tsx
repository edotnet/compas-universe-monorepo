import PostsContent from "./PostsContent";
import PlaylistContent from "./PlaylistContent";
import { FeedContainer } from "./Container";

const FeedContent = () => {
  return (
    <FeedContainer>
      <PostsContent />
      <PlaylistContent />
    </FeedContainer>
  );
};

export default FeedContent;
