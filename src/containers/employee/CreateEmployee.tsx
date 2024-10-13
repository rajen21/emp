import { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";

import _isEmpty from "lodash/isEmpty";
import _get from "lodash/get";
import _find from "lodash/find";
import _map from "lodash/map";

import Toast from "../../components/Toast";
import EMSApi from "../../utils/Api";
import Loader from "../../components/Loader";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/button";
import ProtectedRoute from "../redirection/ProtectedRoute";
import { useDispatch, useSelector } from "react-redux";
import {
  employeeState,
  fetUserData,
  getUserList,
  getWorkSpaceAdminList,
} from "./employeeSlice";
import { AppDispatch } from "../../store/store";
import Dropdown from "../../components/dropdowns";
import { fetchUser, homeState } from "../home/homeSlice";
import ProfilePhoto from "../../components/profile";

export interface UserFormData extends FormData {
  _id: string;
  username: string;
  fullname: string;
  password?: string;
  company: string;
  dob: string;
  dept: string;
  phone: string;
  experience: string;
  email: string;
  profilePhoto?: File | null;
  doj: string;
  role: string;
  address: string;
  company_address: string;
  isActive: boolean;
  workSpaceAdminId?: string;
  superAdminId?: string;
}

const ROLES = [
  { val: "employee", label: "Employee" },
  { val: "workspace_admin", label: "Workspace Admin" },
];

function EmployeeForm() {
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<"success" | "info" | "error">(
    "success"
  );
  const [toastMessage, setToastMessage] = useState("");
  const dispatch: AppDispatch = useDispatch();
  const userData = useSelector(employeeState);
  const loggedUser = useSelector(homeState);
  const navigate = useNavigate();
  const { id } = useParams();
  const workspaceAdminOptions = _map(
    _get(userData, "workspaceAdmins.data.employees", []),
    (val: UserFormData) => ({ val: val._id, label: val.fullname })
  );

  if (!loggedUser.isLoading && loggedUser.data?.role === "employee") {
    navigate("/not-found");
    return;
  }

  const triggerToast = (
    type: "success" | "info" | "error",
    message: string
  ) => {
    setToastType(type);
    setToastMessage(message);
    setShowToast(true);
  };

  const onCancel = () => {
    navigate("/employee-list");
  };

  useEffect(() => {
    dispatch(fetchUser());
    if (id) {
      dispatch(fetUserData(id));
    } else {
      dispatch(getUserList());
      dispatch(getWorkSpaceAdminList());
    }
  }, []);

  if (id && _get(userData, "userData.isLoading", false)) {
    return <Loader classNames="border-blue-500 h-20 w-20" />;
  }

  return (
    <div className="">
      {/* <img className="flex" src={_get(userData, "userData.data.employees[0].profilePhoto")} width={200} height={200} alt="Profile" /> */}
      {
        (id && _get(userData, "userData.data.employees[0].profilePhoto")) ? <ProfilePhoto imageUrl={_get(userData, "userData.data.employees[0].profilePhoto")} /> : null
      }
      <Formik
        initialValues={{
          username: id ? _get(userData, "userData.data.employees[0].username", "") : "",
          fullname: id ? _get(userData, "userData.data.employees[0].fullname", "") : "",
          password: "",
          company: id ? _get(userData, "userData.data.employees[0].company", "") : "",
          dob: id ? _get(userData, "userData.data.employees[0].dob", "") : "",
          dept: id ? _get(userData, "userData.data.employees[0].dept", "") : "",
          phone: id ? _get(userData, "userData.data.employees[0].phone", "") : "",
          experience: id ? _get(userData, "userData.data.employees[0].experience", "") : "",
          email: id ? _get(userData, "userData.data.employees[0].email", "") : "",
          doj: id ? _get(userData, "userData.data.employees[0].doj", "") : "",
          role: id ? _get(userData, "userData.data.employees[0].role", "") : "",
          workSpaceAdminId: id ? _get(userData, "userData.data.employees[0].workSpaceAdminId", "") : "",
          superAdminId: "",
          profilePhoto: "",
          address: id ? _get(userData, "userData.data.employees[0].address", "") : "",
          company_address: id ? _get(userData, "userData.data.employees[0].company_address", "") : "",
          isActive: id ? _get(userData, "userData.data.employees[0].isActive", false) : false,
        }}
        validate={(values) => {
          const usernameRegex = /^[a-zA-Z0-9_]+$/;
          const passwordRegex =
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
          const phoneRegex = /^(\+91[-\s]?)?[6-9]\d{9}$/;
          const userDOB = new Date(_get(values, "dob", ""));
          const today = new Date();

          const cutoffDate = new Date(
            today.getFullYear() - 18,
            today.getMonth(),
            today.getDate()
          );
          let err: string = "";
          if (
            values.email.length &&
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            err = "Invalid email address";
          } else if (values.email.length && values.username.length < 3) {
            err = "Username must be at least 3 characters long.";
          } else if (
            values.username.length &&
            !usernameRegex.test(_get(values, "username"))
          ) {
            err = "Username can only contain letters, numbers, and underscores.";
          } else if (
            values.password.length &&
            !passwordRegex.test(_get(values, "password"))
          ) {
            err =
              "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*).";
          } else if (values.dob.length && userDOB > cutoffDate) {
            err = "User must be at least 18 years old.";
          } else if (
            values.phone.length &&
            !phoneRegex.test(_get(values, "phone"))
          ) {
            err = "Please enter a valid  phone number.";
          }
          if (!_isEmpty(err)) {
            triggerToast("error", err);
          }
          return {err};
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            setSubmitting(true);
            const formdata = new FormData();
            formdata.append('username', values.username);
            formdata.append('email', values.email);
            formdata.append('fullname', values.fullname);
            formdata.append('experience', values.experience);
            formdata.append('isActive', values.isActive.toString());
            formdata.append('profilePhoto', values.profilePhoto);
            formdata.append('company', values.company);
            formdata.append('address', values.address);
            formdata.append('dob', values.dob);
            formdata.append('dept', values.dept);
            formdata.append('phone', values.phone);
            formdata.append('doj', values.doj);
            formdata.append('company_address', values.company_address);
            
            if (loggedUser.data?.role === "super_admin") {
              formdata.append('role', values.role);
              formdata.append('superAdminId', loggedUser.data._id);
              formdata.append('workSpaceAdminId', values.workSpaceAdminId);
            } else if (loggedUser.data?.role === "workspace_admin") {
              formdata.append('workSpaceAdminId', loggedUser.data._id);
              formdata.append('superAdminId', loggedUser.data.superAdminId ?? "")
              formdata.append('role', 'employee');
            } else {
              formdata.append('role', 'employee');
            }

            if (values.password) {
              formdata.append('password', values.password);
            }
            let res;

            if (id) {
              const config = {
                params: {
                  _id: id
                }
              };
              res = await EMSApi.user.updateUser(formdata, config);
            } else {
              res = await EMSApi.registerUser.create(formdata);
            }
            console.log("aaaaa", res);
            if (_get(res, "data.statusCode") >= 400) {
              triggerToast("error", _get(res, "data.message"))
            }

            setSubmitting(false);
            if (_get(res, "data.success")) {
              triggerToast("success", _get(res, "data.message"));
              setTimeout(() => {
                navigate("/employee-list");
              }, 3000);
            }
          } catch (err) {
            console.error("err ", err);
            setSubmitting(false);
          }
        }}
      >
        {({ values, isSubmitting, setFieldValue }) => (
          <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
            <Form>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                  User Name
                </label>
                <Field
                  name="username"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullname">
                  Name
                </label>
                <Field
                  name="fullname"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <Field
                  name="email"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <Field
                  name="password"
                  type="password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="company">
                  Company
                </label>
                <Field
                  name="company"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dob">
                  DOB
                </label>
                <Field
                  name="dob"
                  type="date"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">

                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dept">
                  Department
                </label>
                <Field
                  name="dept"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                  Phone
                </label>
                <Field
                  name="phone"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="experience">
                  Experience
                </label>
                <Field
                  name="experience"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="profilePhoto">
                  Profile Photo
                </label>
                <input
                  id="profilePhoto"
                  type="file"
                  name="profilePhoto"
                  onChange={(event) => {
                    if (event.target.files?.length) {
                      setFieldValue('profilePhoto', event.target.files[0]);
                    }
                  }}
                  className="block w-full text-gray-700 py-2 px-3 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="doj">
                  DOJ
                </label>
                <Field
                  name="doj"
                  type="date"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                  Address
                </label>
                <Field
                  name="address"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="company_address">
                  Company Address
                </label>
                <Field
                  name="company_address"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              {loggedUser.data?.role === "super_admin" && (
                <div className="mb-4">
                  <Dropdown label="Role" name="role" options={ROLES} />
                </div>
              )}
              {loggedUser.data?.role === "super_admin" &&
                values.role === "employee" ? (
                <>
                  <div className="mb-4">
                    <Dropdown
                      label="Workspace Admin"
                      name="workSpaceAdminId"
                      options={workspaceAdminOptions}
                    />
                  </div>
                </>
              ) : null}

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="isActive">
                  Is Active?
                </label>
                <Field
                  name="isActive"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                />
              </div>

              <div className="flex items-center justify-around">
                <Button
                  type="reset"
                  variant="cancel"
                  label="Cancel"
                  onClick={onCancel}
                />
                <Button isLoading={isSubmitting} type="submit" variant="submit" />
              </div>
              <Toast
                type={toastType}
                message={toastMessage}
                show={showToast}
                onClose={() => setShowToast(false)}
              />
            </Form>
          </div>
        )}
      </Formik>
    </div>
  );
}

export default {
  path: "/create-employee",
  element: <ProtectedRoute element={<EmployeeForm />} />,
};
export const EditEmployee = {
  path: "/edit-employee/:id",
  element: <ProtectedRoute element={<EmployeeForm />} />,
};
