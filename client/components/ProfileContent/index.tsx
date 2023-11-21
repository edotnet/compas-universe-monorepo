import ProfileInfo from "../ProfileInfo";
import ProfilePlaylist from "../ProfilePlaylist";
import ProfileConnections from "../ProfileConnections";
import styles from "./index.module.scss";

const ProfileContent = () => (
  <div className={styles.profileContent}>
    <div className={styles.profileContainer}>
      <ProfileInfo />
      <ProfilePlaylist/>
      <ProfileConnections />
    </div>
  </div>
);

export default ProfileContent;
