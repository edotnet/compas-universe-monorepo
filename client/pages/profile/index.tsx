import withAuth from "@/HOC/withAuth";
import ProfileContent from "@/components/ProfileContent";
import MainLayout from "@/layouts/MainLayout";

const Profile = () => {
  return (
    <MainLayout>
      <ProfileContent />
    </MainLayout>
  );
};

export default withAuth(Profile);
