export const apiUrl = (path: string) => {
  return process.env.NEXT_PUBLIC_API_URL + path;
};

export const baseUrl = (path: string) => {
  return process.env.NEXT_PUBLIC_BASE_URL + path;
};