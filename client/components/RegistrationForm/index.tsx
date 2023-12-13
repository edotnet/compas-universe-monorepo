import { FC, FormEvent, useCallback, useState } from "react";
import { NextRouter, useRouter } from "next/router";
import {
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import { api } from "@/utils/axios";
import validator from "validator";
import { isPasswordInValid } from "@/utils/helpers/password-valid.helper";
import { errorHelper } from "@/utils/helpers/error.helper";
import LogoContent from "../LogoContent";
import WebsiteButtons from "../WebsiteButtons";
import styles from "./index.module.scss";

const RegistrationForm: FC = (): JSX.Element => {
  const [errors, setErrors] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    other: "",
  });

  const router: NextRouter = useRouter();
  const moveToPage = (route: string): void => {
    router.push(route);
  };

  const handleRegister = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const target = e.target as HTMLFormElement;

      const userName = (target[0] as HTMLInputElement).value;
      const email = (target[1] as HTMLInputElement).value;
      const password = (target[2] as HTMLInputElement).value;
      const rememberMe = (target[3] as HTMLInputElement).checked;
      const confirmPassword = (target[4] as HTMLInputElement).value;

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
            password: "Password is required",
          });
          return;
        } else {
          setErrors({
            ...errors,
            password: error as string,
          });
        }
        return;
      }

      if (!confirmPassword) {
        setErrors({
          ...errors,
          confirmPassword: "Confirm Password is required",
        });
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
        setErrors({
          ...errors,
          email: errorHelper(error?.response?.data?.message),
        });
      }
    },
    [errors]
  );

  return (
    <div
      className={`${styles.registrationFormContainer} d-flex flex-column align-items-center justify-content-center`}
    >
      <div
        className={`${styles.registrationForm} d-flex flex-column justify-content-center gap-3`}
      >
        <LogoContent heading="Create account" />
        <div className="d-flex flex-column justify-content-center align-items-center gap-3">
          <div className="d-flex flex-column gap-2 w-100">
            <p className="navy-5-14">Sign up with</p>
            <WebsiteButtons />
          </div>
          <Form
            className="d-flex flex-column gap-3 w-100"
            onSubmit={(e: FormEvent<HTMLFormElement>) => handleRegister(e)}
          >
            <FormGroup>
              <Label className="steel-5-14" for="text">
                User Name
              </Label>
              <Input
                id="text"
                type="text"
                placeholder="adamwathan"
                invalid={!!errors.userName}
                className={styles.input}
              />
              <FormFeedback style={{ fontSize: 12 }}>
                {errors.userName}
              </FormFeedback>
            </FormGroup>
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
            <FormGroup>
              <Label className="steel-5-14" for="confirm-password">
                Confirm Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                invalid={!!errors.confirmPassword}
                className={styles.input}
              />
              <FormFeedback style={{ fontSize: 12 }}>
                {errors.confirmPassword}
              </FormFeedback>
            </FormGroup>
            <FormGroup check inline>
              <Input type="checkbox" />
              <Label className="navy-4-14" check>
                Remember me
              </Label>
            </FormGroup>
            <Button color="primary">Create Account</Button>
          </Form>
          <p className="navy-4-14">
            Already have an account?{" "}
            <span
              className="primary-4-14"
              style={{ cursor: "pointer" }}
              onClick={() => moveToPage("/login")}
            >
              Login
            </span>
          </p>
          <p className="crimson-4-13">{errors.other}</p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
