import { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { api } from "@/utils/axios";

interface IProps {
  email: string;
  setError: (value: string) => void
}

const Timer = ({ email, setError }: IProps) => {
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      } else {
        clearInterval(interval);
        (async () => {
          try {
            await api.post("/auth/forgot-password", { email });
          } catch (error) {
            setError("Limit reached")
          }
        })();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [minutes, seconds]);

  return (
    <p className={styles.timer}>
      Send code again{" "}
      <span>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </p>
  );
};

export default Timer;
