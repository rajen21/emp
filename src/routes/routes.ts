import { createBrowserRouter } from "react-router-dom";
import Home from "../containers/home/Home";
import Login from "../containers/auth/login/Login";
import RegisterUser from "../containers/auth/register/RegisterUser";
import Profile from "../containers/profile";
import Workspaces from "../containers/workspaces";
import CreateWorkspace, { editWorkspace } from "../containers/workspaces/CreateWorkspace";
import CreateEmployee, { EditEmployee } from "../containers/employee/CreateEmployee";
import EmpployeeList from "../containers/employee/EmpployeeList";
import ErrorPage from "../components/ErrorPage/index";


export default createBrowserRouter([
  Home,
  Login,
  RegisterUser,
  Profile,
  Workspaces,
  CreateWorkspace,
  editWorkspace,
  CreateEmployee,
  EmpployeeList,
  EditEmployee,
  ErrorPage
]);

