import { IHocProps, withLessMore } from "@/HOC/withLessMore";
import { MediaData } from "@/utils/types/chat.types";
import { IUploadedFile } from "@/utils/types/files.types";
import { useState } from "react";
import {
  CardBody,
  CardText,
  Carousel,
  CarouselControl,
  CarouselIndicators,
  CarouselItem,
} from "reactstrap";

interface IProps {
  media?: IUploadedFile[];
  description?: string;
  isShow?: boolean;
  isShowHandler?: () => void;
}

const PostInfo = withLessMore<IProps>(
  ({ media, description, isShow, isShowHandler }: IProps) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [animating, setAnimating] = useState<boolean>(false);

    const next = () => {
      if (animating) return;
      const nextIndex = activeIndex === media!.length - 1 ? 0 : activeIndex + 1;
      setActiveIndex(nextIndex);
    };

    const previous = () => {
      if (animating) return;
      const nextIndex = activeIndex === 0 ? media!.length - 1 : activeIndex - 1;
      setActiveIndex(nextIndex);
    };

    const goToIndex = (newIndex: number) => {
      if (animating) return;
      setActiveIndex(newIndex);
    };

    const slides =
      media &&
      media.map((item: IUploadedFile) => {
        return (
          <CarouselItem
            onExiting={() => setAnimating(true)}
            onExited={() => setAnimating(false)}
            key={item.meta.src}
          >
            <img
              src={item.meta.src}
              height={500}
              style={{ width: "100%", objectFit: "cover" }}
              alt="slide"
            />
          </CarouselItem>
        );
      });

    return (
      <CardBody className="d-flex flex-column w-100 p-0 gap-3">
        <CardText
          className="px-3"
          style={
            !isShow
              ? {
                  display: "-webkit-box",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  "-webkit-line-clamp": "5",
                  "-webkit-box-orient": "vertical",
                }
              : {}
          }
        >
          {description}
        </CardText>
        <button onClick={() => isShowHandler && isShowHandler()}>
          {isShow ? "show less" : "show more"}
        </button>
        {media && (
          <Carousel
            ride="carousel"
            interval={0}
            className="w-100"
            activeIndex={activeIndex}
            next={next}
            previous={previous}
          >
            <CarouselIndicators
              items={media!}
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
      </CardBody>
    );
  }
);

export default PostInfo;
