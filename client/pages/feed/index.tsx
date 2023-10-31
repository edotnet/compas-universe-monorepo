import LogoContent from "@/components/LogoContent";
import styles from "./index.module.scss";
import MainLayout from "@/layouts/MainLayout";
import withAuth from "@/HOC/withAuth";

const Feed = () => {
  return (
    <MainLayout>
      <div className={styles.feed}>
        <LogoContent heading="Feed" />
      </div>
    </MainLayout>
  );
};

export default withAuth(Feed);
