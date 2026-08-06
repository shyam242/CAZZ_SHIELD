import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
