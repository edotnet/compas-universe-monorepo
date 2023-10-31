import {
  Dispatch,
  SetStateAction,
  memo,
  useCallback,
} from "react";
import styles from "./index.module.scss";
import { authApi } from "@/utils/axios";
import { IUser } from "@/utils/types/user.types";
import { errorHelper } from "@/utils/helpers/error.helper";
import ERROR_MESSAGES from "@/utils/constants/error-messages.constant";
import { ErrorEnum } from "@/utils/types/enums/error.enum";
import { ToastError } from "@/utils/toastify";

interface IProps {
  connection: IUser;
  status: string;
  setConnections: Dispatch<SetStateAction<IUser[]>>;
}

const ProfileConnectionsItem = ({
  setConnections,
  connection,
  status,
}: IProps) => {
  const handleConnect = useCallback(
    async (followingId: number) => {
      let requestUrl: string = "/users";
      try {
        if (status === "Connect") {
          requestUrl += "/follow";
        }

        if (status === "Disconnect") {
          requestUrl += "/unfollow";
        }

        await authApi.post(requestUrl, { followingId: 0 });

        setConnections((prev: IUser[]) =>
          prev.filter((user) => user.id !== followingId)
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
          alt="follow"
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
