import { useCallback, useEffect, useState } from "react";
import { authApi } from "@/utils/axios";
import { IFriend } from "@/utils/types/user.types";
import { useRouter } from "next/router";
import ViewProfileConnectionsItem from "../ViewProfileConnectionsItem";
import styles from "./index.module.scss";

const ViewProfileConnections = () => {
  const [connections, setConnections] = useState<IFriend[]>([]);
  const [status, setStatus] = useState<string>("Connect");

  const router = useRouter();

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

      requestUrl += `?skip=${0}&take=${10}`;

      if (router.query.id) {
        requestUrl += `&friendId=${router.query.id}`;
      }

      const { data } = await authApi.get(requestUrl);

      if (data.length) {
        setConnections(data);
      }
    } catch (error) {}
  }, [status, router.query.id]);

  useEffect(() => {
    (async () => {
      await handleConnections();
    })();
  }, [status, router.query.id]);

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
          <ViewProfileConnectionsItem
            key={connection.id}
            connection={connection}
            setConnections={setConnections}
          />
        ))}
      </div>
    </div>
  );
};

export default ViewProfileConnections;
