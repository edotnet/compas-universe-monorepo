import { IExtendedComment, IPostExtended } from "@/utils/types/posts.types";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Comment from "../Comment";
import { scrollPaginate } from "@/utils/helpers/scroll-paginate.helper";
import { authApi } from "@/utils/axios";

interface IProps {
  post: IPostExtended;
  comments: IExtendedComment[];
  setSinglePostComments?: Dispatch<SetStateAction<IExtendedComment[]>>;
}

const Comments = ({ post, comments, setSinglePostComments }: IProps) => {
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [skip, setSkip] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [openReplyInput, setOpenReplyInput] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
  }, [skip, isFetched]);

  useEffect(() => {
    if (!isFetched) {
      handleCommentsGet();
    }
  }, [isFetched]);

  return (
    <div
      className={`d-flex flex-column gap-3 ${
        !setSinglePostComments ? "" : "overflow-y-scroll vanish-scroll"
      }`}
      ref={containerRef}
      onScroll={() =>
        scrollPaginate(
          containerRef,
          comments,
          loading,
          handleCommentsGet,
          setSkip,
          skip
        )
      }
      style={setSinglePostComments && { height: "100%", maxHeight: "57vh" }}
    >
      {comments.map((comment) => (
        <Comment
          post={post}
          key={comment.id}
          comment={comment}
          openReplyInput={openReplyInput}
          setOpenReplyInput={setOpenReplyInput}
          setSinglePostComments={setSinglePostComments}
        />
      ))}
    </div>
  );
};

export default Comments;
