import { destroyCookie, parseCookies, setCookie } from "nookies";
import { authApi } from "../utils/axios";
import { useRedirectSSR } from "@/hooks/useRedirectSSR";
import { contextType } from "@/utils/types/ContextTypes";

class AuthService {
  login(data: object, context: contextType = null) {
    for (const key in data) {
      setCookie(context, key, data[key as keyof typeof data], {
        maxAge: 24 * 60 * 60 * 1000,
      });
    }
  }

  async logout(context: contextType = null, sessionId: number) {
    const cookies = parseCookies();
    for (const cookie in cookies) {
      destroyCookie(context, cookie);
    }
  }

  isAuth(context: contextType = null) {
    const { accessToken } = parseCookies(context);
    return !!accessToken;
  }
}

export default new AuthService();
