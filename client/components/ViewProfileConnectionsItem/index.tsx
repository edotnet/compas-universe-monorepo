import { Dispatch, SetStateAction, memo, useCallback, useContext } from "react";
import { useRouter } from "next/router";
import { authApi } from "@/utils/axios";
import { IFriend } from "@/utils/types/user.types";
import { errorHelper } from "@/utils/helpers/error.helper";
import ERROR_MESSAGES from "@/utils/constants/error-messages.constant";
import ErrorEnum from "@/utils/types/enums/error.enum";
import { ToastError } from "@/utils/toastify";
import styles from "./index.module.scss";
import { GlobalContext } from "@/context/Global.context";

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
    <div className={styles.profileConnectionsItem}>
      <picture>
        <img
          src={connection.profilePicture || "/images/no-profile-picture.jpeg"}
          alt="friend"
          width={66}
          height={66}
          onClick={() => {
            handleViewProfile(connection.id);
          }}
        />
      </picture>
      <p>{connection.userName}</p>
      {connection.me ? (
        <p className={styles.me}>You</p>
      ) : (
        <button
          className={
            connection.isFriend ? `${styles.connected}` : `${styles.connect}`
          }
          onClick={() => handleConnect(connection.id)}
          disabled={connection.isFriend || connection.me}
        >
          {connection.me ? "You": connection.isFriend ? "Connected" : "Connect"}
        </button>
      )}
    </div>
  );
};

export default memo(ViewProfileConnectionsItem);
