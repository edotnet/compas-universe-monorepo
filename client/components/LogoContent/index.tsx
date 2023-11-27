import Image from "next/image";
import styles from "./index.module.scss";

interface IProps {
  heading: string;
  title?: string;
  stars?: string;
}

const LogoContent = ({ heading, title, stars }: IProps) => {
  return (
    <div className={styles.logoContent}>
      <Image src="/images/logo.png" alt="logo" width={51} height={65.71} />
      {stars && <Image src={stars} alt="stars" width={90.85} height={84} />}
      <p>{heading}</p>
      {title && <p>{title}</p>}
    </div>
  );
};

export default LogoContent;
