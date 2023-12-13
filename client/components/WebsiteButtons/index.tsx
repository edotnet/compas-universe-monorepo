import Image from "next/image";
import { NextRouter, useRouter } from "next/router";
import { apiUrl } from "@/utils/paths";
import styles from "./index.module.scss";
import { FC } from "react";

const WebsiteButtons: FC = (): JSX.Element => {
  const router: NextRouter = useRouter();

  const handleLogin = (path: string): void => {
    router.push(apiUrl(path));
  };

  return (
    <div className={styles.buttons}>
      <button>
        <Image
          src="/images/icons/facebook.svg"
          alt="facebook"
          width={22}
          height={22}
        />
      </button>
      <button onClick={() => handleLogin("/auth/google")}>
        <Image
          src="/images/icons/google.svg"
          alt="google"
          width={22}
          height={22}
        />
      </button>
      <button>
        <Image
          src="/images/icons/apple.svg"
          alt="apple"
          width={22}
          height={22}
        />
      </button>
    </div>
  );
};

export default WebsiteButtons;
