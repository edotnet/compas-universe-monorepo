import RegistrationForm from "@/components/RegistrationForm";
import LoginPagesWrapper from "@/components/LoginPagesWrapper";

const Register = () => (
  <LoginPagesWrapper component={<RegistrationForm />} register />
);

export default Register;
