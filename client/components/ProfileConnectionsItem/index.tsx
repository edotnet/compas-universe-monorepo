import { Dispatch, SetStateAction, memo, useCallback } from "react";
import { useRouter } from "next/router";
import { authApi } from "@/utils/axios";
import { IFriend } from "@/utils/types/user.types";
import { errorHelper } from "@/utils/helpers/error.helper";
import ERROR_MESSAGES from "@/utils/constants/error-messages.constant";
import ErrorEnum from "@/utils/types/enums/error.enum";
import { ToastError } from "@/utils/toastify";
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
      <button onClick={() => handleConnect(connection.id)}>{status}</button>
    </div>
  );
};

export default memo(ProfileConnectionsItem);
