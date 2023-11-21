import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { socket, WebsocketProvider } from "../context/Websocket.Context";
import { GlobalProvider } from "@/context/Global.context";
import { useRouter } from "next/router";
import "../styles/global.module.scss";
import "../styles/global.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  return (
    <WebsocketProvider value={socket}>
      {router.route !== "/" &&
      router.route !== "/login" &&
      router.route !== "/register" &&
      router.route !== "/forgot-password" ? (
        <GlobalProvider>
          <Component {...pageProps} />
        </GlobalProvider>
      ) : (
        <Component {...pageProps} />
      )}
    </WebsocketProvider>
  );
};

export default appWithTranslation(MyApp);
