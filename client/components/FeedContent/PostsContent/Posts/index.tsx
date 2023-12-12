import { FC, useContext } from "react";
import { FeedContext } from "@/context/Feed.context";
import Post from "../Post";

const Posts: FC = (): JSX.Element => {
  const { posts } = useContext(FeedContext);

  return posts.length ? (
    <div className="d-flex flex-column gap-4">
      {posts.map((post, index) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  ) : (
    <p className="steel-6-16 text-center">Feed is Empty</p>
  );
};

export default Posts;
