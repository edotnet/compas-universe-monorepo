import { ErrorEnum } from "../types/enums/error.enum";

const ERROR_MESSAGES: Record<ErrorEnum, string> = {
  INVALID_CODE: "Invalid code.",
  USER_DOES_NOT_EXIST: "Email does not exist",
  USER_ALREADY_EXISTS: "Email already exists.",
  LIMIT_REACHED_TRY_LATER: "Limit has reached, try later.",
  USER_FOLLOW_DOES_NOT_EXIST: "You are not following this user.",
  USER_DEACTIVATED_OR_CANCELLED: "User is deactivated or cancelled.",
  DEFAULT: "Something went wrong",
};

export default ERROR_MESSAGES;
