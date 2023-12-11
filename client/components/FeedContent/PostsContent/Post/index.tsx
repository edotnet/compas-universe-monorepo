import { useCallback, useContext, useRef, useState } from "react";
import {
  Card,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  UncontrolledDropdown,
} from "reactstrap";
import GenerateIcons from "@/components/ChatContent/GenerateIcons";
import ProfilePicture from "@/components/ProfileContent/ProfilePicture";
import { IPostExtended } from "@/utils/types/posts.types";
import PostInfo from "../PostInfo";
import { authApi } from "@/utils/axios";
import { FeedContext } from "@/context/Feed.context";
import CreateComments from "../CreateComment";
import Comments from "../Comments";
import Comment from "../Comment";
import SinglePost from "../SinglePost";

interface IProps {
  post: IPostExtended;
}

const Post = ({ post }: IProps) => {
  const [singlePostModal, setSinglePostModal] = useState(false);
  const [openCommentInput, setOpenCommentInput] = useState<boolean>(false);

  const { setPosts, comments } = useContext(FeedContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggle = () => setSinglePostModal(!singlePostModal);

  const handlePostLike = useCallback(async (): Promise<void> => {
    const payload: Record<string, number> = { postId: post.id };

    try {
      await authApi.post("/feed/like", payload);
      if (!post.liked) {
        post.likesCount += 1;
      }

      if (post.liked) {
        post.likesCount -= 1;
      }

      post.liked = !post.liked;

      setPosts((prev) => [
        ...prev.map((p: IPostExtended) => (p.id === post.id ? post : p)),
      ]);
    } catch (error) {}
  }, [post]);

  const readyToComment = () => {
    setOpenCommentInput(true);

    if (inputRef?.current) {
      inputRef.current.focus();
    }
  };

  return (
    <Card className="d-flex flex-column align-items-center">
      <CardBody className="d-flex align-items-center justify-content-between w-100">
        <div className="d-flex align-items-center gap-3">
          <ProfilePicture src="" width={40} height={40} borderRadius="50%" />
          <div>
            <CardTitle className="black-7-16">{post.user.userName}</CardTitle>
            <CardSubtitle className="text-muted">
              @{post.user.userName}
            </CardSubtitle>
          </div>
        </div>
        <UncontrolledDropdown direction="start">
          <DropdownToggle className="border-0 p-0" color="transparent">
            <picture>
              <img
                src="/images/icons/dots-vertical-feed.svg"
                alt="icon"
                width={24}
                height={24}
              />
            </picture>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Header</DropdownItem>
            <DropdownItem>Another Action</DropdownItem>
            <DropdownItem divider />
            <DropdownItem>Another Action</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </CardBody>
      <PostInfo
        media={post.content.media}
        description={post.content.description}
      />
      <CardBody
        className="d-flex align-items-center w-100 justify-content-between"
        style={
          post.lastComment || comments?.[post.id]?.length
            ? { borderBottom: "1px solid rgba(0, 0, 0, 0.175)" }
            : {}
        }
      >
        <div className="d-flex align-items-center gap-4">
          <div className="d-flex align-items-center">
            <GenerateIcons
              icons={[
                {
                  size: 24,
                  src: post.liked
                    ? "/images/icons/like-feed.svg"
                    : "/images/icons/heart-feed.svg",
                },
              ]}
              onClick={() => handlePostLike()}
            />
            <p className="teal-5-12" style={{ width: 10 }}>
              {post.likesCount > 0 && post.likesCount}
            </p>
          </div>
          <div className="d-flex align-items-center">
            <GenerateIcons
              icons={[{ size: 24, src: "/images/icons/comment-feed.svg" }]}
              onClick={() => readyToComment()}
            />
            <p className="teal-5-12">
              {post.commentsCount > 0 && post.commentsCount}
            </p>
          </div>
        </div>
        <GenerateIcons
          icons={[{ size: 24, src: "/images/icons/save-feed.svg" }]}
        />
      </CardBody>
      {post.lastComment && (
        <CardBody className="w-100 d-flex flex-column gap-3">
          <div className="d-flex flex-column gap-2">
            <CardText
              className="light-grey-6-15"
              style={{ cursor: "pointer" }}
              onClick={toggle}
            >
              View more comments
            </CardText>
            {!!post.lastComment.replyCount && (
              <p
                className="light-grey-6-15"
                style={{ paddingLeft: 55, cursor: "pointer" }}
                onClick={toggle}
              >
                View Replies {post.lastComment.replyCount}
              </p>
            )}
            <Comment post={post} comment={post.lastComment} />
            {/* {openReplyInput && (
              <div className="w-50" style={{ marginLeft: 60 }}>
                <CreateComments
                  post={post}
                  commentId={post.lastComment.id}
                  inputRef={inputRef}
                />
              </div>
            )} */}
          </div>
        </CardBody>
      )}
      {!!comments?.[post.id]?.length && (
        <CardBody className="w-100 d-flex flex-column gap-3">
          <div className="d-flex flex-column gap-2">
            {!post.lastComment && (
              <CardText
                className="light-grey-6-15"
                style={{ cursor: "pointer" }}
                onClick={toggle}
              >
                View more comments
              </CardText>
            )}
            <Comments post={post} comments={comments[post.id]} />
          </div>
        </CardBody>
      )}

      {(openCommentInput || post.lastComment) && (
        <CardBody className="w-100">
          <CreateComments post={post} inputRef={inputRef} />
        </CardBody>
      )}
      <Modal isOpen={singlePostModal} toggle={toggle}>
        <SinglePost postId={post.id} />
      </Modal>
    </Card>
  );
};

export default Post;
