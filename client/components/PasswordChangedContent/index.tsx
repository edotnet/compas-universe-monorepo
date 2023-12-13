import { NextRouter, useRouter } from "next/router";
import { Button } from "reactstrap";
import LogoContent from "../LogoContent";
import { FC } from "react";

const PasswordChangedContent: FC = (): JSX.Element => {
  const router: NextRouter = useRouter();

  const handleBackToLogin = (): void => {
    router.push("/login");
  };

  return (
    <div
      className=" d-flex flex-column align-items-center justify-content-center"
      style={{ flexBasis: "50%" }}
    >
      <div
        className="d-flex flex-column justify-content-center gap-3 w-100"
        style={{ maxWidth: 384 }}
      >
        <LogoContent
          heading="Password Changed"
          title="Your password has been changed successfully"
          stars="/images/stars.png"
        />
        <Button color="primary" onClick={() => handleBackToLogin()}>
          Back to Login
        </Button>
      </div>
    </div>
  );
};

export default PasswordChangedContent;
