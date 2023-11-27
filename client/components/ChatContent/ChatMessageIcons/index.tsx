import { Button } from "reactstrap";

const ChatMessageIcons = () => {
  return (
    <div className="d-flex align-items-center">
      <div
        className="d-flex align-items-center"
        style={{ borderRight: "1px solid #E3E8E7;" }}
      >
        <Button color="transparent">
          <picture>
            <img
              src={"/images/icons/video.svg"}
              alt="video"
              width={20}
              height={20}
            />
          </picture>
        </Button>
        <Button color="transparent">
          <picture>
            <img
              src={"/images/icons/voice.svg"}
              alt="video"
              width={20}
              height={20}
            />
          </picture>
        </Button>
      </div>
      <div
        className="d-flex align-items-center"
        style={{ borderRight: "1px solid #E3E8E7;" }}
      >
        <Button color="transparent">
          <picture>
            <img
              src={"/images/icons/smile.svg"}
              alt="video"
              width={20}
              height={20}
            />
          </picture>
        </Button>
        <Button color="transparent">
          <picture>
            <img
              src={"/images/icons/file.svg"}
              alt="video"
              width={20}
              height={20}
            />
          </picture>
        </Button>
        <Button color="transparent">
          <picture>
            <img
              src={"/images/icons/notes.svg"}
              alt="video"
              width={20}
              height={20}
            />
          </picture>
        </Button>
      </div>
      <div className="d-flex align-items-center justify-content-between">
        <Button color="transparent">
          <picture>
            <img
              src={"/images/icons/dots-vertical.svg"}
              alt="video"
              width={20}
              height={20}
            />
          </picture>
        </Button>
      </div>
    </div>
  );
};

export default ChatMessageIcons;
