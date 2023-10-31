import withAuth from "@/HOC/withAuth";
import ProfileContent from "@/components/ProfileContent";
import MainLayout from "@/layouts/MainLayout";

const Profile = () => (
  <MainLayout>
    <ProfileContent />
  </MainLayout>
);

export default withAuth(Profile);
