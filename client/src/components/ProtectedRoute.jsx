import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute() {
  const { currentUser } = useSelector(
    (state) => state.user
  );

  if (!currentUser) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
}