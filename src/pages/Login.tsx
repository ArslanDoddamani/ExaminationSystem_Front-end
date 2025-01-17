import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/api';
import { GraduationCap } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    USN: '',
    password: ''
  });
  const [error, setError] = useState('');
  // const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await auth.login(formData.USN, formData.password);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.user.role);
      console.log(response.data)
      localStorage.setItem('usn', response.data.user.USN);
      navigate(`/${response.data.user.role}`);
    } catch (error) {
      setError('Invalid credentials');
    }
  };

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <GraduationCap className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-center">{error}</div>}
          <div>
            <label
              htmlFor="USN"
              className="block text-md font-medium text-gray-300"
            >
              USN
            </label>
            <input
              type="text"
              name="USN"
              id="USN"
              className="mt-1 block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
              placeholder="USN"
              value={formData.USN}
              onChange={(e) => setFormData({ ...formData, USN: e.target.value })}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-md font-medium text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="mt-1 block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <div>
            <button
              type="submit"
              className="mt-8 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>
        </form>

        <div>
          <button
            type="button"
            onClick={handleBackClick}
            className="mt-4 text-sm text-blue-500"
          >
            Go Back!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
