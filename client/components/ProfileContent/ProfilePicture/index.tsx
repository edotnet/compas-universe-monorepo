import { CSSProperties, MouseEventHandler } from "react";

interface IProps {
  src: string;
  width: number;
  height: number;
  borderRadius: string;
  onClick?: MouseEventHandler<HTMLImageElement>;
  styles?: CSSProperties;
}

const ProfilePicture = ({
  src,
  width,
  height,
  borderRadius,
  onClick,
  styles,
}: IProps) => {
  return (
    <picture>
      <img
        src={src || "/images/no-profile-picture.jpeg"}
        alt="profile"
        width={width}
        height={height}
        style={{ borderRadius, ...styles, objectFit: 'cover' }}
        onClick={onClick}
      />
    </picture>
  );
};

export default ProfilePicture;
