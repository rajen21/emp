import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { AppDispatch } from '../../store/store';
import { fetchUser, homeState } from '../home/homeSlice';
import ProtectedRoute from '../redirection/ProtectedRoute';
import { Empployee } from '../employee/employeeSlice';
import Checkbox from '../../components/Input/Checkbox';
import Loader from '../../components/Loader';
import ProfilePhoto from '../../components/profile';
import EMSApi from '../../utils/Api';
import _get from "lodash/get";
import Toast from '../../components/Toast';
import Button from '../../components/button';


const UserProfileComponent: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<"success" | "info" | "error">("success");
  const [toastMessage, setToastMessage] = useState("");
  const dispatch: AppDispatch = useDispatch();
  const { data, error, isLoading } = useSelector(homeState);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const triggerToast = (
    type: "success" | "info" | "error",
    message: string
  ) => {
    setToastType(type);
    setToastMessage(message);
    setShowToast(true);
  };

  const initialValues: Empployee = {
    _id: "",
    username: '',
    email: '',
    fullname: '',
    password: '',
    phone: '',
    role: '',
    experience: 0,
    profilePhoto: '',
    company: '',
    dob: '',
    dept: '',
    company_address: '',
    address: '',
    doj: '',
    isActive: true,
  };

  if (isLoading) return <Loader classNames='border-blue-500 h-20 w-20' />;


  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">User Profile</h2>
      {data?.profilePhoto &&
        // <img src={data?.profilePhoto} width={200} height={200} alt='profile' />
        <ProfilePhoto imageUrl={data?.profilePhoto} />
      }
      <Formik
        initialValues={data || initialValues}
        onSubmit={async (values: Empployee, { setSubmitting }) => {
          setSubmitting(true);
          console.log('Form Data:', values);
          const formdata = new FormData();
          formdata.append("username", values.username);
          formdata.append("email", values.email);
          formdata.append("fullname", values.fullname);
          if (values.password) {
            formdata.append("password", values.password);
          }
          formdata.append("phone", values.phone);
          formdata.append("role", values.role);

          formdata.append("experience", values.experience.toString());
          if (values.profilePhoto) {
            formdata.append("profilePhoto", values.profilePhoto);
          }
          formdata.append("company", values.company);
          formdata.append("dob", values.dob);
          formdata.append("dept", values.dept);
          if (values.company_address) {
            formdata.append("company_address", values.company_address);
          }
          formdata.append("address", values.address);
          formdata.append("doj", values.doj);
          formdata.append("isActive", values.isActive.toString());

          try {
            const query = {
              params: {
                _id: data?._id
              }
            }
            const res = await EMSApi.user.updateUser(formdata, query);
            setSubmitting(false);
            if (_get(res, "data.success")) {
              triggerToast("success", _get(res, "data.message"))
            } else {
              triggerToast("error", _get(res, "data.messafe"))
            }
          } catch (err) {
            console.error("error:::::", err);
            // triggerToast("error", err.message);
            setSubmitting(false);

          }
        }}
      >
        {({ values, isSubmitting, handleChange, setFieldValue }) => (
          <Form>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="username">Username</label>
              <Field
                type="text"
                name="username"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
              <Field
                type="email"
                name="email"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="fullname">Full Name</label>
              <Field
                type="text"
                name="fullname"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
              <Field
                type="password"
                name="password"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="phone">Phone</label>
              <Field
                type="text"
                name="phone"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="role">Role</label>
              <Field
                type="text"
                name="role"
                className="w-full border border-gray-300 rounded-md p-2"
                disabled
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="experience">Experience</label>
              <Field
                type="text"
                name="experience"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="logo">
                Profile Photo
              </label>
              <input
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
              <label className="block text-sm font-medium mb-1" htmlFor="company">Company</label>
              <Field
                type="text"
                name="company"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="dob">Date of Birth</label>
              <Field
                type="date"
                name="dob"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="department">Department</label>
              <Field
                type="text"
                name="dept"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="companyAddress">Company Address</label>
              <Field
                type="text"
                name="company_address"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="address">Address</label>
              <Field
                type="text"
                name="address"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="doj">Date of Joining</label>
              <Field
                type="date"
                name="doj"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-4">
              <Checkbox
                id="isActive"
                name="isActive"
                checked={values.isActive}
                onChange={handleChange}
                label="Is Active"
                disabled={true}
              />
            </div>

            <Button
              isLoading={isSubmitting}
              label='Update Profile'
              type='submit'
              variant='submit'
            />
          </Form>
        )}
      </Formik>
      <Toast
        type={toastType}
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default { path: "/profile", element: <ProtectedRoute element={<UserProfileComponent />} /> };
