import { Dispatch, RefObject, SetStateAction } from "react";

export const scrollPaginate = async (
  ref: RefObject<HTMLDivElement>,
  content: object[],
  loading: boolean,
  handleGetContent: () => Promise<void>,
  setSkip: Dispatch<SetStateAction<number>>,
  skip: number
): Promise<void> => {
  const container: HTMLDivElement | null = ref.current;

  if (container) {
    if (
      container.scrollHeight - container.scrollTop === container.clientHeight &&
      !loading
    ) {
      if (content.length >= skip) {
        await handleGetContent();
        setSkip(skip + 12);
      }
    }
  }
};
