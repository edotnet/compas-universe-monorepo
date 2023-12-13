import { FC, useEffect, useState } from "react";
import { authApi } from "@/utils/axios";
import { ToastError } from "@/utils/toastify";
import { errorHelper } from "@/utils/helpers/error.helper";
import ERROR_MESSAGES from "@/utils/constants/error-messages.constant";
import { IExtendedUser } from "@/utils/types/user.types";
import ErrorEnum from "@/utils/types/enums/error.enum";
import { Button } from "reactstrap";
import ProfilePicture from "../ProfileContent/ProfilePicture";

interface IProps {
  user: IExtendedUser;
  isFriend: boolean;
}

const ViewProfileInfo: FC<IProps> = ({ user, isFriend }): JSX.Element => {
  const [friend, setFriend] = useState<boolean>(isFriend);

  useEffect(() => {
    setFriend(isFriend);
  }, [user]);

  const handleConnect = async (userId: number): Promise<void> => {
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
  };

  return (
    <div className="d-flex justify-content-between align-items-center w-100">
      <div className="d-flex align-items-center gap-5">
        <ProfilePicture
          src={user.profilePicture}
          width={247}
          height={186}
          borderRadius="12px"
        />
        <div className="d-flex flex-column gap-3">
          <p className="charcoal-6-36">{user.userName}</p>
          <span className="grey-4-20" style={{ marginBottom: 5 }}>
            {user.type}
          </span>
          <Button
            color="primary"
            style={{ padding: "11px 15px" }}
            onClick={() => handleConnect(user.id)}
          >
            {friend ? "Disconnect" : "Connect"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewProfileInfo;
