import { useRouter } from "next/router";
import WebsiteButtons from "../WebsiteButtons";
import LogoContent from "../LogoContent";
import styles from "./index.module.scss";
import { FormEvent, useCallback, useState } from "react";
import { api } from "@/utils/axios";
import validator from "validator";

const LoginForm = () => {
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    other: "",
  });

  const router = useRouter();
  const moveToPage = (route: string) => {
    router.push(route);
  };

  const handleLogin = useCallback(async (e: any) => {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;
    const rememberMe = e.target[2].checked;

    if (!email || !validator.isEmail(email)) {
      if (!email) {
        setErrors({ ...errors, email: "Email is required" });
      } else {
        setErrors({ ...errors, email: "Invalid email address" });
      }
      return;
    }

    if (!password) {
      setErrors({
        ...errors,
        password: "Password is required",
      });
      return;
    }

    setErrors({
      email: "",
      password: "",
      other: "",
    });

    const payload = {
      email,
      password,
      rememberMe,
    };

    try {
      const { data } = await api.post("/auth/login", payload);
      router.push(data);
    } catch (error: any) {
      setErrors({ ...errors, other: "Something went wrong" });
      if (error?.response?.data?.message) {
        setErrors({ ...errors, other: "Either password or email is wrong" });
      }
    }
  }, []);

  return (
    <div className={styles.loginFormContainer}>
      <div className={styles.loginForm}>
        <LogoContent heading="Login to your account" />
        <div className={styles.formContainer}>
          <div className={styles.buttonsContainer}>
            <p>log in with</p>
            <WebsiteButtons />
          </div>
          <div className={styles.continueWith}>
            <div className={styles.line}></div>
            <p>Or continue with</p>
            <div className={styles.line}></div>
          </div>
          <form
            className={styles.form}
            onSubmit={(e: FormEvent<HTMLFormElement>) => handleLogin(e)}
          >
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
            <div className={styles.checkboxContainer}>
              <div>
                <input type="checkbox" />
                <p>Remember me</p>
              </div>
              <p onClick={() => moveToPage("/forgot-password")}>
                Forgot your password?
              </p>
            </div>
            <button type="submit">Log in</button>
          </form>
          <p>
            Don't have an account?{" "}
            <span onClick={() => moveToPage("/register")}>Create</span>
          </p>
          <p className={styles.error}>{errors.other}</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
