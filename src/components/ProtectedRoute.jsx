import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, requireAuth = true }) {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
