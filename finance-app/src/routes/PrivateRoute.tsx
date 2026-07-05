import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }: any) {
  const { token, loading } = useAuth();

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return token ? children : <Navigate to="/login" />;
}