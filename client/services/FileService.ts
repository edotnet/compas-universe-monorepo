import { max_file_size_in_bytes } from "@/utils/constants/file.constant";
import FormData from "form-data";

class FileService {
  getAcceptTypes(types: string[]) {
    return types.toString();
  }

  getFormData(data: object) {
    console.log("🚀 ~~~~~~~~~~~~~~~~~~~~~~~~~~ data:", data);
    const formData = new FormData();
    for (const key in data) {
      const value: File[] = data[key as keyof typeof data];

      if (key === "files") {
        value.forEach((file) => formData.append(key, file));
      } else if (key === "file") {
        formData.append(key, value);
      } else {
        console.log('lkjlkj;lkjlkj;lj;j;j');
        
        formData.append(
          key,
          typeof value === "object" ? JSON.stringify(value) : value
        );
      }
    }
    return formData;
  }

  deleteFile(files: File[], fileName: string) {
    return files.filter((file) => file.name !== fileName);
  }

  getFilePath(file: File) {
    return URL.createObjectURL(file);
  }

  isValidFileSize = (size: number): boolean => size < max_file_size_in_bytes;
}

export default new FileService();
