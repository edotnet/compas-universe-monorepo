import { useCallback, useState } from "react";
import LogoContent from "../LogoContent";
import styles from "./index.module.scss";
import { api } from "@/utils/axios";
import CheckEmailContent from "../CheckEmailContent";
import ChangePasswordContent from "../ChangePasswordContent";
import PasswordChangedContent from "../PasswordChangedContent";

const ForgotPasswordContent = () => {
  const [error, setError] = useState<string>("");
  const [sendEmail, setSendEmail] = useState<boolean>(false);
  const [verifyEmail, setVerifyEmail] = useState<boolean>(false);
  const [resetPassword, setResetPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  const handleForgotPassword = async (e: any) => {
    e.preventDefault();

    const payload = {
      email: e.target[0].value,
    };

    if (!e.target[0].value) {
      setError("email is required");
    } else {
      setEmail(e.target[0].value);

      try {
        await api.post("/auth/forgot-password", payload);
        console.log(sendEmail, "1q1111111111111111111111111");

        setError("");
        setSendEmail(true);
        console.log(sendEmail, "222222222222222222222222");
      } catch (error: any) {
        setError("Something went wrong");
        if (typeof error?.response?.data.message === "string") {
          setError(
            error.response.data.message
              .split("_")
              .map((str: string) => str.toLowerCase())
              .join(" ")
          );
        }
      }
    }
  };

  return sendEmail ? (
    <CheckEmailContent
      setVerifyEmail={setVerifyEmail}
      setSendEmail={setSendEmail}
      email={email}
    />
  ) : verifyEmail && !sendEmail ? (
    <ChangePasswordContent
      setResetPassword={setResetPassword}
      setVerifyEmail={setVerifyEmail}
      email={email}
    />
  ) : resetPassword && !verifyEmail && !sendEmail ? (
    <PasswordChangedContent />
  ) : (
    <div className={styles.forgotPasswordContainer}>
      <div className={styles.forgotPassword}>
        <div className={styles.formContainer}>
          <LogoContent
            heading="Forgot Password"
            title="Don’t worry! It happens. Please enter the email associated with your account."
          />
          <form
            className={styles.form}
            onSubmit={(e) => handleForgotPassword(e)}
          >
            <div className={styles.inputContainer}>
              <p>Email address</p>
              <input type="email" placeholder="you@example.com" />
              <p className={styles.error}>{error}</p>
            </div>
            <button type="submit">Sign up</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordContent;
