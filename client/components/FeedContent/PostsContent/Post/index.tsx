import GenerateIcons from "@/components/ChatContent/GenerateIcons";
import ProfilePicture from "@/components/ProfileContent/ProfilePicture";
import { IPostExtended } from "@/utils/types/posts.types";
import { useState } from "react";
import {
  Card,
  CardBody,
  CardImg,
  CardSubtitle,
  CardText,
  CardTitle,
  Carousel,
  CarouselCaption,
  CarouselControl,
  CarouselIndicators,
  CarouselItem,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";

interface IProps {
  post: IPostExtended;
}

const Post = ({ post }: IProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [animating, setAnimating] = useState<boolean>(false);

  const next = () => {
    if (animating) return;
    const nextIndex =
      activeIndex === post.content.media!.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex =
      activeIndex === 0 ? post.content.media!.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex: number) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const slides =
    post.content.media &&
    post.content.media.map((item) => {
      return (
        <CarouselItem
          onExiting={() => setAnimating(true)}
          onExited={() => setAnimating(false)}
          key={item.meta.src}
        >
          <img src={item.meta.src} alt="slide" />
          {/* <CarouselCaption
            captionText={item.caption}
            captionHeader={item.caption}
          /> */}
        </CarouselItem>
      );
    });

  return (
    <Card>
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
            <GenerateIcons
              icons={[
                { size: 24, src: "/images/icons/dots-vertical-feed.svg" },
              ]}
            />
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Header</DropdownItem>
            <DropdownItem>Another Action</DropdownItem>
            <DropdownItem divider />
            <DropdownItem>Another Action</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </CardBody>
      <CardBody>
        <CardText>{post.content?.description}</CardText>
      </CardBody>
      {/* {post.content.media?.map((media) => (
        <CardImg
          style={{ borderRadius: 0 }}
          height={500}
          src={media.meta.src}
        />
      ))}
       */}
      {post.content.media && (
        <Carousel
          activeIndex={activeIndex}
          next={next}
          previous={previous}
          // {...args}
        >
          <CarouselIndicators
            items={post.content.media!}
            activeIndex={activeIndex}
            onClickHandler={goToIndex}
          />
          {slides}
          <CarouselControl
            direction="prev"
            directionText="Previous"
            onClickHandler={previous}
          />
          <CarouselControl
            direction="next"
            directionText="Next"
            onClickHandler={next}
          />
        </Carousel>
      )}

      <CardBody className="d-flex align-items-center justify-content-between">
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
