import ProfilePlaylistCard from "../ProfilePlaylistCard";

interface IProps {
  playlist: any[];
}

const ProfilePlaylistCardsContainer = ({ playlist }: IProps) => {
  return (
    <div className="d-flex gap-4 overflow-x-auto vanish-scroll">
      {playlist.map((item) => (
        <ProfilePlaylistCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default ProfilePlaylistCardsContainer;
