export const scrollToTop = (current: HTMLElement) => {
  if (current) {
    current.scrollTo({ top: 0, behavior: "smooth" });
  }
};
