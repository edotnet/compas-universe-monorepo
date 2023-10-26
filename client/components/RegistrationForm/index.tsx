import { useRouter } from "next/router";
import WebsiteButtons from "../WebsiteButtons";
import LogoContent from "../LogoContent";
import styles from "./index.module.scss";
import { useCallback, useState } from "react";
import { api } from "@/utils/axios";
import validator from "validator";
import { isPasswordInValid } from "@/utils/helpers/password-valid.helper";

const RegistrationForm = () => {
  const [errors, setErrors] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    other: "",
  });

  const router = useRouter();
  const moveToPage = (route: string) => {
    router.push(route);
  };

  const handleRegister = useCallback(
    async (e: any) => {
      e.preventDefault();

      const userName = e.target[0].value;
      const email = e.target[1].value;
      const password = e.target[2].value;
      const confirmPassword = e.target[3].value;
      const rememberMe = e.target[4].checked;

      if (!userName) {
        setErrors({ ...errors, userName: "User Name is required" });
        return;
      }

      if (!email || !validator.isEmail(email)) {
        setErrors({ ...errors, email: "Invalid email address" });
        return;
      }
      const error = isPasswordInValid(password);

      if (!password || error) {
        if (!password) {
          setErrors({
            ...errors,
            password: "Password is not valid",
          });
          return
        } else {
          setErrors({
            ...errors,
            password: error as string,
          });
        }
        return;
      }

      if (password !== confirmPassword) {
        setErrors({ ...errors, confirmPassword: "Passwords do not match" });
        return;
      }

      setErrors({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        other: "",
      });

      const payload = {
        userName,
        email,
        password,
        confirmPassword,
        rememberMe,
      };

      try {
        const { data } = await api.post("/auth/register", payload);
        if (data) {
          router.push("/login");
        }
      } catch (error: any) {
        setErrors({ ...errors, other: "Something went wrong" });
        if (error?.response?.data?.message) {
          setErrors({ ...errors, email: "Email already exists" });
        }
      }
    },
    [errors]
  );

  return (
    <div className={styles.registrationFormContainer}>
      <div className={styles.registrationForm}>
        <LogoContent heading="Create account" />
        <div className={styles.formContainer}>
          <div className={styles.buttonsContainer}>
            <p>sign up with</p>
            <WebsiteButtons />
          </div>
          <form className={styles.form} onSubmit={(e) => handleRegister(e)}>
            <div className={styles.inputContainer}>
              <p>User Name</p>
              <input type="text" placeholder="adamwathan" />
              <p className={styles.error}>{errors.userName}</p>
            </div>
            <div className={styles.inputContainer}>
              <p>Email address</p>
              <input type="email" placeholder="you@example.com" />
              <p className={styles.error}>{errors.email}</p>
            </div>
            <div className={styles.inputContainer}>
              <p>Password</p>
              <input type="password" />
              <p className={styles.error}>{errors.password}</p>
            </div>
            <div className={styles.inputContainer}>
              <p>Confirm Password</p>
              <input type="password" />
              <p className={styles.error}>{errors.confirmPassword}</p>
            </div>
            <div className={styles.checkboxContainer}>
              <div>
                <input type="checkbox" />
                <p>Remember me</p>
              </div>
              <p onClick={() => moveToPage("/forgot-password")}>
                Forgot your password?
              </p>
            </div>
            <button type="submit">Create Account</button>
          </form>
          <p>
            Already have an account?{" "}
            <span onClick={() => moveToPage("/login")}>Login</span>
          </p>
          <p className={styles.error}>{errors.other}</p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
