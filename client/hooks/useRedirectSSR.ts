export const useRedirectSSR = (path: string) => {
  return {
    redirect: {
      permanent: false,
      destination: path,
    },
  };
};