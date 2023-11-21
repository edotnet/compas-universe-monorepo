import axios, { AxiosRequestHeaders } from "axios";
import { parseCookies } from "nookies";
import { contextType } from "./types/context.types";

export const api = axios.create({
  withCredentials: true,
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const authApi = axios.create({
  withCredentials: true,
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

authApi.interceptors.request.use(async (config: any) => {
  const { accessToken } = parseCookies();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response && response.data && response.data.message) {
      error.message = response.data.message;
    }

    return Promise.reject(error);
  }
);

export const authHeader = (context: contextType): AxiosRequestHeaders | any => {
  const { accessToken } = parseCookies(context);

  return {
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  };
};
