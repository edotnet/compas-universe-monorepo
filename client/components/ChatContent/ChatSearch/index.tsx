import {
  Button,
  CardText,
  DropdownItem,
  DropdownMenu,
  UncontrolledDropdown,
  DropdownToggle,
} from "reactstrap";
import styles from "./index.module.scss";

const ChatSearch = () => {
  return (
    <div className="d-flex flex-column align-items-center gap-2 w-100 px-4">
      <div className="d-flex justify-content-between align-items-center w-100">
        <CardText className="text-27-7-23">Messages</CardText>
        <UncontrolledDropdown className="me-2" direction="down">
          <DropdownToggle color="transparent" className={styles.dots}>
            <picture>
              <img
                src={"/images/icons/dots.svg"}
                alt="dots"
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
      </div>
      <div className="d-flex flex-column gap-2 w-100">
        <div className={`${styles.input} d-flex align-items-center gap-2`}>
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
        <Button
          color="primary"
          className={`${styles.btn} d-flex justify-content-center align-items-center gap-1`}
        >
          <CardText className="fs-5">+</CardText>
          <CardText>Start New Chat</CardText>
        </Button>
      </div>
    </div>
  );
};

export default ChatSearch;
