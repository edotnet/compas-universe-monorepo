import { useState, useEffect, FC } from "react";
import { api } from "@/utils/axios";
import { errorHelper } from "@/utils/helpers/error.helper";

interface IProps {
  email: string;
  setError: (value: string) => void;
}

const Timer: FC<IProps> = ({ email, setError }): JSX.Element => {
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [codeSent, setCodeSent] = useState(false);

  useEffect(() => {
    const interval: NodeJS.Timeout = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      } else if (!codeSent) {
        clearInterval(interval);
        (async () => {
          try {
            await api.post("/auth/forgot-password", { email });
          } catch (error: any) {
            setError(errorHelper(error?.response?.data.message));
          }

          setCodeSent(true);
        })();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [minutes, seconds, codeSent]);

  return codeSent ? (
    <p className="steel-6-16">Code sent</p>
  ) : (
    <p className="black70-6-16">
      Send code again{" "}
      <span style={{ fontWeight: 400 }}>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </p>
  );
};

export default Timer;
