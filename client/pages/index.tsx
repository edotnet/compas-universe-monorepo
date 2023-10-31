import Login from "./login";
import "../styles/global.module.scss";
import AuthService from "@/services/AuthService";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { accessToken } = router.query;
  const tokens = { accessToken };

  const auth = AuthService.isValidToken();

  useEffect(() => {
    if (auth) {
      router.push("/profile");
    }
  }, [auth]);

  if (accessToken && Object.keys(tokens).length) {
    AuthService.login({ accessToken }, null);
    router.push("/profile");
  }

  return <Login />;
}
