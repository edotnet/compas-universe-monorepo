import { CSSProperties, MouseEventHandler } from "react";
import { Button } from "reactstrap";

interface IIConProps {
  size: number;
  src: string;
}

interface IProps {
  icons: IIConProps[];
  styles?: CSSProperties;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const GenerateIcons = ({ icons, styles, onClick }: IProps) => {
  return (
    <div className="d-flex align-items-center" style={styles}>
      {icons.map(({ size, src }: IIConProps, index) => (
        <Button
          key={index + src}
          color="transparent"
          className="border-0"
          type="button"
          onClick={onClick}
        >
          <picture>
            <img src={src} alt="icon" width={size} height={size} />
          </picture>
        </Button>
      ))}
    </div>
  );
};

export default GenerateIcons;
