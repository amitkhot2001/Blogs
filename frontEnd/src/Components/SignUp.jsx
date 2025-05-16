import React, { useState } from 'react';
import axios from 'axios';

const SignUpForm = ({ defaultRole = 'Author' }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [role] = useState(defaultRole);
  const [step, setStep] = useState(1); // 1: form, 2: OTP
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordStrong = (password) => password.length >= 6;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/request-otp', {
        fullName,
        email,
        password,
        role,
      });

      setSuccessMessage(response.data.message);
      setStep(2); // move to OTP step

    } catch (error) {
      console.error(error);
      setErrorMessage(error.response?.data?.error || 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/verify-otp', {
        email,
        otp,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      setSuccessMessage('Signup complete! Welcome 🎉');
      setFullName('');
      setEmail('');
      setPassword('');
      setOtp('');
      setStep(1);

    } catch (error) {
      console.error(error);
      setErrorMessage(error.response?.data?.error || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => fullName && isEmailValid(email) && isPasswordStrong(password);
  const isOtpValid = () => otp.length === 6;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp}
        className="w-full max-w-md p-6 bg-white shadow rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          {step === 1 ? 'Sign Up' : 'Enter OTP'}
        </h2>

        {errorMessage && <p className="text-red-500 mb-4 text-center">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 mb-4 text-center">{successMessage}</p>}

        {step === 1 ? (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!isFormValid() || loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={!isOtpValid() || loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              {loading ? 'Verifying...' : 'Verify & Complete Signup'}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default SignUpForm;
