import { useContext, useEffect, useState } from "react";
import { WebsocketContext } from "@/context/Websocket.Context";
import ProfileInfo from "../ProfileInfo";
import ProfilePlaylist from "../ProfilePlaylist";
import ProfileConnections from "../ProfileConnections";
import SOCKET_EVENT from "@/utils/types/enums/socket.enum";
import { INotificationEvent } from "@/utils/types/socket-event.types";
import styles from "./index.module.scss";

const ProfileContent = () => {
  const socket = useContext(WebsocketContext);

  useEffect(() => {
    socket
      .off(`${SOCKET_EVENT.NOTIFICATION_NEW}`)
      .on(
        `${SOCKET_EVENT.NOTIFICATION_NEW}`,
        async (data: INotificationEvent) => {
          if (data) {
          }
        }
      );
  }, []);

  return (
    <div className={styles.profileContent}>
      <div className={styles.profileContainer}>
        <ProfileInfo />
        <ProfilePlaylist />
        <ProfileConnections />
      </div>
    </div>
  );
};

export default ProfileContent;
