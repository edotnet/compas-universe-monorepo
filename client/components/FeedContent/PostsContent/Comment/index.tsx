import {
  Dispatch,
  useState,
  useContext,
  useCallback,
  SetStateAction,
  useRef,
  FC,
} from "react";
import { Button } from "reactstrap";
import { authApi } from "@/utils/axios";
import { FeedContext } from "@/context/Feed.context";
import CreateComments from "../CreateComment";
import ProfilePicture from "@/components/ProfileContent/ProfilePicture";
import { IExtendedComment, IPostExtended } from "@/utils/types/posts.types";

interface IProps {
  post: IPostExtended;
  comment: IExtendedComment;
  reply?: boolean;
  setCommentId?: Dispatch<SetStateAction<number>>;
  setSinglePostComments?: Dispatch<SetStateAction<IExtendedComment[]>>;
}

const Comment: FC<IProps> = ({
  post,
  reply,
  comment,
  setCommentId,
  setSinglePostComments,
}): JSX.Element => {
  const [openReplyInput, setOpenReplyInput] = useState<boolean>(false);
  const { comments, setComments } = useContext(FeedContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCommentLike = useCallback(async (): Promise<void> => {
    const payload: Record<string, number> = {
      commentId: comment.id,
    };

    try {
      await authApi.post("/feed/like", payload);

      comment.liked = !comment.liked;
      setComments({ ...comments });
    } catch (error) {}
  }, [comment, comments]);

  const readyToReply = () => {
    setOpenReplyInput(true);
    setCommentId && setCommentId(comment.id);

    if (inputRef?.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div>
      <div
        className="d-flex flex-column"
        style={reply ? { marginLeft: 60 } : {}}
      >
        <div className="d-flex gap-3">
          <ProfilePicture
            src={comment.user.profilePicture}
            height={32}
            width={32}
            borderRadius="50%"
          />
          <div
            className="p-2 d-flex flex-column gap-1"
            style={{
              backgroundColor: "#F0F2F5",
              borderRadius: 16,
              maxWidth: "90%",
              wordBreak: "break-all",
            }}
          >
            <p className="black-7-14">{comment.user.userName}</p>
            <p className="black-4-13">{comment.content}</p>
          </div>
        </div>
        <div className="d-flex align-items-center" style={{ paddingLeft: 55 }}>
          <Button
            color="transparent"
            className="border-0"
            type="button"
            onClick={() => handleCommentLike()}
          >
            <img
              src={
                comment.liked
                  ? "/images/icons/like-feed.svg"
                  : "/images/icons/heart-feed.svg"
              }
              alt="icon"
              width={15}
              height={15}
            />
          </Button>
          <Button
            color="transparent"
            className="border-0"
            type="button"
            onClick={readyToReply}
          >
            <img
              src="/images/icons/reply.svg"
              alt="icon"
              width={15}
              height={15}
            />
          </Button>
        </div>
      </div>
      {!!comment.replies?.length &&
        comment.replies.map((reply) => (
          <Comment reply post={post} key={reply.id} comment={reply} />
        ))}
      {openReplyInput && !reply && (
        <div className="w-50" style={{ marginLeft: 60 }}>
          <CreateComments
            post={post}
            inputRef={inputRef}
            commentId={comment.id}
            setSinglePostComments={setSinglePostComments}
          />
        </div>
      )}
    </div>
  );
};

export default Comment;
