import React, { useState } from 'react'
import { Formik } from 'formik';

import _isEmpty from "lodash/isEmpty";
import _get from "lodash/get";

import Toast from '../../components/Toast';
import EMSApi from '../../utils/Api';
import Loader from '../../components/Loader';
import Input from '../../components/Input/CommonInput';
import { useNavigate } from 'react-router-dom';
import Checkbox from '../../components/Input/Checkbox';
import Button from '../../components/button';
import ProtectedRoute from '../redirection/ProtectedRoute';


export interface UserFormData {
  username: string;
  fullname: string;
  password: string;
  company: string;
  dob: string;
  dept: string;
  phone: string;
  experience: string;
  email: string;
  profilePhoto: File | null;
  doj: string;
  roll: string,
  address: string,
  companyAddress: string,
  isActive: boolean,
}
function EmployeeForm() {
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'info' | 'error'>('success');
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();

  const triggerToast = (type: 'success' | 'info' | 'error', message: string) => {
    setToastType(type);
    setToastMessage(message);
    setShowToast(true);
  };

  const onCancel = () => {
    navigate("/employee-list");
  }

  return (
    <Formik
      initialValues={{ username: "", fullname: "", password: "", company: "", dob: "", dept: "", phone: "", experience: "", email: "", doj: "", roll: '', address: '', companyAddress: '', isActive: false }}
      validate={values => {
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        const phoneRegex = /^(\+91[-\s]?)?[6-9]\d{9}$/;
        const userDOB = new Date(_get(values, "dob"));
        const today = new Date();

        const cutoffDate = new Date(
          today.getFullYear() - 18,
          today.getMonth(),
          today.getDate()
        );
        let err: string = "";
        if (values.email.length && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
          err = 'Invalid email address';
        } else if (values.email.length && values.username.length < 3) {
          err = 'Username must be at least 3 characters long.';
        } else if (values.username.length && !usernameRegex.test(_get(values, "username"))) {
          err = 'Username can only contain letters, numbers, and underscores.';
        } else if (values.password.length && !passwordRegex.test(_get(values, "password"))) {
          err = 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*).';
        } else if (values.dob.length && userDOB > cutoffDate) {
          err = 'User must be at least 18 years old.';
        } else if (values.phone.length && !phoneRegex.test(_get(values, "phone"))) {
          err = 'Please enter a valid  phone number.';
        }
        if (!_isEmpty(err)) {
          triggerToast("error", err);
        }
        return {};
      }}
      onSubmit={async (values, { setSubmitting }) => {
        // try {
        //   setSubmitting(true);
        //   const data = { ...values, role: "employee", isActive: true };
        //   const res = await EMSApi.registerUser.create(data);
        //   setSubmitting(false);
        //   console.log("checkkk ", res);
        //   if (_get(res, "data.statusCode") === 201 && _get(res, "data.success")) {
        //     triggerToast("success", _get(res, "data.message"));
        //     setTimeout(() => {
        //       navigate("/login");
        //     }, 3000);
        //   }
        // } catch (err) {
        //   console.error("err ", err);
        //   setSubmitting(false);
        // }
      }}
    >
      {({
        values,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Input
                labelClass="block text-gray-700 text-sm font-bold mb-2"
                classname="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                htmlfor="username"
                id="username"
                label='Username'
                name="username"
                type="text"
                required={true}
                val={values.username}
                handleBlur={handleBlur}
                handleChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <Input
                labelClass="block text-gray-700 text-sm font-bold mb-2"
                classname="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                htmlfor="name"
                id="name"
                label='Name'
                name="name"
                type="text"
                required={true}
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
                label='Email'
                name="email"
                type="email"
                required={true}
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
                label='Password'
                type="password"
                required={true}
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
                required={true}
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
                label='Date of Birth'
                type="date"
                required={true}
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
                label='Department'
                type="text"
                required={true}
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
                label='Phone'
                type="text"
                required={true}
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
                label='Experience'
                type="text"
                required={true}
                val={values.experience}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />
            </div>



            <div className="mb-4">
              <Input
                labelClass="block text-gray-700 text-sm font-bold mb-2"
                classname="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                htmlfor="doj"
                id="doj"
                name="doj"
                label='Joining Date'
                type="date"
                required={true}
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
                label='Address'
                type="text"
                required={true}
                val={values.address}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />
            </div>
            <div className="mb-4">
              <Input
                labelClass="block text-gray-700 text-sm font-bold mb-2"
                classname="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                htmlfor="componyAddress"
                id="componyAddress"
                name="componyAddress"
                label='Company Address'
                type="text"
                required={true}
                val={values.companyAddress}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />
            </div>

            <div className="mb-4">
              <Input
                labelClass="block text-gray-700 text-sm font-bold mb-2"
                classname="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                htmlfor="roll"
                id="roll"
                name="Roll"
                label='roll'
                type="text"
                required={true}
                val={values.roll}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />
            </div>


            <div className="mb-4">
              {/* <Input
                labelClass="block text-gray-700 text-sm font-bold mb-2"
                classname="shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                htmlfor="isActive"
                id="isActive"
                name="isActive"
                label='Is Active'
                type="checkbox"
                val={true}
                handleChange={handleChange}
                handleBlur={handleBlur}
                required={true}
              /> */}
              <Checkbox
                id="isActive"
                name="isActive"
                checked={values.isActive}
                onChange={handleChange}
                label="Is Active"
              />
            </div>


            <div className="flex items-center justify-around">
              <Button type='reset' variant='cancel' label='Cancel' onClick={onCancel} />
              <Button isLoading={isSubmitting} type='submit' variant='submit' />
            </div>
            <Toast type={toastType} message={toastMessage} show={showToast} onClose={() => setShowToast(false)} />
          </form>
        </div>

      )}
    </Formik>
  )
}

export default { path: "/create-employee", element: <ProtectedRoute element={<EmployeeForm />} /> }
