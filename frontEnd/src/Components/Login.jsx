// src/Components/LoginForm.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });

      // Save token to localStorage
      localStorage.setItem('token', response.data.token);

      setSuccessMsg(response.data.message);

      // Redirect to author dashboard
      navigate('/author-dashboard');
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}
        {successMsg && <p className="text-green-500 mb-4">{successMsg}</p>}

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="login-email"
          >
            Email
          </label>
          <input
            type="email"
            id="login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Email"
            required
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="login-password"
          >
            Password
          </label>
          <input
            type="password"
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Password"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
