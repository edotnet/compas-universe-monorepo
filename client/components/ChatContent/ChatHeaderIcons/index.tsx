import { FC } from "react";

const ChatHeaderIcons: FC = (): JSX.Element => {
  return (
    <div className="d-flex align-items-center gap-3">
      <picture>
        <img
          src={"/images/icons/phone-call.svg"}
          alt="phone-call"
          width={52}
          height={52}
        />
      </picture>
      <picture>
        <img
          src={"/images/icons/video-call.svg"}
          alt="video-call"
          width={52}
          height={52}
        />
      </picture>
      <picture>
        <img
          src={"/images/icons/dots-circled.svg"}
          alt="dots-circled"
          width={52}
          height={52}
        />
      </picture>
    </div>
  );
};

export default ChatHeaderIcons;
