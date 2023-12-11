import { FormEvent, useCallback, useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/utils/axios";
import validator from "validator";
import LogoContent from "../LogoContent";
import WebsiteButtons from "../WebsiteButtons";
import {
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import styles from "./index.module.scss";

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
    <div
      className={`${styles.loginFormContainer} d-flex flex-column align-items-center justify-content-center`}
    >
      <div className="d-flex flex-column justify-content-center gap-3">
        <LogoContent heading="Login to your account" />
        <div className="d-flex flex-column align-items-center gap-4">
          <div className="d-flex align-items-center justify-content-between w-100">
            <div className={styles.line}></div>
            <p className="grayish-blue-4-14">Or continue with</p>
            <div className={styles.line}></div>
          </div>
          <div className="d-flex flex-column gap-2 w-100">
            <p className="navy-5-14">Log in with</p>
            <WebsiteButtons />
          </div>
          <Form
            className="d-flex flex-column gap-3 w-100"
            onSubmit={(e: FormEvent<HTMLFormElement>) => handleLogin(e)}
          >
            <FormGroup>
              <Label className="steel-5-14" for="email">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                invalid={!!errors.email}
                className={styles.input}
              />
              <FormFeedback style={{ fontSize: 12 }}>
                {errors.email}
              </FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label className="steel-5-14" for="password">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                invalid={!!errors.password}
                className={styles.input}
              />
              <FormFeedback style={{ fontSize: 12 }}>
                {errors.password}
              </FormFeedback>
            </FormGroup>
            <div className="d-flex justify-content-between align-items-center w-100">
              <FormGroup check inline>
                <Input type="checkbox" />
                <Label className="navy-4-14" check>
                  Remember me
                </Label>
              </FormGroup>
              <p
                className="primary-5-14"
                style={{ cursor: "pointer" }}
                onClick={() => moveToPage("/forgot-password")}
              >
                Forgot your password?
              </p>
            </div>
            <Button color="primary">Log in</Button>
          </Form>
          <p className="navy-4-14">
            Don't have an account?{" "}
            <span
              className="primary-4-14"
              style={{ cursor: "pointer" }}
              onClick={() => moveToPage("/register")}
            >
              Create
            </span>
          </p>
          <p className="crimson-4-13">{errors.other}</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
