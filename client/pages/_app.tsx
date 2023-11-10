import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { socket, WebsocketProvider } from "../context/Websocket.Context";

import "../styles/global.module.scss";
import "../styles/global.css";
import { GlobalProvider } from "@/context/Global.context";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <WebsocketProvider value={socket}>
      <GlobalProvider>
        <Component {...pageProps} />
      </GlobalProvider>
    </WebsocketProvider>
  );
};

export default appWithTranslation(MyApp);
