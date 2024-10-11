import React from "react";
import { Navigate, RouteProps, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import EMSApi from "../../utils/Api";

const ProtectedRoute: React.FC<RouteProps> = ({ element: Component }) => {
  const token = localStorage.getItem("emp-token");
  const navigate = useNavigate();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const onLogout = async () => {
    await EMSApi.auth.logOut();
    localStorage.removeItem("emp-token");
    navigate("/login");
  }

  return (
    <>
      <Header onLogout={onLogout} />
      {Component}
    </>
  );
};

export default ProtectedRoute;
