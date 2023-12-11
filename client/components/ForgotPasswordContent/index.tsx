import { useState } from "react";
import {
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import { api } from "@/utils/axios";
import { errorHelper } from "@/utils/helpers/error.helper";
import LogoContent from "../LogoContent";
import CheckEmailContent from "../CheckEmailContent";
import ChangePasswordContent from "../ChangePasswordContent";
import PasswordChangedContent from "../PasswordChangedContent";
import styles from "./index.module.scss";

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

        setError("");
        setSendEmail(true);
      } catch (error: any) {
        setError(errorHelper(error?.response?.data.message));
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
    <div
      className={`${styles.forgotPasswordContainer} d-flex flex-column align-items-center justify-content-center`}
    >
      <div className="d-flex flex-colum justify-content-between">
        <div className="d-flex flex-column align-items-center gap-3">
          <LogoContent
            heading="Forgot Password"
            title="Don’t worry! It happens. Please enter the email associated with your account."
          />
          <Form
            className="d-flex flex-column gap-3 w-100"
            onSubmit={(e) => handleForgotPassword(e)}
          >
            <FormGroup>
              <Label className="steel-5-14" for="email">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                invalid={!!error}
                className={styles.input}
              />
              <FormFeedback style={{ fontSize: 12 }}>{error}</FormFeedback>
            </FormGroup>
            <Button color="primary">Sign up</Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordContent;
