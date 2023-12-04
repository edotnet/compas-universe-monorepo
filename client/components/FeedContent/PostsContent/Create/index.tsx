import { ChangeEvent, FormEvent, useContext, useState } from "react";
import {
  Button,
  Card,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
} from "reactstrap";
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
import { IContent, IPost } from "@/utils/types/posts.types";
import { errorHelper } from "@/utils/helpers/error.helper";

const CreatePost = () => {
  const [invalidFile, setInvalidFile] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { me } = useContext(GlobalContext);
  const { uploadedFiles, setUploadedFiles, setPosts } = useContext(FeedContext);

  const handleFileUpload = async (files: FileList, type: FileTypes) => {
    const cancel = !files || files.length === 0;
    if (cancel) return;

    const filesArray = Object.values(files);
    const fileSize = filesArray.reduce(
      (acc: number, file: File) => acc + file.size,
      0
    );

    const isValidFileSize = FileService.isValidFileSize(fileSize);
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
      setError(errorHelper(error?.response?.data.message));
    }
  };

  const handlePostCreate = async (e: FormEvent<HTMLFormElement>) => {
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
      const { data }: { data: IPost } = await authApi.post("/feed", payload);
      input.value = "";
      setPosts((prev) => [
        { ...data, commentsCount: 0, likesCount: 0 },
        ...prev,
      ]);
      setUploadedFiles([]);
      setError("");
    } catch (error: any) {
      setError(errorHelper(error?.response?.data.message));
    }
  };

  return (
    <Card>
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
              />
            </div>
            <div className="position-relative">
              <GenerateIcons
                icons={[{ size: 24, src: "/images/icons/gif.svg" }]}
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
                  handleFileUpload(e.target.files!, FileTypes.VIDEO)
                }
                invalid={invalidFile}
                accept={FileService.getAcceptTypes(video_accept_mime_types)}
              />
            </div>
            <GenerateIcons
              icons={[{ size: 24, src: "/images/icons/smile-feed.svg" }]}
            />
          </div>
          <p className="text-dc-4-13">{error}</p>
          <Button color="primary">Post</Button>
        </div>
      </Form>
    </Card>
  );
};

export default CreatePost;
