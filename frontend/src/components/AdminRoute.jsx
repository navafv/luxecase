import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // We check the token directly to see if 'is_admin' is true
  // (Ensure your backend/users/serializers.py 'MyTokenObtainPairSerializer' includes 'is_admin')
  const token = localStorage.getItem("access_token");
  let isAdmin = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      isAdmin = decoded.is_admin;
    } catch {
      isAdmin = false;
    }
  }

  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;
