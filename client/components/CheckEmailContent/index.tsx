import { useCallback, useState } from "react";
import LogoContent from "../LogoContent";
import styles from "./index.module.scss";
import { api } from "@/utils/axios";
import Timer from "../Timer";
import { errorHelper } from "@/utils/helpers/error.helper";

interface IProps {
  setVerifyEmail: (value: boolean) => void;
  setSendEmail: (value: boolean) => void;
  email: string;
}

const CheckEmailContent = ({ setVerifyEmail, setSendEmail, email }: IProps) => {
  const [error, setError] = useState<string>("");

  const handleVerifyEmail = useCallback(async (e: any) => {
    e.preventDefault();

    const payload = {
      email,
      code: e.target[0].value,
    };

    if (!e.target[0].value) {
      setError("code is required");
    } else {
      try {
        const { data } = await api.post("/auth/verify-email", payload);
        if (data && data.verify) {
          setVerifyEmail(data.verify);
          setSendEmail(false);
        }
        setError("");
      } catch (error: any) {
        setError(errorHelper(error?.response?.data.message));
      }
    }
  }, []);

  return (
    <div className={styles.checkEmailContainer}>
      <div className={styles.checkEmail}>
        <LogoContent
          heading="Check Email"
          title={`We’ve sent a code to ${email}`}
        />
        <div className={styles.formContainer}>
          <form className={styles.form} onSubmit={(e) => handleVerifyEmail(e)}>
            <div className={styles.inputContainer}>
              <p>Code</p>
              <input type="text" />
              <p className={styles.error}>{error}</p>
            </div>
            <Timer email={email} setError={setError} />
            <button type="submit">Verify</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckEmailContent;
