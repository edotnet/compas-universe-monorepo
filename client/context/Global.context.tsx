import { createContext } from "react";
import { IExtendedUser } from "@/utils/types/user.types";

interface IGlobalContextProps {
  me: IExtendedUser;
}

export const GlobalContext = createContext<IGlobalContextProps>(null!);
