import { FC, ReactNode } from "react";
import { Container } from "reactstrap";
import styles from "./index.module.scss";

interface IProps {
  children: ReactNode[];
}

export const FeedContainer: FC<IProps> = ({ children }): JSX.Element => {
  return (
    <Container className={`${styles.container} d-flex gap-5 pt-4 px-5`}>
      {children[0]}
      {children[1]}
    </Container>
  );
};
