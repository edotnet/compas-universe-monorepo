import { ReactNode, useCallback, useState } from "react";

export interface IHocProps {
  isShow: boolean;
  isShowHandler: () => void;
}

export const withLessMore = <P extends {}>(
  Component: React.FC<P>
): React.FC<P> => {
  return (props: P): ReactNode => {
    const [isShow, setIsShow] = useState(false);

    const isShowHandler = useCallback(() => {
      setIsShow(!isShow);
    }, [isShow]);

    return (
      <Component isShow={isShow} isShowHandler={isShowHandler} {...props} />
    );
  };
};