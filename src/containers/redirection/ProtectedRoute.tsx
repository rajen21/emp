import React, { useState } from "react";
import { Navigate, RouteProps, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import EMSApi, { apiDomain, axiosInstance } from "../../utils/Api";
import { handleDownload } from "../../utils/handleDownload";
import Toast from "../../components/Toast";

const ProtectedRoute: React.FC<RouteProps> = ({ element: Component }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'info' | 'error'>('success');
  const [toastMessage, setToastMessage] = useState('');
  const token = localStorage.getItem("emp-token");
  const navigate = useNavigate();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const onLogout = async () => {
    await EMSApi.auth.logOut();
    localStorage.removeItem("emp-token");
    navigate("/login");
  };

  const triggerToast = (type: 'success' | 'info' | 'error', message: string) => {
    setToastType(type);
    setToastMessage(message);
    setShowToast(true);
  };

  const downloadCSV = async () => {
    const res = await axiosInstance.get(`${apiDomain}/emp/export-users-csv`);
    handleDownload(res.data.data.url,triggerToast);
  }

  return (
    <>
      <Header onLogout={onLogout} downloadCSV={downloadCSV} />
      {Component}
      <Toast type={toastType} message={toastMessage} show={showToast} onClose={() => setShowToast(false)} />
    </>
  );
};

export default ProtectedRoute;
