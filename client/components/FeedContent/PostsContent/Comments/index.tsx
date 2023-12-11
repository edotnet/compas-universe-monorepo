import { IExtendedComment, IPostExtended } from "@/utils/types/posts.types";
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import Comment from "../Comment";
import { scrollPaginate } from "@/utils/helpers/scroll-paginate.helper";
import { authApi } from "@/utils/axios";

interface IProps {
  post: IPostExtended;
  comments: IExtendedComment[];
  containerRef?: RefObject<HTMLDivElement>;
  setSinglePostComments?: Dispatch<SetStateAction<IExtendedComment[]>>;
}

const Comments = ({
  post,
  comments,
  containerRef,
  setSinglePostComments,
}: IProps) => {
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [skip, setSkip] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const handleCommentsGet = useCallback(async () => {
    if (!setSinglePostComments) return;

    try {
      setLoading(true);

      const { data: comments } = await authApi.get(
        `/feed/${post.id}/comments?skip=${skip}&take=12`
      );

      setIsFetched(true);
      if (!isFetched) {
        setSinglePostComments(comments);
        setSkip(12);
      } else {
        setSinglePostComments((prev) => [...prev, ...comments]);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [skip, isFetched, setSinglePostComments]);

  useEffect(() => {
    if (!isFetched) {
      handleCommentsGet();
    }
  }, [isFetched, setSinglePostComments]);

  return (
    <div
      className={`d-flex flex-column gap-3 ${
        !setSinglePostComments ? "" : "overflow-y-scroll vanish-scroll"
      }`}
      ref={containerRef}
      onScroll={() =>
        scrollPaginate(
          containerRef!,
          comments,
          loading,
          handleCommentsGet,
          setSkip,
          skip
        )
      }
      style={setSinglePostComments && { height: "100%", maxHeight: 600 }}
    >
      {comments.map((comment) => (
        <Comment
          post={post}
          key={comment.id}
          comment={comment}
          setSinglePostComments={setSinglePostComments}
        />
      ))}
    </div>
  );
};

export default Comments;
