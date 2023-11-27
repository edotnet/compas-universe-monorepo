import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { CardSubtitle } from "reactstrap";
import { authApi } from "@/utils/axios";
import ProfileConnectionTabs from "../ProfileConnectionTabs";
import ProfileConnectionsItem from "../ProfileConnectionsItem";
import { IFriend } from "@/utils/types/user.types";
import ViewProfileConnectionsItem from "@/components/ViewProfileConnectionsItem";

const ProfileConnections = () => {
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
    <div className="d-flex flex-column gap-3">
      <ProfileConnectionTabs status={status} setStatus={setStatus} />
      <div className="d-flex gap-5">
        {connections.length >  0 ? (
          connections.map((connection) =>
            router.query.id ? (
              <ViewProfileConnectionsItem
                key={connection.id}
                connection={connection}
                setConnections={setConnections}
              />
            ) : (
              <ProfileConnectionsItem
                key={connection.id}
                status={status}
                connection={connection}
                setConnections={setConnections}
              />
            )
          )
        ) : (
          <CardSubtitle className="text-muted fs-7" tag="span">
            {status === "Connect" ? "No Recommendations" : "No Followings"}
          </CardSubtitle>
        )}
      </div>
    </div>
  );
};

export default ProfileConnections;
