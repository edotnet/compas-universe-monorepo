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
import { IPostExtended } from "@/utils/types/posts.types";
import PostInfo from "../PostInfo";

interface IProps {
  post: IPostExtended;
}

const Post = ({ post }: IProps) => {
  return (
    <Card className="d-flex flex-column align-items-center" >
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
      <CardBody className="d-flex align-items-center w-100 justify-content-between">
        <div className="d-flex align-items-center gap-4">
          <div className="d-flex align-items-center">
            <GenerateIcons
              icons={[{ size: 24, src: "/images/icons/heart-feed.svg" }]}
            />
            <p className="teal-5-12">{post.likesCount}</p>
          </div>
          <div className="d-flex align-items-center">
            <GenerateIcons
              icons={[{ size: 24, src: "/images/icons/comment-feed.svg" }]}
            />
            <p className="teal-5-12">{post.commentsCount}</p>
          </div>
        </div>
        <GenerateIcons
          icons={[{ size: 24, src: "/images/icons/save-feed.svg" }]}
        />
      </CardBody>
    </Card>
  );
};

export default Post;
