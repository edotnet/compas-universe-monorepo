import Image from "next/image";
import { useEffect, useState } from "react";
import { authApi } from "@/utils/axios";
import { IExtendedUser } from "@/utils/types/user.types";
import styles from "./index.module.scss";
import AuthService from "@/services/AuthService";
import { useRouter } from "next/router";

const ProfileInfo = () => {
  const [me, setMe] = useState<IExtendedUser>();
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    try {
      (async () => {
        const { data } = await authApi.get("/users/me");
        if (data) {
          setMe(data);
        }
      })();
    } catch (error) {}
  }, []);

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
              src={me?.profilePicture}
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
