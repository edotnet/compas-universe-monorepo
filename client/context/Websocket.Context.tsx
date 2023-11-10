import { parseCookies } from "nookies";
import { createContext } from "react";
import { io, Socket } from "socket.io-client";

const { accessToken } = parseCookies();

export const socket = io(`${process.env.NEXT_PUBLIC_WS_URL}/ws`, {
  transports: ["websocket"],
  withCredentials: true,
  query: { accessToken },
  path: "/ws",
});

export const WebsocketContext = createContext<Socket>(socket);

export const WebsocketProvider = WebsocketContext.Provider;
