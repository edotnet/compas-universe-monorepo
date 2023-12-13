import PostsContent from "./PostsContent";
import PlaylistContent from "./PlaylistContent";
import { FeedContainer } from "./Container";
import { FC } from "react";

const FeedContent: FC = (): JSX.Element => {
  return (
    <FeedContainer>
      <PostsContent />
      <PlaylistContent />
    </FeedContainer>
  );
};

export default FeedContent;
