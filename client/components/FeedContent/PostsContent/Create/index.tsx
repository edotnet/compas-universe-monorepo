import { ChangeEvent, useContext, useState } from "react";
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

const CreatePost = () => {
  const [invalidFile, setInvalidFile] = useState<boolean>(false);

  const { me } = useContext(GlobalContext);
  const { uploadedFiles, setUploadedFiles } = useContext(FeedContext);

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
      setUploadedFiles(data.map((file) => file.meta.src));
    } catch (error) {}
  };

  return (
    <Card>
      <Form className="bg-white p-2" style={{ borderRadius: 10 }}>
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
            />
          </InputGroup>
        </FormGroup>
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

              {/* <FormGroup></FormGroup> */}
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
          <Button color="primary">Post</Button>
        </div>
      </Form>
    </Card>
  );
};

export default CreatePost;
