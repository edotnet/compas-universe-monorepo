import { memo } from "react";
import { Card, CardBody, CardSubtitle, CardText } from "reactstrap";
import styles from "./index.module.scss";

interface IProps {
  item: any;
}

const ProfilePlaylistCard = ({ item }: IProps) => (
  <Card className={styles.profilePlaylistCard}>
    <picture>
      <img src={item.thumbnailUrl} alt="song" />
    </picture>
    <CardBody className={styles.cardBody}>
      <CardText>{item.title}</CardText>
      <CardSubtitle className="mb-2 text-muted" tag="span">
        {item.author}
      </CardSubtitle>
    </CardBody>
  </Card>
);

export default memo(ProfilePlaylistCard);
