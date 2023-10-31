import Image from "next/image";
import Link from "next/link";
import styles from "./index.module.scss";
import { useRouter } from "next/router";

const Sidebar = () => {
  const router = useRouter();

  return (
    <aside className={styles.sidebar}>
      <Image
        src="/images/logo-with-name.png"
        alt="logo"
        width={127}
        height={55.3}
      />
      <ul className={styles.firstMenu}>
        <Link href="/profile">
          <li className={router.pathname === "/profile" ? styles.active : ""}>
            <Image
              src={
                router.pathname === "/profile"
                  ? "/images/icons/home-active.svg"
                  : "/images/icons/home.svg"
              }
              alt="home"
              width={22.8}
              height={22.8}
            />
            <p>My profile</p>
          </li>
        </Link>
        <Link href="/admin">
          <li className={router.pathname === "/admin" ? styles.active : ""}>
            <Image
              src={
                router.pathname === "/admin"
                  ? "/images/icons/dashboard-active.svg"
                  : "/images/icons/dashboard.svg"
              }
              alt="dashboard"
              width={22.8}
              height={22.8}
            />
            <p>Admin</p>
          </li>
        </Link>
        <Link href="/feed">
          <li className={router.pathname === "/feed" ? styles.active : ""}>
            <Image
              src={
                router.pathname === "/feed"
                  ? "/images/icons/heart-active.svg"
                  : "/images/icons/heart.svg"
              }
              alt="heart"
              width={22.8}
              height={22.8}
            />
            <p>Feeds</p>
          </li>
        </Link>
        <Link href="/artist">
          <li className={router.pathname === "/artist" ? styles.active : ""}>
            <Image
              src={
                router.pathname === "/artist"
                  ? "/images/icons/headphones-active.svg"
                  : "/images/icons/headphones.svg"
              }
              alt="headphones"
              width={22.8}
              height={22.8}
            />
            <p>Artist</p>
          </li>
        </Link>
      </ul>
      <ul className={styles.secondMenu}>
        <li>
          <p>Top 100</p>
          <Image
            src="/images/icons/chart.svg"
            alt="chart"
            width={19}
            height={19}
          />
        </li>
        <li>Rich Brian’s collections</li>
        <li>deep focus</li>
        <li>Lo-Fi Jazz upbeat</li>
        <li>For workplace</li>
        <li>Christmas playlist</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
