import { useState } from "react";
import ProfilePlaylistCard from "../ProfilePlaylistCard";
import styles from "./index.module.scss";
import Image from "next/image";

const ProfilePlaylist = () => {
  const [playlist, setPlaylist] = useState([
    {
      id: 1,
      thumbnailUrl:
        "https://media.pitchfork.com/photos/618c3ab295b32339a9955837/master/w_1280%2Cc_limit/Taylor-Swift-Red-Taylors-Version.jpeg",
      title: "Red (Taylor’s Version)",
      author: "Taylor Swift",
    },
    {
      id: 2,
      thumbnailUrl:
        "https://media.pitchfork.com/photos/618c3ab295b32339a9955837/master/w_1280%2Cc_limit/Taylor-Swift-Red-Taylors-Version.jpeg",
      title: "Red (Taylor’s Version)",
      author: "Taylor Swift",
    },
    {
      id: 3,
      thumbnailUrl:
        "https://media.pitchfork.com/photos/618c3ab295b32339a9955837/master/w_1280%2Cc_limit/Taylor-Swift-Red-Taylors-Version.jpeg",
      title: "Red (Taylor’s Version)",
      author: "Taylor Swift",
    },
    {
      id: 4,
      thumbnailUrl:
        "https://media.pitchfork.com/photos/618c3ab295b32339a9955837/master/w_1280%2Cc_limit/Taylor-Swift-Red-Taylors-Version.jpeg",
      title: "Red (Taylor’s Version)",
      author: "Taylor Swift",
    },
    {
      id: 5,
      thumbnailUrl:
        "https://media.pitchfork.com/photos/618c3ab295b32339a9955837/master/w_1280%2Cc_limit/Taylor-Swift-Red-Taylors-Version.jpeg",
      title: "Red (Taylor’s Version)",
      author: "Taylor Swift",
    },
    {
      id: 6,
      thumbnailUrl:
        "https://media.pitchfork.com/photos/618c3ab295b32339a9955837/master/w_1280%2Cc_limit/Taylor-Swift-Red-Taylors-Version.jpeg",
      title: "Red (Taylor’s Version)",
      author: "Taylor Swift",
    },
    {
      id: 7,
      thumbnailUrl:
        "https://media.pitchfork.com/photos/618c3ab295b32339a9955837/master/w_1280%2Cc_limit/Taylor-Swift-Red-Taylors-Version.jpeg",
      title: "Red (Taylor’s Version)",
      author: "Taylor Swift",
    },
    {
      id: 8,
      thumbnailUrl:
        "https://media.pitchfork.com/photos/618c3ab295b32339a9955837/master/w_1280%2Cc_limit/Taylor-Swift-Red-Taylors-Version.jpeg",
      title: "Red (Taylor’s Version)",
      author: "Taylor Swift",
    },
    {
      id: 9,
      thumbnailUrl:
        "https://media.pitchfork.com/photos/618c3ab295b32339a9955837/master/w_1280%2Cc_limit/Taylor-Swift-Red-Taylors-Version.jpeg",
      title: "Red (Taylor’s Version)",
      author: "Taylor Swift",
    },
    {
      id: 10,
      thumbnailUrl:
        "https://media.pitchfork.com/photos/618c3ab295b32339a9955837/master/w_1280%2Cc_limit/Taylor-Swift-Red-Taylors-Version.jpeg",
      title: "Red (Taylor’s Version)",
      author: "Taylor Swift",
    },
    {
      id: 11,
      thumbnailUrl:
        "https://media.pitchfork.com/photos/618c3ab295b32339a9955837/master/w_1280%2Cc_limit/Taylor-Swift-Red-Taylors-Version.jpeg",
      title: "Red (Taylor’s Version)",
      author: "Taylor Swift",
    },
    {
      id: 12,
      thumbnailUrl:
        "https://media.pitchfork.com/photos/618c3ab295b32339a9955837/master/w_1280%2Cc_limit/Taylor-Swift-Red-Taylors-Version.jpeg",
      title: "Red (Taylor’s Version)",
      author: "Taylor Swift",
    },
  ]);

  return (
    <div className={styles.profilePlaylist}>
      <div className={styles.searchBox}>
        <div className={styles.searchIcon}>
          <picture>
            <img
              src="/images/icons/search.svg"
              alt="search"
              width={23}
              height={23}
            />
          </picture>
          <input type="text" placeholder="Search artists, songs, albums" />
        </div>
        <picture>
          <img
            src="/images/icons/microphone.svg"
            alt="microphone"
            width={22}
            height={22}
          />
        </picture>
      </div>
      <div className={styles.cardContainer}>
        {playlist.map((item) => (
          <ProfilePlaylistCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ProfilePlaylist;
