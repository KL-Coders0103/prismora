import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PERMISSIONS } from "../../utils/permissions";

const ProtectedRoute = ({ permission }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  const userRole = user?.role?.toLowerCase();

  if (
    permission &&
    (!PERMISSIONS[permission] ||
      !PERMISSIONS[permission].includes(userRole))
  ) {
    console.warn("ACCESS DENIED:", permission, userRole);
    return <Navigate to="/dashboard" replace />;
  }

  console.log("PERMISSION:", permission);
  console.log("USER ROLE:", user.role);
  console.log("ALLOWED:", PERMISSIONS[permission]);

  return <Outlet />;
};

export default ProtectedRoute;