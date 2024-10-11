import { useEffect, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import ProtectedRoute from '../redirection/ProtectedRoute';
import { apiDomain, axiosInstance } from '../../utils/Api';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, getWorkspaceAdmins, getWorkspaces, workspaceState } from './workspaceSliice';
import { AppDispatch } from '../../store/store';
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import _map from "lodash/map";
import Dropdown from '../../components/dropdowns/index';
import Toast from '../../components/Toast';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../components/Loader';
import Button from '../../components/button';

interface User {
  _id: string;
  username: string;
  email: string;
  fullname: string;
  phone: string;
  role: "employee" | "admin" | "superAdmin";
  experience: number;
  profilePhoto: string;
  company: string;
  dob: string;
  dept: string;
  doj: string;
  isActive: boolean;
  superAdminId?: string;
  workSpaceAdminId?: string;
}

const CreateWorkspace = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'info' | 'error'>('success');
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams();
  const workspaceStateData = useSelector(workspaceState);
  
  const OPTIONS = _map(_get(workspaceStateData, "workspaceAdmins.data", []), (data: User) => ({ val: data?._id, label: data.fullname }))

  const triggerToast = (type: 'success' | 'info' | 'error', message: string) => {
    setToastType(type);
    setToastMessage(message);
    setShowToast(true);
  };

  const onCancel = () => {
    navigate("/workspaces");
  }

  useEffect(() => {
    const query = {
      params: {
        _id: id
      }
    }
    dispatch(getWorkspaces(query));
    dispatch(getWorkspaceAdmins());
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Workspace Form</h1>
      {!_get(workspaceStateData, "workspaces.isLoading") ? (
        <>
          <Formik
            initialValues={{
              // name: _get(workspaceStateData, "workspaces.workspacedata[0].name", ""),
              name: id ? _get(workspaceStateData, "workspaces.workspacedata[0].name", "") : "",
              email: id ? _get(workspaceStateData, "workspaces.workspacedata[0].email", "") : "",
              phone: id ? _get(workspaceStateData, "workspaces.workspacedata[0].phone", "") :"",
              address: id? _get(workspaceStateData, "workspaces.workspacedata[0].address", "") : "",
              logo: null,
              owner: id? _get(workspaceStateData, "workspaces.workspacedata[0].owner", ""):"",
              isActive: id?_get(workspaceStateData, "workspaces.workspacedata[0].isActive", false):false,
            }}
            validate={values => {
              let error: string = "";
              if (!values.name) {
                error = 'Name is required';
              } else if (values.name.length < 2) {
                error = 'Name must be at least 2 characters long';
              } else if (!values.email) {
                error = 'Email is required';
              } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                error = 'Email is invalid';
              } else if (!values.phone) {
                error = 'Phone number is required';
              } else if (!/^[+]?[91]?[6789]\d{9}$/.test(values.phone)) {
                error = 'Enter valid phone number.';
              } else if (!values.address) {
                error = 'Address is required';
              } else if (!values.owner) {
                error = 'Owner is required';
              }
              if (!_isEmpty(error)) {
                triggerToast("error", error);
              }
              return ;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              const formdata = new FormData();
              formdata.append('name', values.name);
              formdata.append('email', values.email);
              formdata.append('phone', values.phone);
              formdata.append('address', values.address);
              formdata.append('owner', values.owner);
              formdata.append('admin', _get(workspaceStateData, "user.data._id") || "");
              console.log("checkk daya", values, formdata);

              if (values.logo) {
                formdata.append('logo', values.logo);
              }

              try {

                const res = await axiosInstance.post(`${apiDomain}/workspace/create-workspace`, formdata);
                console.log("dddd", res);

              } catch (error) {
                const err = error as Error;
                console.error("error", error);
                triggerToast('error', err.message)
              }
              console.log(formdata);
              setSubmitting(false);
            }}
          >
            {({ setFieldValue, isSubmitting }) => (
              <Form>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Name
                  </label>
                  <Field
                    name="name"
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
                    type="email"
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
                  <Dropdown label='Workspace Admin' name='owner' options={OPTIONS} />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="logo">
                    Logo
                  </label>
                  <input
                    type="file"
                    name="logo"
                    onChange={(event) => {
                      if (event.target.files?.length) {
                        setFieldValue('logo', event.target.files[0]);
                      }
                    }}
                    className="block w-full text-gray-700 py-2 px-3 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>

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
                  <Button type='reset' variant='cancel' label='Cancel' onClick={onCancel} />

                  <Button isLoading={isSubmitting} type='submit' variant='submit' />
                </div>
              </Form>
            )}
          </Formik>
          <Toast type={toastType} message={toastMessage} show={showToast} onClose={() => setShowToast(false)} />
        </>
      ) : <Loader classNames='border-blue-500 h-20 w-20' />}
    </div>
  );
};

export default { path: "/create-workspace", element: <ProtectedRoute element={<CreateWorkspace />} /> };
export const editWorkspace = { path: "/edit-workspace/:id", element: <ProtectedRoute element={<CreateWorkspace />} /> }