import AuthService from "@/services/AuthService";
import { authApi } from "@/utils/axios";
import { IExtendedUser } from "@/utils/types/user.types";
import { ReactNode, createContext, useEffect, useMemo, useState } from "react";

interface IProps {
  children: ReactNode;
}

interface IGlobalContextProps {
  me: IExtendedUser;
}

export const GlobalContext = createContext<IGlobalContextProps>(null!);

export const GlobalProvider = ({ children }: IProps) => {
  const [me, setMe] = useState<IExtendedUser>(null!);

  useEffect(() => {
    try {
      (async () => {
        const { data } = await authApi.get("/users/me");
        if (data) {
          setMe(data);
        }
      })();
    } catch (error) {}
  }, []);

  const value = useMemo(
    () => ({
      me,
    }),
    [me]
  );

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};
