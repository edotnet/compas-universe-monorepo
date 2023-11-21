import { useMemo, ReactNode, createContext } from "react";
import { IUserProfileResponse } from "@/utils/types/user.types";

interface IProps {
  children: ReactNode;
  userProfile: IUserProfileResponse;
}

interface IProfileContextProps {
  userProfile: IUserProfileResponse;
}

export const ProfileContext = createContext<IProfileContextProps>(null!);

export const ProfileProvider = ({ children, userProfile }: IProps) => {
  const value = useMemo(
    () => ({
      userProfile,
    }),
    [userProfile]
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};
