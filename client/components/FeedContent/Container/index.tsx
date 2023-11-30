import { ReactNode } from "react";
import { Container } from "reactstrap";
import styles from "./index.module.scss";

interface IProps {
  children: ReactNode[];
}

export const FeedContainer = ({ children }: IProps) => {
  return (
    <Container
      className={`${styles.container} d-flex gap-5 pt-4 px-5`}
      style={{
        background: "linear-gradient(#7D43A417, #2D34DA00, #D5CCFF8C)",
        height: "100vh",
      }}
    >
      {children[0]}
      {children[1]}
    </Container>
  );
};
