import {
  ChangeEvent,
  Dispatch,
  FC,
  FormEvent,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";
import {
  Button,
  Card,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { GlobalContext } from "@/context/Global.context";
import GenerateIcons from "@/components/ChatContent/GenerateIcons";
import ProfilePicture from "@/components/ProfileContent/ProfilePicture";
import {
  image_accept_mime_types,
  video_accept_mime_types,
} from "@/utils/constants/file.constant";
import FileService from "@/services/FileService";
import { FileTypes } from "@/utils/types/enums/file.enum";
import { authApi } from "@/utils/axios";
import { IUploadedFile } from "@/utils/types/files.types";
import { FeedContext } from "@/context/Feed.context";
import { IContent, IPost, IPostExtended } from "@/utils/types/posts.types";
import { errorHelper } from "@/utils/helpers/error.helper";
import "./index.module.scss";
import UploadButtons from "../UploadButtons";

interface IProps {
  setSkip: Dispatch<SetStateAction<number>>;
}

const CreatePost: FC<IProps> = ({ setSkip }): JSX.Element => {
  const [openEmojis, setOpenEmojis] = useState<boolean>(false);
  const [emojis, setEmojis] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  const { me } = useContext(GlobalContext);
  const { uploadedFiles, setUploadedFiles, setPosts } = useContext(FeedContext);

  const handlePostCreate = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const target = e.target as HTMLFormElement;
    const input = target[0] as HTMLInputElement;

    if (!uploadedFiles.length && !input.value) {
      return;
    }

    const payload: IContent = {};
    if (input.value) {
      payload.description = input.value;
    }

    if (uploadedFiles.length) {
      payload.media = uploadedFiles;
    }

    try {
      input.value = "";
      const { data }: { data: IPost } = await authApi.post("/feed", payload);

      setSkip((prev) => prev + 1);
      setPosts((prev) => [
        {
          ...data,
          commentsCount: 0,
          likesCount: 0,
          liked: false,
          lastComment: null!,
        },
        ...prev,
      ]);
      setUploadedFiles([]);
      setEmojis([]);
      setError("");
    } catch (error: any) {
      setError(errorHelper(error?.response?.data.message));
    }
  };

  return (
    <Card className="position-relative">
      <Form
        className="bg-white p-2"
        style={{ borderRadius: 10 }}
        onSubmit={handlePostCreate}
      >
        <FormGroup>
          <InputGroup>
            <InputGroupText className="border-0 bg-transparent">
              <ProfilePicture
                src={me?.profilePicture}
                width={40}
                height={40}
                borderRadius="50%"
              />
            </InputGroupText>
            <Input
              className="border-0"
              placeholder="What’s Happening?"
              type="text"
              invalid={!!error}
            />
          </InputGroup>
        </FormGroup>
        <div className="d-flex align-items-center gap-3">
          {!!uploadedFiles.length &&
            uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="p-2"
                style={{ border: "1px solid black" }}
              >
                {file.type !== FileTypes.VIDEO ? (
                  <picture>
                    <img
                      src={file.meta.src}
                      alt="preview"
                      style={{ objectFit: "cover" }}
                      height={80}
                      width={80}
                    />
                  </picture>
                ) : (
                  <video
                    src={file.meta.src}
                    controls
                    width={100}
                    height={100}
                    style={{ objectFit: "cover" }}
                  />
                )}
              </div>
            ))}
        </div>

        <div className="d-flex align-items-center justify-content-between">
          <UploadButtons
            error={error}
            setError={setError}
            openEmojis={openEmojis}
            setOpenEmojis={setOpenEmojis}
          />
          <p className="crimson-4-13">{error}</p>
          <Button color="primary">Post</Button>
        </div>
      </Form>
      {openEmojis && (
        <div
          className="position-absolute z-1"
          style={{ top: "calc(100% + 5px)" }}
        >
          <Picker
            data={data}
            onEmojiSelect={(emoji: { native: string }) =>
              setEmojis((prev) => [...prev, emoji.native])
            }
          />
        </div>
      )}
    </Card>
  );
};

export default CreatePost;
