import { RefObject } from "react";

export const scrollToInput = (ref: RefObject<Element>) => {
  if (ref.current) {
    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};
