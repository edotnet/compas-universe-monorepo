import { Dispatch, SetStateAction, memo, useCallback, useState } from "react";
import styles from "./index.module.scss";
import { authApi } from "@/utils/axios";
import { IUser } from "@/utils/types/user.types";
import { errorHelper } from "@/utils/helpers/error.helper";
import ERROR_MESSAGES from "@/utils/constants/error-messages.constant";
import { ErrorEnum } from "@/utils/types/enums/error.enum";
import { ToastError } from "@/utils/toastify";

interface IProps {
  status: string;
  connection: IUser;
  setStatus: Dispatch<SetStateAction<string>>;
  setConnections: Dispatch<SetStateAction<IUser[]>>;
}

const ProfileConnectionsItem = ({
  status,
  setStatus,
  connection,
  setConnections,
}: IProps) => {
  const handleConnect = useCallback(
    async (friendId: number) => {
      let requestUrl: string = "/users";
      try {
        if (status === "Connect") {
          requestUrl += "/request-friend";
        }

        if (status === "Disconnect") {
          requestUrl += "/unfriend";
        }

        await authApi.post(requestUrl, { friendId });

        setConnections((prev: IUser[]) =>
          prev.filter((user) => user.id !== friendId)
        );
      } catch (error: any) {
        ToastError(errorHelper(ERROR_MESSAGES.DEFAULT as ErrorEnum));
      }
    },
    [status]
  );

  return (
    <div className={styles.profileConnectionsItem}>
      <picture>
        <img
          src={connection.profilePicture}
          alt="friend"
          width={66}
          height={66}
        />
      </picture>
      <p>{connection.userName}</p>
      <button onClick={() => handleConnect(connection.id)}>{status}</button>
    </div>
  );
};

export default memo(ProfileConnectionsItem);
