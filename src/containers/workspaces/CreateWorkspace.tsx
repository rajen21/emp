import { useEffect, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import ProtectedRoute from '../redirection/ProtectedRoute';
import { apiDomain, axiosInstance } from '../../utils/Api';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, getWorkspaceAdmins,workspaceState } from './workspaceSliice';
import { AppDispatch } from '../../store/store';
import _get from "lodash/get";
import _map from "lodash/map";
import Dropdown from '../../components/dropdowns/index';
import Toast from '../../components/Toast';

// interface FormValues {
//   name: string;
//   email: string;
//   phone: string;
//   address: string;
//   logo: File | null;
//   owner: string;
//   admin: string;
//   isActive: boolean;
// }

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
  const dispatch:AppDispatch = useDispatch();
  const workspaceStateData = useSelector(workspaceState);
  console.log("ddd", workspaceStateData);
  const OPTIONS = _map(_get(workspaceStateData, "workspaceAdmins.data",[]), (data: User) => ({val: data?._id,label:data.fullname}))

  const triggerToast = (type: 'success' | 'info' | 'error', message: string) => {
    setToastType(type);
    setToastMessage(message);
    setShowToast(true);
  };
  
  useEffect(() => {
    dispatch(getWorkspaceAdmins());
    dispatch(fetchUser());
  }, [dispatch]);
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Workspace Form</h1>
      <Formik
        initialValues={{
          name: '',
          email: '',
          phone: '',
          address: '',
          logo: null,
          owner: '',
          admin: '',
          isActive: false,
        }}
        onSubmit={async (values, { setSubmitting }) => {
          const formdata = new FormData();
          formdata.append('name', values.name);
          formdata.append('email', values.email);
          formdata.append('phone', values.phone);
          formdata.append('address', values.address);
          formdata.append('owner', values.owner);
          formdata.append('admin',_get(workspaceStateData, "user.data._id") || "");

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
                // value={}
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
              <Dropdown label='Workspace Admin' name='owner' options={OPTIONS}/>
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

            <div className="flex items-center justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <Toast type={toastType} message={toastMessage} show={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
};

export default {path: "/create-workspace", element: <ProtectedRoute element={<CreateWorkspace />} />};
