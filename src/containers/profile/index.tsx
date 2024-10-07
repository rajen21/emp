import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { AppDispatch } from '../../store/store';
import { fetchUser, homeState } from '../home/homeSlice';
import ProtectedRoute from '../redirection/ProtectedRoute';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  password: string;
  phone: string;
  role: string;
  experience: string;
  profilePhoto: string;
  company: string;
  dob: string; // Use Date if you want to handle it as a Date object
  department: string;
  companyAddress: string;
  address: string;
  doj: string; // Use Date if you want to handle it as a Date object
  isActive: boolean;
}

const UserProfileComponent: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { data, error, isLoading } = useSelector(homeState);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const initialValues: UserProfile = {
    id: '',
    username: '',
    email: '',
    fullName: '',
    password: '',
    phone: '',
    role: '',
    experience: '',
    profilePhoto: '',
    company: '',
    dob: '',
    department: '',
    companyAddress: '',
    address: '',
    doj: '',
    isActive: true,
  };

  const handleSubmit = (values: UserProfile) => {
    console.log('Form Data:', values);
    // Handle form submission (e.g., dispatch an update action)
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching user details: {error}</p>;
console.log(data);

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">User Profile</h2>
      <Formik
        initialValues={data || initialValues}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="username">Username</label>
              <Field
                type="text"
                name="username"
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <ErrorMessage name="username" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
              <Field
                type="email"
                name="email"
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="fullName">Full Name</label>
              <Field
                type="text"
                name="fullName"
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <ErrorMessage name="fullName" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
              <Field
                type="password"
                name="password"
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="phone">Phone</label>
              <Field
                type="text"
                name="phone"
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="role">Role</label>
              <Field
                type="text"
                name="role"
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <ErrorMessage name="role" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="experience">Experience</label>
              <Field
                type="text"
                name="experience"
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <ErrorMessage name="experience" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="profilePhoto">Profile Photo URL</label>
              <Field
                type="text"
                name="profilePhoto"
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <ErrorMessage name="profilePhoto" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="company">Company</label>
              <Field
                type="text"
                name="company"
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <ErrorMessage name="company" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="dob">Date of Birth</label>
              <Field
                type="date"
                name="dob"
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <ErrorMessage name="dob" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="department">Department</label>
              <Field
                type="text"
                name="department"
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <ErrorMessage name="department" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="companyAddress">Company Address</label>
              <Field
                type="text"
                name="companyAddress"
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <ErrorMessage name="companyAddress" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="address">Address</label>
              <Field
                type="text"
                name="address"
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="doj">Date of Joining</label>
              <Field
                type="date"
                name="doj"
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <ErrorMessage name="doj" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="isActive">Is Active</label>
              <Field as="select" name="isActive" className="w-full border border-gray-300 rounded-md p-2">
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Field>
              <ErrorMessage name="isActive" component="div" className="text-red-500 text-sm" />
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

export default {path: "/profile", element: <ProtectedRoute element={<UserProfileComponent />} />};
