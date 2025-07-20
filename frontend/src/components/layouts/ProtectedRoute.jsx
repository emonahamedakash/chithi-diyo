import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Loader } from "./Loader";
import { AlertMessage } from "./Alert";

export default function ProtectedRoute({ roles = [], children }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    return (
      <div className="container py-8">
        <AlertMessage
          variant="destructive"
          title="Unauthorized Access"
          message="You don't have permission to access this page."
        />
      </div>
    );
  }

  return children ? children : <Outlet />;
}
