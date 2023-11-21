import { ReactElement } from "react";
import styles from "./index.module.scss";

interface IProps {
  component: ReactElement;
  register?: boolean;
}

const LoginPagesWrapper = ({ component, register }: IProps) => (
  <div className={styles.wrapper}>
    <div className={styles.imgContainer}>
      <div className={register ? styles.register : styles.login}></div>
    </div>
    {component}
  </div>
);

export default LoginPagesWrapper;
