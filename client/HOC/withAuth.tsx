import AuthService from "@/services/AuthService";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const withAuth = <P extends {}>(
  WrappedComponent: React.FC<P>
): React.FC<P> => {
  return (props: P) => {
    const router = useRouter();

    useEffect(() => {
      if (!AuthService.isValidToken()) {
        router.push("/login");
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
