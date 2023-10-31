import { destroyCookie, parseCookies, setCookie } from "nookies";
import jwtDecode from "jwt-decode";
import { contextType } from "@/utils/types/context.types";

class AuthService {
  login(data: object, context: contextType = null) {
    for (const key in data) {
      setCookie(context, key, data[key as keyof typeof data], {
        maxAge: 24 * 60 * 60 * 1000,
      });
    }
  }

  async logout(context: contextType = null) {
    const cookies = parseCookies();
    for (const cookie in cookies) {
      destroyCookie(context, cookie);
    }
  }

  isValidToken(context: contextType = null) {
    const { accessToken } = parseCookies(context);

    try {
      if (accessToken && jwtDecode(accessToken)) {
        const decodedToken = jwtDecode(accessToken) as { exp: number };
        const currentTime = Date.now() / 1000;
        const expired = decodedToken.exp < currentTime;
        if (expired) {
          this.logout();
          return false;
        }

        return true;
      }

      this.logout();
      return false;
    } catch (e) {
      this.logout();
      return false;
    }
  }

  isAuth(context: contextType = null) {
    const { accessToken } = parseCookies(context);
    return !!accessToken;
  }
}

export default new AuthService();
