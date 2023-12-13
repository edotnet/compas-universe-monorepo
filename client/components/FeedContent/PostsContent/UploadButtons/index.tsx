import { Input } from "reactstrap";
import {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";
import GenerateIcons from "@/components/ChatContent/GenerateIcons";
import { FeedContext } from "@/context/Feed.context";
import FileService from "@/services/FileService";
import { authApi } from "@/utils/axios";
import {
  image_accept_mime_types,
  video_accept_mime_types,
} from "@/utils/constants/file.constant";
import { FileTypes } from "@/utils/types/enums/file.enum";
import { IUploadedFile } from "@/utils/types/files.types";
import { errorHelper } from "@/utils/helpers/error.helper";

interface IProps {
  error: string;
  setError: Dispatch<SetStateAction<string>>;
  openEmojis: boolean;
  setOpenEmojis: Dispatch<SetStateAction<boolean>>;
}

const UploadButtons: FC<IProps> = ({
  error,
  setError,
  openEmojis,
  setOpenEmojis,
}): JSX.Element => {
  const [invalidFile, setInvalidFile] = useState<boolean>(false);

  const { setUploadedFiles } = useContext(FeedContext);

  const imgRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const resetInput: Record<FileTypes, string | null> = {
    [FileTypes.VIDEO]: imgRef.current && (imgRef.current.value = ""),
    [FileTypes.PHOTO]: videoRef.current && (videoRef.current.value = ""),
  };

  const handleFileUpload = async (
    files: FileList,
    type: FileTypes
  ): Promise<void> => {
    resetInput[type];

    const cancel: boolean = !files || files.length === 0;
    if (cancel) return;

    const filesArray: File[] = Object.values(files);
    const fileSize: number = filesArray.reduce(
      (acc: number, file: File) => acc + file.size,
      0
    );

    const isValidFileSize: boolean = FileService.isValidFileSize(fileSize);
    setInvalidFile(isValidFileSize);

    const formData = new FormData();
    filesArray.forEach((file: File) => {
      formData.append("files", file);
      formData.append("type", type);
    });

    try {
      const { data }: { data: IUploadedFile[] } = await authApi.post(
        "/storage/upload",
        formData
      );
      setUploadedFiles(data);
      setError("");
    } catch (error: any) {
      setError(errorHelper(error?.message));
    }
  };

  return (
    <div className="d-flex align-items-center">
      <div className="position-relative">
        <GenerateIcons
          icons={[{ size: 24, src: "/images/icons/gallery.svg" }]}
        />

        <Input
          className="d-flex position-absolute border-0"
          style={{
            opacity: 0,
            width: 23,
            height: 23,
            left: 10,
            top: 8,
          }}
          type="file"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleFileUpload(e.target.files!, FileTypes.PHOTO)
          }
          invalid={invalidFile}
          accept={FileService.getAcceptTypes(image_accept_mime_types)}
          multiple
          innerRef={imgRef}
        />
      </div>
      <div className="position-relative">
        <GenerateIcons icons={[{ size: 24, src: "/images/icons/gif.svg" }]} />

        <Input
          className="d-flex position-absolute border-0"
          style={{
            opacity: 0,
            width: 23,
            height: 23,
            left: 10,
            top: 8,
          }}
          type="file"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleFileUpload(e.target.files!, FileTypes.VIDEO)
          }
          invalid={invalidFile}
          accept={FileService.getAcceptTypes(video_accept_mime_types)}
          innerRef={videoRef}
        />
      </div>
      <GenerateIcons
        icons={[{ size: 24, src: "/images/icons/smile-feed.svg" }]}
        onClick={() => setOpenEmojis(!openEmojis)}
      />
    </div>
  );
};

export default UploadButtons;
