import { authApi } from "@/utils/axios";
import { IExtendedUser } from "@/utils/types/user.types";
import { ReactNode, createContext, useEffect, useMemo, useState } from "react";

interface IProps {
  children: ReactNode;
}

interface IGlobalContextProps {
  me: IExtendedUser | undefined;
}

export const GlobalContext = createContext<IGlobalContextProps | undefined>(undefined);

export const GlobalProvider = ({ children }: IProps) => {
  const [me, setMe] = useState<IExtendedUser>();

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
