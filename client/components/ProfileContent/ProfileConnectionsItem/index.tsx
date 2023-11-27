import { Dispatch, SetStateAction, memo, useCallback } from "react";
import { useRouter } from "next/router";
import { Button, Card, CardText } from "reactstrap";
import { authApi } from "@/utils/axios";
import { IFriend } from "@/utils/types/user.types";
import { errorHelper } from "@/utils/helpers/error.helper";
import ERROR_MESSAGES from "@/utils/constants/error-messages.constant";
import ErrorEnum from "@/utils/types/enums/error.enum";
import { ToastError } from "@/utils/toastify";
import ProfilePicture from "../ProfilePicture";
import styles from "./index.module.scss";

interface IProps {
  status: string;
  connection: IFriend;
  setConnections: Dispatch<SetStateAction<IFriend[]>>;
}

const ProfileConnectionsItem = ({
  status,
  connection,
  setConnections,
}: IProps) => {
  const router = useRouter();

  const handleConnect = useCallback(
    async (userId: number) => {
      let requestUrl: string = "/users";
      try {
        if (status === "Connect") {
          requestUrl += "/request-friend";
        }

        if (status === "Disconnect") {
          requestUrl += "/unfriend";
        }

        await authApi.post(requestUrl, { friendId: userId });

        setConnections((prev: IFriend[]) =>
          prev.filter((user) => user.id !== userId)
        );
      } catch (error: any) {
        ToastError(errorHelper(ERROR_MESSAGES.DEFAULT as ErrorEnum));
      }
    },
    [status]
  );

  const handleViewProfile = (userId: number) => {
    router.push(`/profile/${userId}`);
  };

  return (
    <Card className="d-flex flex-column align-items-center gap-2 bg-transparent border-0">
      <ProfilePicture
        src={connection.profilePicture}
        width={66}
        height={66}
        borderRadius="50%"
        onClick={() => handleViewProfile(connection.id)}
        styles={{
          border: "2px solid #272727",
          outline: "3px solid #C8BFBF",
          cursor: "pointer",
        }}
      />
      <CardText className="text-6b-4-13 ellipsis-standard">
        {connection.userName}
      </CardText>
      <Button
        color="primary"
        className={styles.btn}
        onClick={() => handleConnect(connection.id)}
      >
        {status}
      </Button>
    </Card>
  );
};

export default memo(ProfileConnectionsItem);
