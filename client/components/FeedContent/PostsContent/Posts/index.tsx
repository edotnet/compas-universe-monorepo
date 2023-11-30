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
        console.log("🚀 ~~~~~~~~~~~~~~~~~~~~~~~~~~ data:", data);
        setPosts(data);
      } catch (error) {
        console.log("🚀 ~~~~~~~~~~~~~~~~~~~~~~~~~~ error:", error);
      }
    })();
  }, []);
  console.log("🚀 ~~~~~~~~~~~~~~~~~~~~~~~~~~ posts:", posts);

  return (
    <div className="d-flex flex-column gap-4">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
