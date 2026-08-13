import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminRoute() {
  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin
  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}