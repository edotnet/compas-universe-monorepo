import Sidebar from "@/components/Sidebar";
import styles from "./index.module.scss";

export interface ILayout {
  children: JSX.Element | JSX.Element[];
}

const MainLayout = ({ children }: ILayout) => (
  <div className={styles.mainLayout}>
    <Sidebar />
    {children}
  </div>
);

export default MainLayout;
