import { FC, useContext, useState } from "react";
import Image from "next/image";
import { NextRouter, useRouter } from "next/router";
import {
  Button,
  CardText,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import AuthService from "@/services/AuthService";
import { GlobalContext } from "@/context/Global.context";
import ProfilePicture from "../ProfilePicture";
import styles from "./index.module.scss";

const ProfileInfo: FC = (): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);

  const router: NextRouter = useRouter();

  const { me } = useContext(GlobalContext);

  const handleLogout = async (): Promise<void> => {
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
      <div className="d-flex justify-content-between w-100">
        <div className="d-flex align-items-center gap-5">
          <ProfilePicture
            src={me?.profilePicture}
            width={247}
            height={186}
            borderRadius="12px"
          />
          <div className="d-flex flex-column">
            <CardText className="charcoal-6-36">{me?.userName}</CardText>
            <CardText className="grey-4-20" style={{ marginBottom: 5 }}>
              {me?.type}
            </CardText>
            <div className="d-flex align-items-center gap-2">
              <Button
                className={styles.mangeProfileBtn}
                style={{
                  padding: "11px 15px",
                  boxShadow: "0px 4.7px 8.5px 0px #D737FF33",
                }}
                color="primary"
              >
                Manage profile
              </Button>
              <UncontrolledDropdown className="me-2" direction="end">
                <DropdownToggle
                  style={{
                    border: "1px solid #AFB6B3",
                    padding: "10px 14px",
                    boxShadow: "0px 4.7px 8.5px 0px #D737FF33",
                  }}
                  color="transparent"
                  className={styles.dots}
                >
                  <picture>
                    <img
                      src={"/images/icons/dots.svg"}
                      alt="dots"
                      width={22}
                      height={22}
                    />
                  </picture>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem header>Header</DropdownItem>
                  <DropdownItem disabled>Action</DropdownItem>
                  <DropdownItem>Another Action</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>Another Action</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </div>
        </div>
        <Button
          outline
          color="primary"
          className={styles.logout}
          onClick={() => handleLogout()}
          size="sm"
        >
          Log out
        </Button>
        <Image src="/images/icons/bell.svg" alt="bell" width={54} height={50} />
      </div>
    </>
  );
};

export default ProfileInfo;
