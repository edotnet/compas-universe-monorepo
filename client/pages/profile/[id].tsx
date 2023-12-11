import withAuth from "@/HOC/withAuth";
import ProfileContent from "@/components/ProfileContent";
import { GlobalProvider } from "@/context/Global.context";
import { useFetchSSR } from "@/hooks/useFetchSSR";
import MainLayout from "@/layouts/MainLayout";
import { copyObject } from "@/utils/helpers/copy-object.helper";
import RequestMethod from "@/utils/types/enums/request-method.enum";
import { IUserProfileResponse } from "@/utils/types/user.types";

interface IProfile {
  data: IUserProfileResponse;
}

const Profile = ({ data }: IProfile) => {
  return (
    <GlobalProvider>
      <MainLayout>
        <ProfileContent data={data} />
      </MainLayout>
    </GlobalProvider>
  );
};

export const getServerSideProps = async (context: object) => {
  const newContext = copyObject(context);

  if (newContext.params) {
    const { id } = newContext.params;
    const data: IUserProfileResponse = await useFetchSSR(
      context,
      RequestMethod.Get,
      `users/profile/${id}`
    );
    return data ? { props: { data } } : { notFound: true };
  }
  return { notFound: true };
};

export default withAuth(Profile);
