import ProfilePlaylistCard from "../ProfilePlaylistCard";
import styles from "./index.module.scss";

interface IProps {
  playlist: any[];
}

const ProfilePlaylistCardsContainer = ({ playlist }: IProps) => {
  return (
    <div className={`${styles.cardsContainer} d-flex gap-4 overflow-x-auto`}>
      {playlist.map((item) => (
        <ProfilePlaylistCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default ProfilePlaylistCardsContainer;
