import { FC } from "react";

const PlaylistContent: FC = (): JSX.Element => {
  return (
    <div>
      <p
        className="charcoal-6-23"
        style={{ wordBreak: "break-word", width: 100 }}
      >
        Recently Played
      </p>
      {/* <Card className="h-100"></Card> */}
    </div>
  );
};

export default PlaylistContent;
