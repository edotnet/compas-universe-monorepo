import { useState } from "react";
import {
  CardBody,
  CardText,
  Carousel,
  CarouselControl,
  CarouselItem,
} from "reactstrap";
import { withLessMore } from "@/HOC/withLessMore";
import { IUploadedFile } from "@/utils/types/files.types";
import { FileTypes } from "@/utils/types/enums/file.enum";

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

    const slides =
      media &&
      media.map((item: IUploadedFile, index: number) => {
        return (
          <CarouselItem
            onExiting={() => setAnimating(true)}
            onExited={() => setAnimating(false)}
            key={item.meta.src}
          >
            <img
              src={item.meta.src}
              height={400}
              style={{ width: "100%", objectFit: "cover" }}
              alt="slide"
            />
          </CarouselItem>
        );
      });

    return (
      <CardBody className="d-flex flex-column w-100 p-0 gap-3">
        <div className="d-flex align-items-end px-3">
          <CardText
            className="px-3"
            style={
              !isShow
                ? {
                    display: "-webkit-box",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: "5",
                    WebkitBoxOrient: "vertical",
                    maxWidth: 900,
                  }
                : { maxWidth: 900 }
            }
          >
            {description}
          </CardText>
          {description?.length! > 500 && ( // NOT A GOOD SOLUTION
            <CardText
              className="primary-5-14"
              onClick={() => isShowHandler && isShowHandler()}
              style={{ minWidth: "max-content", cursor: "pointer" }}
            >
              {isShow ? "See less" : "See more"}
            </CardText>
          )}
        </div>
        {media?.length && media[0].type !== FileTypes.VIDEO ? (
          <Carousel
            ride="carousel"
            interval={0}
            className="w-100"
            activeIndex={activeIndex}
            next={next}
            previous={previous}
          >
            {slides}
            {media?.length > 1 && (
              <>
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
              </>
            )}
          </Carousel>
        ) : (
          media?.map((file) => (
            <video
              controls
              key={file.meta.src}
              src={file.meta.src}
              style={{ objectFit: "cover" }}
              height={400}
            />
          ))
        )}
      </CardBody>
    );
  }
);

export default PostInfo;
