import { IExtendedUser } from "@/utils/types/user.types";
import styles from "./index.module.scss";
import { useCallback, useEffect, useState } from "react";
import { ToastError } from "@/utils/toastify";
import { errorHelper } from "@/utils/helpers/error.helper";
import ERROR_MESSAGES from "@/utils/constants/error-messages.constant";
import ErrorEnum from "@/utils/types/enums/error.enum";
import { authApi } from "@/utils/axios";

interface IProps {
  user: IExtendedUser;
  isFriend: boolean;
}

const ViewProfileInfo = ({ user, isFriend }: IProps) => {
  const [friend, setFriend] = useState<boolean>(isFriend);
  useEffect(() => {
    setFriend(isFriend);
  }, [isFriend]);

  const handleConnect = useCallback(
    async (userId: number) => {
      let requestUrl: string = "/users";
      try {
        if (friend) {
          requestUrl += "/unfriend";
        } else {
          requestUrl += "/request-friend";
        }

        await authApi.post(requestUrl, { friendId: userId });
        if (friend) {
          setFriend(false);
        } else {
          setFriend(true);
        }
      } catch (error: any) {
        ToastError(errorHelper(ERROR_MESSAGES.DEFAULT as ErrorEnum));
      }
    },
    [friend]
  );

  return (
    <div className={styles.profileInfo}>
      <div className={styles.profileImgContainer}>
        <picture>
          <img
            src={user.profilePicture || "/images/no-profile-picture.jpeg"}
            alt="profile"
            width={247}
            height={186}
          />
        </picture>
        <div className={styles.profileDetails}>
          <p>{user.userName}</p>
          <span>{user.type}</span>
          <button onClick={() => handleConnect(user.id)}>
            {friend ? "Disconnect" : "Connect"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProfileInfo;
