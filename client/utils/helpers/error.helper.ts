import ERROR_MESSAGES from "../constants/error-messages.constant";
import { ErrorEnum } from "../types/enums/error.enum";

export const errorHelper = (error: ErrorEnum) => {
  const message = ERROR_MESSAGES[error];

  if (message || message === "string") {
    return message;
  }

  return ERROR_MESSAGES.DEFAULT;
};
