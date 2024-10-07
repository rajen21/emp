import React from 'react';
import { Navigate, RouteProps } from 'react-router-dom';

const ProtectedRoute: React.FC<RouteProps> = ({ element: Component }) => {
  const token = localStorage.getItem("emp-token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{Component}</>;
};

export default ProtectedRoute;
