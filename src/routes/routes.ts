import { createBrowserRouter } from "react-router-dom";
import Home from "../containers/home/Home";
import Login from "../containers/auth/login/Login";
import RegisterUser from "../containers/auth/register/RegisterUser";
import Profile from "../containers/profile";
import Workspaces from "../containers/workspaces";
import CreateWorkspace from "../containers/workspaces/CreateWorkspace";


export default createBrowserRouter([
  Home,
  Login,
  RegisterUser,
  Profile,
  Workspaces,
  CreateWorkspace,
]);

