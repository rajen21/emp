// import ErrorPage from "../../components/ErrorPage";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Header";
import ProtectedRoute from "../redirection/ProtectedRoute";
import { fetchUser, homeState } from "./homeSlice";
import { useEffect } from "react";
import { AppDispatch } from "../../store/store";

function Home() {
  const dispatch: AppDispatch = useDispatch();
  const data = useSelector(homeState);
  useEffect(() => {
    dispatch(fetchUser());
  }, []);
  console.log(data);
  
  return (
    <>
    <Header />
    <div>Home</div>
    </>
  )
}

export default { 
  path: "/home", 
  element: <ProtectedRoute element={<Home />} />,
};