import { CSSProperties } from "react";
import { Button } from "reactstrap";

interface IIConProps {
  size: number;
  src: string;
}

interface IProps {
  icons: IIConProps[];
  styles?: CSSProperties;
}

const GenerateIcons = ({ icons, styles }: IProps) => {
  return (
    <div className="d-flex align-items-center" style={styles}>
      {icons.map(({ size, src }: IIConProps, index) => (
        <Button key={index} color="transparent" className="border-0">
          <picture>
            <img src={src} alt="icon" width={size} height={size} />
          </picture>
        </Button>
      ))}
    </div>
  );
};

export default GenerateIcons;
