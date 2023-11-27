import { memo } from "react";
import { Card, CardBody, CardImg, CardSubtitle, CardText } from "reactstrap";
import styles from "./index.module.scss";

interface IProps {
  item: any;
}

const ProfilePlaylistCard = ({ item }: IProps) => (
  <Card className={styles.profilePlaylistCard}>
    <CardImg src={item.thumbnailUrl} />
    <CardBody className={styles.cardBody}>
      <CardText className="text-4f-6-15" style={{ whiteSpace: "nowrap" }}>
        {item.title}
      </CardText>
      <CardSubtitle className="mb-2  text-muted text-6b-4-13" tag="span">
        {item.author}
      </CardSubtitle>
    </CardBody>
  </Card>
);

export default memo(ProfilePlaylistCard);
