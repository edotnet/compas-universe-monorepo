import { IUploadedFile } from "@/utils/types/files.types";
import { IPostExtended } from "@/utils/types/posts.types";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface IProps {
  children: ReactNode;
}

interface IFeedContextProps {
  uploadedFiles: IUploadedFile[];
  setUploadedFiles: Dispatch<SetStateAction<IUploadedFile[]>>;
  posts: IPostExtended[];
  setPosts: Dispatch<SetStateAction<IPostExtended[]>>;
}

export const FeedContext = createContext<IFeedContextProps>(null!);

export const FeedProvider = ({ children }: IProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<IUploadedFile[]>([]);
  const [posts, setPosts] = useState<IPostExtended[]>([]);

  const value = useMemo(
    () => ({ uploadedFiles, setUploadedFiles, posts, setPosts }),
    [uploadedFiles, setUploadedFiles, posts, setPosts]
  );

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
};
