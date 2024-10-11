// import ErrorPage from "../../components/ErrorPage";
import { useDispatch, useSelector } from "react-redux";
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
    <div>Home</div>
    </>
  )
}

export default { 
  path: "/", 
  element: <ProtectedRoute element={<Home />} />,
};