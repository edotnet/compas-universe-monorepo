import {
  Dispatch,
  FC,
  FormEvent,
  RefObject,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react";
import { Button, Form, FormFeedback, Input } from "reactstrap";
import { FeedContext } from "@/context/Feed.context";
import { authApi } from "@/utils/axios";
import { scrollToTop } from "@/utils/helpers/scroll-to-element.helper";
import { IExtendedComment, IPostExtended } from "@/utils/types/posts.types";

interface IProps {
  post: IPostExtended;
  inputRef: RefObject<HTMLInputElement>;
  setSkip?: Dispatch<SetStateAction<number>>;
  commentId?: number;
  containerRef?: RefObject<HTMLDivElement>;
  inputEditMode?: boolean;
  setSinglePostComments?: Dispatch<SetStateAction<IExtendedComment[]>>;
}

const CreateComments: FC<IProps> = ({
  post,
  setSkip,
  inputRef,
  commentId,
  containerRef,
  setSinglePostComments,
}): JSX.Element => {
  const [error, setError] = useState<string>("");
  const { setComments } = useContext(FeedContext);

  const handleCommentSend = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();

      const target = e.target as HTMLFormElement;
      const input = target[0] as HTMLInputElement;

      if (!input.value.trim()) {
        return;
      }

      const payload: Record<string, number | string> = {
        postId: post.id,
        content: input.value,
      };

      if (commentId) payload.commentId = commentId;

      try {
        const { data }: { data: IExtendedComment } = await authApi.post(
          "/feed/comment",
          payload
        );

        if (containerRef?.current) {
          scrollToTop(containerRef.current);
        }

        input.value = "";

        if (data.replyTo) {
          if (setSinglePostComments) {
            setSinglePostComments((prev) => [
              ...prev.map((comment) =>
                comment.id === commentId
                  ? {
                      ...comment,
                      replies: [
                        data,
                        ...(comment.replies ? comment.replies : []),
                      ],
                    }
                  : comment
              ),
            ]);
          } else {
            setComments((prev) => ({
              ...prev,
              [post.id]: [
                ...(prev?.[post.id]
                  ? prev[post.id].map((comment) =>
                      comment.id === commentId
                        ? {
                            ...comment,
                            replies: [
                              ...(comment.replies ? comment?.replies : []),
                              data,
                            ],
                          }
                        : comment
                    )
                  : []),
              ],
            }));
          }

          if (post.lastComment && post.lastComment.id === commentId) {
            post.lastComment.replies = post.lastComment.replies
              ? [...post.lastComment.replies, data]
              : [data];
          }
        } else {
          if (setSinglePostComments && setSkip) {
            setSkip((prev) => prev + 1);
            setSinglePostComments((prev) => [data, ...prev]);
          } else {
            setComments((prev) => ({
              ...prev,
              [post.id]: [...(prev?.[post.id] ? prev[post.id] : []), data],
            }));
          }
        }
      } catch (error) {}
    },
    []
  );

  return (
    <Form
      className="d-flex w-100 position-relative align-items-center"
      style={{ height: 30 }}
      onSubmit={(e: FormEvent<HTMLFormElement>) => handleCommentSend(e)}
    >
      <div className="w-100">
        <FormFeedback style={{ fontSize: 10 }}>{error}</FormFeedback>
        <Input
          type="text"
          invalid={!!error}
          className="bg-light"
          style={{ borderRadius: 30, height: 30 }}
          placeholder={commentId ? "Write a reply" : "Write a comment"}
          innerRef={inputRef}
        />
      </div>
      <Button color="transparent" className="border-0">
        <img src="/images/icons/send.svg" alt="icon" width={15} height={15} />
      </Button>
    </Form>
  );
};

export default CreateComments;
