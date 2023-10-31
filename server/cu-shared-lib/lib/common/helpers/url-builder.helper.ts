export const buildWebUrl = (
  baseUrl: string,
  path: string,
  queryParams?: Record<string, string>
): string => {
  let url = [baseUrl, path].join("/");

  if (queryParams) {
    url = [url, new URLSearchParams(queryParams).toString()].join("?");
  }

  return url;
};

export const buildUnauthorizedUrl = (path: string): string => {
  return path.replace("%SUBDOMAIN%.", "");
};
