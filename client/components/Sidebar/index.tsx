import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { CardText, ListGroup, ListGroupItem } from "reactstrap";
import styles from "./index.module.scss";

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
      <ListGroup className={styles.firstMenu}>
        <Link href="/profile">
          <ListGroupItem
            className={router.pathname === "/profile" ? styles.active : ""}
          >
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
            <CardText>My profile</CardText>
          </ListGroupItem>
        </Link>
        <Link href="/admin">
          <ListGroupItem
            className={router.pathname === "/admin" ? styles.active : ""}
          >
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
            <CardText>Admin</CardText>
          </ListGroupItem>
        </Link>
        <Link href="/feed">
          <ListGroupItem
            className={router.pathname === "/feed" ? styles.active : ""}
          >
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
            <CardText>Feeds</CardText>
          </ListGroupItem>
        </Link>
        <Link href="/artist">
          <ListGroupItem
            className={router.pathname === "/artist" ? styles.active : ""}
          >
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
            <CardText>Artist</CardText>
          </ListGroupItem>
        </Link>
        <Link href="/chat">
          <ListGroupItem
            className={router.pathname === "/chat" ? styles.active : ""}
          >
            <Image
              src={
                router.pathname === "/chat"
                  ? "/images/icons/chat-active.svg"
                  : "/images/icons/chat.svg"
              }
              alt="chat"
              width={22.8}
              height={22.8}
            />
            <CardText>Chat</CardText>
          </ListGroupItem>
        </Link>
      </ListGroup>
      <ListGroup className={styles.secondMenu}>
        <ListGroupItem>
          <CardText>Top 100</CardText>
          <Image
            src="/images/icons/chart.svg"
            alt="chart"
            width={19}
            height={19}
          />
        </ListGroupItem>
        <ListGroupItem>Rich Brian’s collections</ListGroupItem>
        <ListGroupItem>deep focus</ListGroupItem>
        <ListGroupItem>Lo-Fi Jazz upbeat</ListGroupItem>
        <ListGroupItem>For workplace</ListGroupItem>
        <ListGroupItem>Christmas playlist</ListGroupItem>
      </ListGroup>
    </aside>
  );
};

export default Sidebar;
