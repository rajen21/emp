import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { AppDispatch } from '../../store/store';
import { fetchUser, homeState } from '../home/homeSlice';
import ProtectedRoute from '../redirection/ProtectedRoute';
import { Empployee } from '../employee/employeeSlice';
import Checkbox from '../../components/Input/Checkbox';
import Loader from '../../components/Loader';


const UserProfileComponent: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { data, error, isLoading } = useSelector(homeState);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

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

  const handleSubmit = (values: Empployee) => {
    console.log('Form Data:', values);
    // Handle form submission (e.g., dispatch an update action)
  };

  if (isLoading) return <Loader classNames='border-blue-500 h-20 w-20' />

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">User Profile</h2>
      {data?.profilePhoto && 
      <img src={data?.profilePhoto} width={200} height={200} alt='profile' /> }
      <Formik
        initialValues={data || initialValues}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting, handleChange }) => (
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
              <label className="block text-sm font-medium mb-1" htmlFor="profilePhoto">Profile Photo</label>
              <Field
                type="file"
                name="profilePhoto"
                className="w-full border border-gray-300 rounded-md p-2"
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              Update Profile
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default { path: "/profile", element: <ProtectedRoute element={<UserProfileComponent />} /> };
