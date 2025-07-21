import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const ProtectedRoute = ({ children }) => {
  const { userRole } = useAuth();
  return userRole === "admin" ? children : <Navigate to="/admin-login" />;
};

export default ProtectedRoute;
