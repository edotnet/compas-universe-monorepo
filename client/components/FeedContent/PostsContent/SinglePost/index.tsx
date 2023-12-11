import {
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import GenerateIcons from "@/components/ChatContent/GenerateIcons";
import ProfilePicture from "@/components/ProfileContent/ProfilePicture";
import { IExtendedComment, IPostExtended } from "@/utils/types/posts.types";
import PostInfo from "../PostInfo";
import { useCallback, useEffect, useRef, useState } from "react";
import { authApi } from "@/utils/axios";
import CreateComments from "../CreateComment";
import Comments from "../Comments";

interface IProps {
  postId: number;
}

const SinglePost = ({ postId }: IProps) => {
  const [singlePost, setSinglePost] = useState<IPostExtended>(null!);
  const [singlePostComments, setSinglePostComments] = useState<
    IExtendedComment[]
  >([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePostLike = useCallback(async (): Promise<void> => {
    const payload: Record<string, number> = { postId: singlePost?.id };

    try {
      await authApi.post("/feed/like", payload);

      if (!singlePost.liked) {
        singlePost.likesCount + 1;
      } else {
        singlePost.likesCount - 1;
      }

      singlePost.liked = !singlePost.liked;

      setSinglePost(singlePost);
    } catch (error) {}
  }, [singlePost]);

  const handlePostGet = useCallback(async () => {
    try {
      const { data }: { data: IPostExtended } = await authApi.get(
        `/feed/${postId}`
      );
      setSinglePost(data);
    } catch (error) {}
  }, [singlePost]);

  useEffect(() => {
    setSinglePostComments([]);
    handlePostGet();
  }, []);

  const readyToComment = () => {
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
            <CardTitle className="black-7-16">
              {singlePost?.user.userName}
            </CardTitle>
            <CardSubtitle className="text-muted">
              @{singlePost?.user.userName}
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
        media={singlePost?.content.media}
        description={singlePost?.content.description}
      />
      <CardBody
        className="d-flex align-items-center w-100 justify-content-between"
        style={
          singlePostComments.length
            ? { borderBottom: "1px solid rgba(0, 0, 0, 0.175)" }
            : {}
        }
      >
        <div className="d-flex align-items-center gap-4">
          <div className="d-flex align-items-center">
            {singlePost?.liked ? (
              <GenerateIcons
                icons={[{ size: 24, src: "/images/icons/like-feed.svg" }]}
                onClick={() => handlePostLike()}
              />
            ) : (
              <GenerateIcons
                icons={[{ size: 24, src: "/images/icons/heart-feed.svg" }]}
                onClick={() => handlePostLike()}
              />
            )}
            <p className="teal-5-12" style={{ width: 10 }}>
              {singlePost?.likesCount > 0 && singlePost?.likesCount}
            </p>
          </div>
          <div className="d-flex align-items-center">
            <GenerateIcons
              icons={[{ size: 24, src: "/images/icons/comment-feed.svg" }]}
              onClick={() => readyToComment()}
            />
            <p className="teal-5-12">
              {singlePost?.commentsCount > 0 && singlePost?.commentsCount}
            </p>
          </div>
        </div>
        <GenerateIcons
          icons={[{ size: 24, src: "/images/icons/save-feed.svg" }]}
        />
      </CardBody>
      {singlePost && (
        <CardBody className="w-100 d-flex flex-column gap-3">
          <Comments
            post={singlePost}
            containerRef={containerRef}
            comments={singlePostComments}
            setSinglePostComments={setSinglePostComments}
          />
        </CardBody>
      )}

      {singlePost && (
        <CardBody className="w-100">
          <CreateComments
            post={singlePost}
            inputRef={inputRef}
            containerRef={containerRef}
            setSinglePostComments={setSinglePostComments}
          />
        </CardBody>
      )}
    </Card>
  );
};

export default SinglePost;
