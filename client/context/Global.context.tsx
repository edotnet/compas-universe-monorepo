import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { IExtendedUser } from "@/utils/types/user.types";
import AuthService from "@/services/AuthService";
import { authApi } from "@/utils/axios";

interface IGlobalContextProps {
  me: IExtendedUser;
  setMe: Dispatch<SetStateAction<IExtendedUser>>;
}

interface IProps {
  children: ReactNode;
}

export const GlobalContext = createContext<IGlobalContextProps>(null!);

export const GlobalProvider = ({ children }: IProps) => {
  const [me, setMe] = useState<IExtendedUser>(null!);

  useEffect(() => {
    try {
      (async () => {
        if (AuthService.isAuth()) {
          const { data } = await authApi.get("/users/me");
          if (data) {
            setMe(data);
          }
        }
      })();
    } catch (error) {}
  }, []);

  const value = useMemo(
    () => ({
      me,
      setMe,
    }),
    [me, setMe]
  );

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};
