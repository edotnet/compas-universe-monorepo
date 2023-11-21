import styles from "./index.module.scss";

const ChatSearch = () => {
  return (
    <div className={styles.chatSearch}>
      <div className={styles.header}>
        <p>Messages</p>
        <picture>
          <img
            src={"/images/icons/dots.svg"}
            alt="dots"
            width={24}
            height={24}
          />
        </picture>
      </div>

      <div className={styles.inputContainer}>
        <div className={styles.input}>
          <picture>
            <img
              src={"/images/icons/chat-search.svg"}
              alt="search"
              width={24}
              height={24}
            />
          </picture>
          <input type="text" placeholder="Search for chats..." />
        </div>
        <button>
          <span>+</span>
          <span>Start New Chat</span>
        </button>
      </div>
    </div>
  );
};

export default ChatSearch;
