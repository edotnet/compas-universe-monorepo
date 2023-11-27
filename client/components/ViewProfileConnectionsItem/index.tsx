import { Dispatch, SetStateAction, memo, useCallback, useContext } from "react";
import { useRouter } from "next/router";
import { authApi } from "@/utils/axios";
import { IFriend } from "@/utils/types/user.types";
import { errorHelper } from "@/utils/helpers/error.helper";
import ERROR_MESSAGES from "@/utils/constants/error-messages.constant";
import ErrorEnum from "@/utils/types/enums/error.enum";
import { ToastError } from "@/utils/toastify";
import { GlobalContext } from "@/context/Global.context";
import ProfilePicture from "../ProfileContent/ProfilePicture";
import { Button, CardText, Card } from "reactstrap";
import styles from "./index.module.scss";

interface IProps {
  connection: IFriend;
  setConnections: Dispatch<SetStateAction<IFriend[]>>;
}

const ViewProfileConnectionsItem = ({ connection, setConnections }: IProps) => {
  const router = useRouter();

  const { me } = useContext(GlobalContext);

  const handleConnect = useCallback(
    async (userId: number) => {
      try {
        await authApi.post("/users/request-friend", { friendId: userId });

        setConnections((prev) => [
          ...prev.map((connection: IFriend) =>
            connection.id === userId
              ? { ...connection, isFriend: true }
              : connection
          ),
        ]);
      } catch (error: any) {
        ToastError(errorHelper(ERROR_MESSAGES.DEFAULT as ErrorEnum));
      }
    },
    [connection.isFriend, setConnections]
  );

  const handleViewProfile = (userId: number) => {
    if (userId === me?.id) {
      router.push("/profile");
    } else {
      router.push(`/profile/${userId}`);
    }
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
      {connection.me ? (
        <CardText className="text-74-5-15">You</CardText>
      ) : connection.isFriend ? (
        <CardText className="text-74-5-15">Connected</CardText>
      ) : (
        <Button
          color="primary"
          className={`${styles.connect} ${styles.btn}`}
          onClick={() => handleConnect(connection.id)}
        >
          Connect
        </Button>
      )}
    </Card>
  );
};

export default memo(ViewProfileConnectionsItem);
