import { useRouter } from "next/router";
import LogoContent from "../LogoContent";
import styles from "./index.module.scss";

const PasswordChangedContent = () => {
  const router = useRouter();

  const handleBackToLogin = () => {
    router.push("/login");
  };

  return (
    <div className={styles.passwordChangedContainer}>
      <div className={styles.passwordChanged}>
        <LogoContent
          heading="Password Changed"
          title="Your password has been changed succesfully"
          stars="/images/stars.png"
        />
        <button
          className={styles.backToLogin}
          onClick={() => handleBackToLogin()}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default PasswordChangedContent;
