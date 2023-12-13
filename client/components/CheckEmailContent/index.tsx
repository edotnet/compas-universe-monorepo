import { FC, useCallback, useState } from "react";
import LogoContent from "../LogoContent";
import { api } from "@/utils/axios";
import Timer from "../Timer";
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
  setVerifyEmail: (value: boolean) => void;
  setSendEmail: (value: boolean) => void;
  email: string;
}

const CheckEmailContent: FC<IProps> = ({
  setVerifyEmail,
  setSendEmail,
  email,
}): JSX.Element => {
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
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ flexBasis: "50%" }}
    >
      <div
        className="d-flex flex-column justify-content-center gap-3 w-100"
        style={{
          maxWidth: 384,
        }}
      >
        <LogoContent
          heading="Check Email"
          title={`We’ve sent a code to ${email}`}
        />
        <div className="d-flex flex-column align-items-center gap-3">
          <Form
            className="d-flex flex-column gap-3 w-100"
            onSubmit={(e) => handleVerifyEmail(e)}
          >
            <FormGroup>
              <Label className="steel-5-14" for="code">
                Code
              </Label>
              <Input
                id="code"
                type="text"
                invalid={!!error}
                style={{ height: 42 }}
              />
              <FormFeedback style={{ fontSize: 12 }}>{error}</FormFeedback>
            </FormGroup>
            <Timer email={email} setError={setError} />
            <Button color="primary">Verify</Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CheckEmailContent;
