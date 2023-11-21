import ProfilePlaylist from "../ProfilePlaylist";
import ViewProfileInfo from "../ViewProfileInfo";
import { IUserProfileResponse } from "@/utils/types/user.types";
import ViewProfileConnections from "../ViewProfileConnections";
import styles from "./index.module.scss";

interface IProps {
  data: IUserProfileResponse;
}

const ViewProfileContent = ({ data }: IProps) => {
  return (
    <div className={styles.profileContent}>
      <div className={styles.profileContainer}>
        <ViewProfileInfo user={data.user} isFriend={data.isFriend} />
        <ProfilePlaylist />
        <ViewProfileConnections />
      </div>
    </div>
  );
};

export default ViewProfileContent;
