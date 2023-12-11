import { ReactElement } from "react";
import styles from "./index.module.scss";

interface IProps {
  component: ReactElement;
  register?: boolean;
}

const LoginPagesWrapper = ({ component, register }: IProps) => (
  <div className={`${styles.wrapper} d-flex`}>
    <div className={styles.imgContainer}>
      <div className={`${register ? styles.register : styles.login} h-100`}>
        <h1 className="white-9-40">Welcome to Compas Universe</h1>
        <p className="white-3-24">Listen, dance and connect with friends </p>
      </div>
    </div>
    {component}
  </div>
);

export default LoginPagesWrapper;
