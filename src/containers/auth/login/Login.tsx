import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import _get from "lodash/get";

import EMSApi from '../../../utils/Api';
import Loader from "../../../components/Loader/index";
import RedirectIfAuthenticated from '../../redirection/RedirectIfAuthenticated';
import Toast from '../../../components/Toast';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'info' | 'error'>('success');
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();

  const triggerToast = (type: 'success' | 'info' | 'error', message: string) => {
    setToastType(type);
    setToastMessage(message);
    setShowToast(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }
      setError('');
      const cred = {
        username: email,
        email,
        password
      };

      const response = await EMSApi.auth.login(cred);
      const data = _get(response, "data", null);

      if (_get(data, "statusCode", 0) === 200 && _get(data, "success", false)) {
        navigate("/");
      } else if (_get(data, "statusCode") >= 400 && !_get(data, "success")){
        triggerToast("error", _get(data,"message"));
      }
      setIsLoading(false);
    } catch (err) {
      const error = err as Error;
      console.error("erorr:::", err);
      setIsLoading(false);
      triggerToast("error", error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-xs">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email / Username
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isLoading ? <Loader /> : "Log In"}
            </button>
          </div>
          <div className='flex items-center justify-center'>
            <span className=' text-xs mt-1 cursor-pointer' onClick={() => {navigate("/registration-form")}}>
              Register User
            </span>
          </div>
          <Toast type={toastType} message={toastMessage} show={showToast} onClose={() => setShowToast(false)} />

        </form>
      </div>
    </div>
  );
};

export default { path: "/login", element: <RedirectIfAuthenticated element={<LoginForm />} /> };
