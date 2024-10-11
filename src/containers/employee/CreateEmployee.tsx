import { useEffect, useState } from "react";
import { Formik } from "formik";

import _isEmpty from "lodash/isEmpty";
import _get from "lodash/get";
import _find from "lodash/find";
import _map from "lodash/map";

import Toast from "../../components/Toast";
import EMSApi from "../../utils/Api";
import Loader from "../../components/Loader";
import Input from "../../components/Input/CommonInput";
import { useNavigate, useParams } from "react-router-dom";
import Checkbox from "../../components/Input/Checkbox";
import Button from "../../components/button";
import ProtectedRoute from "../redirection/ProtectedRoute";
import { useDispatch, useSelector } from "react-redux";
import {
  employeeState,
  getUserList,
  getWorkSpaceAdminList,
} from "./employeeSlice";
import { AppDispatch } from "../../store/store";
import Dropdown from "../../components/dropdowns";
import { fetchUser, homeState } from "../home/homeSlice";

export interface UserFormData {
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
  console.log("🚀 ~ EmployeeForm ~ userData:", userData);
  const navigate = useNavigate();
  const { id } = useParams();
  const workspaceAdminOptions = _map(
    _get(userData, "workspaceAdmins.data.employees", []),
    (val: UserFormData) => ({ val: val._id, label: val.fullname })
  );
  const editData = _find(
    _get(userData, "employeeList.data.employees", []),
    (val: UserFormData) => val._id === id
  );

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
    dispatch(getUserList());
    dispatch(fetchUser());
    dispatch(getWorkSpaceAdminList());
  }, []);

  if (id && _get(userData, "employeeList.isLoading", false)) {
    return <Loader classNames="border-blue-500" />;
  }

  return (
    <Formik
      initialValues={{
        username: id ? _get(editData, "username", "") : "",
        fullname: id ? _get(editData, "fullname", "") : "",
        password: "",
        company: id ? _get(editData, "company", "") : "",
        dob: id ? _get(editData, "dob", "") : "",
        dept: id ? _get(editData, "dept", "") : "",
        phone: id ? _get(editData, "phone", "") : "",
        experience: id ? _get(editData, "experience", "") : "",
        email: id ? _get(editData, "email", "") : "",
        doj: id ? _get(editData, "doj", "") : "",
        role: id ? _get(editData, "role", "") : "",
        workSpaceAdminId: id ? _get(editData, "workSpaceAdminId", "") : "",
        superAdminId: "",
        address: id ? _get(editData, "address", "") : "",
        company_address: id ? _get(editData, "company_address", "") : "",
        isActive: id ? _get(editData, "isActive", false) : false,
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
        return {};
      }}
      onSubmit={async (values, { setSubmitting }) => {
        console.log("checkk val", values);

        try {
          setSubmitting(true);
          const data = { ...values } as UserFormData;
          if (loggedUser.data?.role === "super_admin") {
            data.superAdminId = loggedUser.data._id;
          }
          if (loggedUser.data?.role === "workspace_admin") {
            data.workSpaceAdminId = loggedUser.data._id;
            data.superAdminId = loggedUser.data.superAdminId || "";
          }

          if (!data.password) {
            delete data.password;
          }
          let res;

          if (id) {
            const config = {
              params: {
                _id: id
              }
            };
            res = await EMSApi.user.updateUser(data, config);
          }else {
            res = await EMSApi.registerUser.create(data);
          }

          setSubmitting(false);
          console.log("checkkk ", res);
          if (
            _get(res, "data.statusCode") === 201 &&
            _get(res, "data.success")
          ) {
            triggerToast("success", _get(res, "data.message"));
            setTimeout(() => {
              navigate("/login");
            }, 3000);
          }
        } catch (err) {
          console.error("err ", err);
          setSubmitting(false);
        }
      }}
    >
      {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Input
                labelClass="block text-gray-700 text-sm font-bold mb-2"
                classname="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                htmlfor="username"
                id="username"
                label="Username"
                name="username"
                type="text"
                required={!id}
                val={values.username}
                handleBlur={handleBlur}
                handleChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <Input
                labelClass="block text-gray-700 text-sm font-bold mb-2"
                classname="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                htmlfor="fullname"
                id="fullname"
                label="Name"
                name="fullname"
                type="text"
                required={!id}
                val={values.fullname}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />
            </div>

            <div className="mb-4">
              <Input
                labelClass="block text-gray-700 text-sm font-bold mb-2"
                classname="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                htmlfor="email"
                id="email"
                label="Email"
                name="email"
                type="email"
                required={!id}
                val={values.email}
                handleBlur={handleBlur}
                handleChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <Input
                labelClass="block text-gray-700 text-sm font-bold mb-2"
                classname="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                htmlfor="password"
                id="password"
                name="password"
                label="Password"
                type="password"
                required={ !id}
                val={values.password}
                handleBlur={handleBlur}
                handleChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <Input
                labelClass="block text-gray-700 text-sm font-bold mb-2"
                classname="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                htmlfor="company"
                id="company"
                label="Company"
                name="company"
                type="text"
                required={!id}
                val={values.company}
                handleBlur={handleBlur}
                handleChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <Input
                labelClass="block text-gray-700 text-sm font-bold mb-2"
                classname="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                htmlfor="dob"
                id="dob"
                name="dob"
                label="Date of Birth"
                type="date"
                required={!id}
                val={values.dob}
                handleBlur={handleBlur}
                handleChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <Input
                labelClass="block text-gray-700 text-sm font-bold mb-2"
                classname="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                htmlfor="dept"
                id="dept"
                name="dept"
                label="Department"
                type="text"
                required={!id}
                val={values.dept}
                handleBlur={handleBlur}
                handleChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <Input
                labelClass="block text-gray-700 text-sm font-bold mb-2"
                classname="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                htmlfor="phone"
                id="phone"
                name="phone"
                label="Phone"
                type="text"
                required={!id}
                val={values.phone}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />
            </div>

            <div className="mb-4">
              <Input
                labelClass="block text-gray-700 text-sm font-bold mb-2"
                classname="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                htmlfor="experience"
                id="experience"
                name="experience"
                label="Experience"
                type="text"
                required={!id}
                val={values.experience}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />
            </div>

            <div>
              <Input
                labelClass="block text-gray-700 text-sm font-bold mb-2"
                classname="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                htmlfor="profilePhoto"
                id="profilePhoto"
                name="profilePhoto"
                label="Profile Picture"
                type="file"
                required={!id}
                // val={formData.experience}
                handleChange={handleChange}
                // handleBlur={handleBlur}
              />
            </div>

            <div className="mb-4">
              <Input
                labelClass="block text-gray-700 text-sm font-bold mb-2"
                classname="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                htmlfor="doj"
                id="doj"
                name="doj"
                label="Joining Date"
                type="date"
                required={!id}
                val={values.doj}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />
            </div>

            <div className="mb-4">
              <Input
                labelClass="block text-gray-700 text-sm font-bold mb-2"
                classname="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                htmlfor="address"
                id="address"
                name="address"
                label="Address"
                type="text"
                required={!id}
                val={values.address}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />
            </div>
            <div className="mb-4">
              <Input
                labelClass="block text-gray-700 text-sm font-bold mb-2"
                classname="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                htmlfor="company_address"
                id="company_address"
                name="company_address"
                label="Company Address"
                type="text"
                required={!id}
                val={values.company_address}
                handleChange={handleChange}
                handleBlur={handleBlur}
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
              <Checkbox
                id="isActive"
                name="isActive"
                checked={values.isActive}
                onChange={handleChange}
                label="Is Active"
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
          </form>
        </div>
      )}
    </Formik>
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
