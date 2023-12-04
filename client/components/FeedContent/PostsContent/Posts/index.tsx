import { FeedContext } from "@/context/Feed.context";
import { authApi } from "@/utils/axios";
import { IPostExtended } from "@/utils/types/posts.types";
import { useContext, useEffect } from "react";
import Post from "../Post";

const Posts = () => {
  const { posts, setPosts } = useContext(FeedContext);

  useEffect(() => {
    (async () => {
      try {
        const { data }: { data: IPostExtended[] } = await authApi.get("/feed");
        setPosts(data);
      } catch (error) {}
    })();
  }, []);

  return (
    <div className="d-flex flex-column gap-4">
      {posts.map((post, index) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
