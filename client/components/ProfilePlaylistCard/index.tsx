import { memo } from "react";
import styles from "./index.module.scss";

interface IProps {
  item: any;
}

const ProfilePlaylistCard = ({ item }: IProps) => (
  <div className={styles.profilePlaylistCard}>
    <picture>
      <img src={item.thumbnailUrl} alt="song" width={171} height={171} />
    </picture>
    <p>{item.title}</p>
    <span>{item.author}</span>
  </div>
);

export default memo(ProfilePlaylistCard);
