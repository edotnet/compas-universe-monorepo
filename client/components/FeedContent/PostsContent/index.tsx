import CreatePost from "./Create";
import Posts from "./Posts";

const PostsContent = () => {
  return (
    <div className="d-flex flex-column gap-4 overflow-y-scroll vanish-scroll">
      <p className="charcoal-6-32">Feed</p>
      <CreatePost />
      <Posts />
    </div>
  );
};

export default PostsContent;
