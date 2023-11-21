import CircularJSON from "circular-json";
import { contextType } from "../types/context.types";

export const copyObject = (obj: object | null | unknown | contextType) => {
  const copiedObject = CircularJSON.stringify(obj);
  return JSON.parse(copiedObject);
};
