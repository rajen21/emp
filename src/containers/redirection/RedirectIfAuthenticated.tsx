import React from 'react';
import { Navigate, RouteProps } from 'react-router-dom';

const RedirectIfAuthenticated: React.FC<RouteProps> = ({ element: Component }) => {
  const token = localStorage.getItem("emp-token");

  if (token) {
    return <Navigate to="/home" replace />;
  }

  return <>{Component}</>;
};

export default RedirectIfAuthenticated;
