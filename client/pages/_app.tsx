import { useEffect, useMemo, useState } from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { appWithTranslation } from "next-i18next";
import { socket, WebsocketProvider } from "../context/Websocket.Context";
import { GlobalContext } from "@/context/Global.context";
import { authApi } from "@/utils/axios";
import { IExtendedUser } from "@/utils/types/user.types";

import "../styles/global.scss";
import "../styles/global.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [DOMLoaded, setDOMLoaded] = useState(false);
  const [me, setMe] = useState<IExtendedUser>(null!);

  const router = useRouter();

  useEffect(() => {
    setDOMLoaded(true);
    try {
      (async () => {
        const { data } = await authApi.get("/users/me");
        if (data) {
          setMe(data);
        }
      })();
    } catch (error) {}
  }, []);

  const value = useMemo(
    () => ({
      me,
    }),
    [me]
  );

  return (
    <WebsocketProvider value={socket}>
      {DOMLoaded &&
        (router.route !== "/" &&
        router.route !== "/login" &&
        router.route !== "/register" &&
        router.route !== "/forgot-password" ? (
          <GlobalContext.Provider value={value}>
            <Component {...pageProps} />
          </GlobalContext.Provider>
        ) : (
          <Component {...pageProps} />
        ))}
    </WebsocketProvider>
  );
};

export default appWithTranslation(MyApp);
