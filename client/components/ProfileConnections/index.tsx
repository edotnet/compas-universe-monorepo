import { useCallback, useEffect, useState } from "react";
import ProfileConnectionsItem from "../ProfileConnectionsItem";
import { authApi } from "@/utils/axios";
import { IFriend } from "@/utils/types/user.types";
import styles from "./index.module.scss";

const ProfileConnections = () => {
  const [connections, setConnections] = useState<IFriend[]>([]);
  const [status, setStatus] = useState<string>("Connect");

  const handleConnections = useCallback(async () => {
    setConnections([]);

    let requestUrl: string = "/users";
    try {
      if (status === "Connect") {
        requestUrl += "/non-friends";
      }

      if (status === "Disconnect") {
        requestUrl += "/friends";
      }

      const { data } = await authApi.get(`${requestUrl}?skip=${0}&take=${10}`);

      if (data.length) {
        setConnections(data);
      }
    } catch (error) {}
  }, [status]);

  useEffect(() => {
    (async () => {
      await handleConnections();
    })();
  }, [status]);

  return (
    <div className={styles.profileConnections}>
      <div className={styles.buttons}>
        <ul>
          <li
            className={status === "Connect" ? styles.active : ""}
            onClick={() => setStatus("Connect")}
          >
            Friends
          </li>
          <li
            className={status === "Disconnect" ? styles.active : ""}
            onClick={() => setStatus("Disconnect")}
          >
            Followed
          </li>
        </ul>
        <a href="">See more</a>
      </div>
      <div className={styles.itemContainer}>
        {connections.map((connection) => (
          <ProfileConnectionsItem
            setConnections={setConnections}
            key={connection.id}
            connection={connection}
            status={status}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfileConnections;
