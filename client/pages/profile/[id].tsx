import withAuth from "@/HOC/withAuth";
import ViewProfileContent from "@/components/ViewProfileContent";
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
    <MainLayout>
      <ViewProfileContent data={data} />
    </MainLayout>
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
