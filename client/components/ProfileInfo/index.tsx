import Image from "next/image";
import { useContext, useState } from "react";
import AuthService from "@/services/AuthService";
import { useRouter } from "next/router";
import styles from "./index.module.scss";
import { GlobalContext } from "@/context/Global.context";

const ProfileInfo = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const { me } = useContext(GlobalContext)!;

  const handleLogout = async () => {
    await AuthService.logout();
    setLoading(true);
    setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  return (
    <>
      {loading && (
        <div className={styles.loadingBar}>
          <div className={styles.progress}></div>
        </div>
      )}
      <div className={styles.profileInfo}>
        <div className={styles.profileImgContainer}>
          <picture>
            <img
              src={me?.profilePicture || "/images/no-profile-picture.jpeg"}
              alt="profile"
              width={247}
              height={186}
            />
          </picture>
          <div className={styles.profileDetails}>
            <p>{me?.userName}</p>
            <span>{me?.type}</span>
            <div className={styles.buttons}>
              <button>Manage profile</button>
              <button>
                <span>...</span>
              </button>
            </div>
          </div>
        </div>
        <button className={styles.logout} onClick={() => handleLogout()}>
          Log out
        </button>
        <Image src="/images/icons/bell.svg" alt="bell" width={54} height={50} />
      </div>
    </>
  );
};

export default ProfileInfo;
