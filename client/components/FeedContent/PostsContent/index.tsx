import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { authApi } from "@/utils/axios";
import Posts from "./Posts";
import CreatePost from "./Create";
import { FeedContext } from "@/context/Feed.context";
import { scrollPaginate } from "@/utils/helpers/scroll-paginate.helper";
import { IPostExtended } from "@/utils/types/posts.types";

const PostsContent: FC = (): JSX.Element => {
  const [skip, setSkip] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFetched, setIsFetched] = useState<boolean>(false);

  const { setPosts, posts } = useContext(FeedContext);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleGetFeed = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);

      const { data }: { data: IPostExtended[] } = await authApi.get(
        `/feed?skip=${skip}&take=12`
      );

      setIsFetched(true);
      if (!isFetched) {
        setPosts(data);
        setSkip(12);
      } else {
        setPosts((prev) => [...prev, ...data]);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [skip]);

  useEffect(() => {
    if (!isFetched) {
      handleGetFeed();
    }
  }, [isFetched]);

  return (
    <div
      className="d-flex flex-column gap-4 overflow-y-scroll vanish-scroll"
      ref={containerRef}
      onScroll={() =>
        scrollPaginate(
          containerRef,
          posts,
          loading,
          handleGetFeed,
          setSkip,
          skip
        )
      }
    >
      <p className="charcoal-6-32">Feed</p>
      <CreatePost setSkip={setSkip} />
      <Posts />
    </div>
  );
};

export default PostsContent;
