import ErrorEnum from "../types/enums/error.enum";

const ERROR_MESSAGES: Record<ErrorEnum, string> = {
  [ErrorEnum.DEFAULT]: "Something went wrong",
  [ErrorEnum.INVALID_CODE]: "Invalid code.",
  [ErrorEnum.USER_IS_NOT_FRIEND]: "You are not following this user.",
  [ErrorEnum.USER_ALREADY_EXISTS]: "Email already exists.",
  [ErrorEnum.USER_DOES_NOT_EXIST]: "Email does not exist",
  [ErrorEnum.LIMIT_REACHED_TRY_LATER]: "Limit has reached, try later.",
  [ErrorEnum.FILE_VALIDATION_SIZE_ERROR]: "Inappropriate file size",
  [ErrorEnum.USER_DEACTIVATED_OR_CANCELLED]:
    "User is deactivated or cancelled.",
  [ErrorEnum.UPLOAD_EITHER_VIDEOS_OR_IMAGES]: "upload either videos or images.",
};

export default ERROR_MESSAGES;
