import RegisterForm from "../../components/auth/RegisterForm";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
export default function Register() {
  const navigate = useNavigate();

const isAuthenticated = useSelector(
  (state) => state.auth.isAuthenticated
);

if (isAuthenticated) {
  navigate("/");
  return null;
}
  return <RegisterForm />;
}