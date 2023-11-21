import styles from "./index.module.scss";

const ChatHeaderIcons = () => {
  return (
    <div className={styles.chatHeaderIcons}>
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
          alt="vieo-call"
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
