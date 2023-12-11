import { FormEvent, useCallback, useState } from "react";
import LogoContent from "../LogoContent";
import { api } from "@/utils/axios";
import { isPasswordInValid } from "@/utils/helpers/password-valid.helper";
import { errorHelper } from "@/utils/helpers/error.helper";
import {
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

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

  const handleResetPassword = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const target = e.target as HTMLFormElement;
      const input = target[0] as HTMLInputElement;

      const payload = {
        newPassword: input.value,
        email,
      };
      const error = isPasswordInValid(input.value);

      if (!input.value || error) {
        if (!input.value) {
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
        setError(errorHelper(error?.response?.data.message));
      }
    },
    []
  );

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ flexBasis: "50%" }}
    >
      <div
        className="d-flex flex-column justify-content-center gap-3 w-100"
        style={{ maxWidth: 384 }}
      >
        <LogoContent heading="Change Password" title="Write a new password" />
        <div className="d-flex flex-column justify-content-center gap-3">
          <Form
            className="d-flex flex-column gap-3 w-100"
            onSubmit={(e) => handleResetPassword(e)}
          >
            <FormGroup>
              <Label className="steel-5-14" for="password">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                invalid={!!error}
                style={{ height: 42 }}
              />
              <FormFeedback style={{ fontSize: 12 }}>{error}</FormFeedback>
            </FormGroup>
            <Button color="primary">Confirm</Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordContent;
