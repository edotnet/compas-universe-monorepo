import { ListGroup, ListGroupItem } from "reactstrap";
import { Dispatch, SetStateAction } from "react";
import styles from "./index.module.scss";

interface IProps {
  status: string;
  setStatus: Dispatch<SetStateAction<string>>;
}

const ProfileConnectionTabs = ({ status, setStatus }: IProps) => {
  return (
    <div className="d-flex justify-content-between align-items-center">
      <ListGroup className={`${styles.ul} flex-row align-items-center gap-3`}>
        <ListGroupItem
          style={status !== "Connect" ? { color: "#858585" } : {}}
          className={
            status === "Connect"
              ? `${styles.active} text-27-6-23`
              : "text-85-4-20"
          }
          onClick={() => setStatus("Connect")}
        >
          Friends
        </ListGroupItem>
        <ListGroupItem
          style={status !== "Disconnect" ? { color: "#858585" } : {}}
          className={
            status === "Disconnect"
              ? `${styles.active} text-27-6-23`
              : "text-85-4-20"
          }
          onClick={() => setStatus("Disconnect")}
        >
          Followed
        </ListGroupItem>
      </ListGroup>
      <a className="text-74-5-15" href="">
        See more
      </a>
    </div>
  );
};

export default ProfileConnectionTabs;
