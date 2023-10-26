import { useCallback, useState } from "react";
import LogoContent from "../LogoContent";
import { api } from "@/utils/axios";
import styles from "./index.module.scss";
import { isPasswordInValid } from "@/utils/helpers/password-valid.helper";

interface IProps {
  setResetPassword: (value: boolean) => void;
  setVerifyEmail: (value: boolean) => void;
  email: string;
}

const ChangePasswordContent = ({
  setResetPassword,
  setVerifyEmail,
  email,
}: IProps) => {
  const [error, setError] = useState<string>("");

  const handleResetPassword = useCallback(async (e: any) => {
    e.preventDefault();

    const payload = {
      newPassword: e.target[0].value,
      email,
    };
    const error = isPasswordInValid(e.target[0].value);

    if (!e.target[0].value || error) {
      if (!e.target[0].value) {
        setError("password is required");
        return;
      } else {
        setError(error as string);
        return;
      }
    }

    try {
      await api.post("/auth/reset-password", payload);
      setResetPassword(true);
      setVerifyEmail(false);
    } catch (error: any) {
      setError("Something went wrong");
      if (error?.response?.data.message) {
        setError(
          error.response.data.message
            .split("_")
            .map((str: string) => str.toLowerCase())
            .join(" ")
        );
      }
    }
  }, []);

  return (
    <div className={styles.changePasswordContainer}>
      <div className={styles.changePassword}>
        <LogoContent heading="Change Password" title="Write a new password" />
        <div className={styles.formContainer}>
          <form
            className={styles.form}
            onSubmit={(e) => handleResetPassword(e)}
          >
            <div className={styles.inputContainer}>
              <p>Password</p>
              <input type="password" />
              <p className={styles.error}>{error}</p>
            </div>
            <button type="submit">Confirm</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordContent;
