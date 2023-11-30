import { useContext, useEffect } from "react";
import { WebsocketContext } from "@/context/Websocket.Context";
import SOCKET_EVENT from "@/utils/types/enums/socket.enum";
import { INotificationEvent } from "@/utils/types/socket-event.types";
import { IUserProfileResponse } from "@/utils/types/user.types";
import ViewProfileInfo from "../ViewProfileInfo";
import { Container } from "reactstrap";
import ProfileInfo from "./ProfileInfo";
import ProfilePlaylist from "./ProfilePlaylist";
import ProfileConnections from "./ProfileConnections";

interface IProps {
  data?: IUserProfileResponse;
}

const ProfileContent = ({ data }: IProps) => {
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
    <Container
      className="d-flex flex-column p-5 gap-5"
      style={{
        background: "linear-gradient(#7D43A417, #2D34DA00, #D5CCFF8C)",
        height: "100vh"
      }}
    >
      {data ? (
        <ViewProfileInfo user={data.user} isFriend={data.isFriend} />
      ) : (
        <ProfileInfo />
      )}
      <ProfilePlaylist />
      <ProfileConnections />
    </Container>
  );
};

export default ProfileContent;
