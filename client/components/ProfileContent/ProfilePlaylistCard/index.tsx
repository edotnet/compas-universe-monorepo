import { FC, memo } from "react";
import { Card, CardBody, CardImg, CardSubtitle, CardText } from "reactstrap";

interface IProps {
  item: any;
}

const ProfilePlaylistCard: FC<IProps> = ({ item }) => (
  <Card className="border-0 bg-transparent gap-2" style={{ minWidth: "auto" }}>
    <CardImg src={item.thumbnailUrl} />
    <CardBody className="p-0">
      <CardText className="light-grey-6-15" style={{ whiteSpace: "nowrap" }}>
        {item.title}
      </CardText>
      <CardSubtitle className="mb-2  text-muted grayish-blue-4-13" tag="span">
        {item.author}
      </CardSubtitle>
    </CardBody>
  </Card>
);

export default memo(ProfilePlaylistCard);
