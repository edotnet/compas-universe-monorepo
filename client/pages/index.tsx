import Login from "./login";
import "../styles/global.module.scss";
import AuthService from "@/services/AuthService";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { accessToken } = router.query;
  const tokens = { accessToken };

  if (accessToken && Object.keys(tokens).length) {
    AuthService.login({ accessToken }, null);
    router.push("/feed");
  }

  return <Login />;
}
