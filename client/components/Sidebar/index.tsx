import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { CardText, ListGroup, ListGroupItem } from "reactstrap";
import styles from "./index.module.scss";

const Sidebar = () => {
  const router = useRouter();

  return (
    <aside
      className="d-flex flex-column p-4 gap-4 bg-white"
      style={{ width: "100%", maxWidth: 300 }}
    >
      <Image
        src="/images/logo-with-name.png"
        alt="logo"
        width={127}
        height={55.3}
        style={{ cursor: "pointer" }}
      />
      <ListGroup className="d-flex flex-column gap-2">
        <Link href="/profile" className={styles.a}>
          <ListGroupItem
            className={`border-0 d-flex align-items-center gap-2 p-2
              ${router.pathname === "/profile" ? `${styles.active}` : ""}
            `}
            style={{ whiteSpace: "nowrap" }}
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
            <CardText
              className={
                router.pathname === "/profile"
                  ? "white-7-16"
                  : "medium-grey-5-16"
              }
            >
              My profile
            </CardText>
          </ListGroupItem>
        </Link>
        <Link href="/admin" className={styles.a}>
          <ListGroupItem
            className={`border-0 d-flex align-items-center gap-2 p-2
              ${router.pathname === "/admin" ? `${styles.active}` : ""}
            `}
            style={{ whiteSpace: "nowrap" }}
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
            <CardText
              className={
                router.pathname === "/admin" ? "white-7-16" : "medium-grey-5-16"
              }
            >
              Admin
            </CardText>
          </ListGroupItem>
        </Link>
        <Link href="/feed" className={styles.a}>
          <ListGroupItem
            className={`border-0 d-flex align-items-center gap-2 p-2
              ${router.pathname === "/feed" ? `${styles.active}` : ""}
            `}
            style={{ whiteSpace: "nowrap" }}
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
            <CardText
              className={
                router.pathname === "/feed" ? "white-7-16" : "medium-grey-5-16"
              }
            >
              Feeds
            </CardText>
          </ListGroupItem>
        </Link>
        <Link href="/artist" className={styles.a}>
          <ListGroupItem
            className={`border-0 d-flex align-items-center gap-2 p-2
              ${router.pathname === "/artist" ? `${styles.active}` : ""}
            `}
            style={{ whiteSpace: "nowrap" }}
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
            <CardText
              className={
                router.pathname === "/artist"
                  ? "white-7-16"
                  : "medium-grey-5-16"
              }
            >
              Artist
            </CardText>
          </ListGroupItem>
        </Link>
        <Link href="/chat" className={styles.a}>
          <ListGroupItem
            className={`border-0 d-flex align-items-center gap-2 p-2
              ${router.pathname === "/chat" ? `${styles.active}` : ""}
            `}
            style={{ whiteSpace: "nowrap" }}
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
            <CardText
              className={
                router.pathname === "/chat" ? "white-7-16" : "medium-grey-5-16"
              }
            >
              Chat
            </CardText>
          </ListGroupItem>
        </Link>
      </ListGroup>
      <ListGroup className={styles.secondMenu}>
        <ListGroupItem
          className="border-0 d-flex edward-5-14"
          style={{ whiteSpace: "nowrap", color: "#959D99" }}
        >
          <CardText>Top 100</CardText>
          <Image
            src="/images/icons/chart.svg"
            alt="chart"
            width={19}
            height={19}
          />
        </ListGroupItem>
        <ListGroupItem
          className="border-0 edward-5-14"
          style={{ whiteSpace: "nowrap", color: "#959D99" }}
        >
          Rich Brian’s collections
        </ListGroupItem>
        <ListGroupItem
          className="border-0 edward-5-14"
          style={{ whiteSpace: "nowrap", color: "#959D99" }}
        >
          deep focus
        </ListGroupItem>
        <ListGroupItem
          className="border-0 edward-5-14"
          style={{ whiteSpace: "nowrap", color: "#959D99" }}
        >
          Lo-Fi Jazz upbeat
        </ListGroupItem>
        <ListGroupItem
          className="border-0 edward-5-14"
          style={{ whiteSpace: "nowrap", color: "#959D99" }}
        >
          For workplace
        </ListGroupItem>
        <ListGroupItem
          className="border-0 edward-5-14"
          style={{ whiteSpace: "nowrap", color: "#959D99" }}
        >
          Christmas playlist
        </ListGroupItem>
      </ListGroup>
    </aside>
  );
};

export default Sidebar;
