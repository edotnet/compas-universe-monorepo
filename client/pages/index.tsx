import { useEffect } from "react";
import { useRouter } from "next/router";
import AuthService from "@/services/AuthService";
import Login from "./login";

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
