import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { io } from "socket.io-client";
import { parseCookies } from "nookies";

import "../styles/global.scss";
import "../styles/global.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [DOMLoaded, setDOMLoaded] = useState(false);

  useEffect(() => {
    setDOMLoaded(true);

    const { accessToken } = parseCookies();

    io(`${process.env.NEXT_PUBLIC_WS_URL}/ws`, {
      transports: ["websocket"],
      withCredentials: true,
      query: { accessToken },
      path: "/ws",
    })
      .on("connect", () => console.log("connected"))
      .off("disconnect", () => console.log("disconnected"));
  }, []);

  return DOMLoaded && <Component {...pageProps} />;
};

export default appWithTranslation(MyApp);
