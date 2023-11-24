import Sidebar from "@/components/Sidebar";
import styles from "./index.module.scss";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export interface ILayout {
  children: JSX.Element | JSX.Element[];
}

const MainLayout = ({ children }: ILayout) => (
  <div className={`${styles.mainLayout} d-flex`}>
    {/* <LanguageSwitcher /> */}
    <Sidebar />
    {children}
  </div>
);

export default MainLayout;
