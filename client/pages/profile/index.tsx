import withAuth from "@/HOC/withAuth";
import ProfileContent from "@/components/ProfileContent";
import { GlobalProvider } from "@/context/Global.context";
import MainLayout from "@/layouts/MainLayout";

const Profile = () => {
  return (
    <GlobalProvider>
      <MainLayout>
        <ProfileContent />
      </MainLayout>
    </GlobalProvider>
  );
};

export default withAuth(Profile);
