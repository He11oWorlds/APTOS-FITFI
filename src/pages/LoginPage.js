import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PetraLoginButton from '../components/PetraLoginButton';
import FitFiLogo from '../FitFi.png';

export default function LoginPage() {
  const navigate = useNavigate();

  // 🔒 Proper redirect on load if already logged in
  useEffect(() => {
    const user = localStorage.getItem('fitfi_user');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
        <img src={FitFiLogo} alt="FitFi Logo" className="mx-auto mb-4 w-16 h-16" />

        <h2 className="text-2xl font-bold text-center mb-2">Log in or sign up</h2>
        <p className="text-sm text-center text-gray-600 mb-4">
          with Social + Aptos Connect
        </p>

        <button
          disabled
          className="w-full bg-gray-200 text-gray-500 font-medium py-2 rounded-md flex items-center justify-center mb-4"
        >
          <span className="mr-2">🔒</span> For Future Development
        </button>

        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="px-2 text-sm text-gray-500">or</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        <PetraLoginButton />

        <p className="text-xs text-gray-500 text-center mt-4">
          By continuing, you agree to Aptos Labs{' '}
          <a
            href="https://aptos.dev/privacy"
            className="underline hover:text-blue-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>.
        </p>

        <p className="text-xs text-gray-400 text-center mt-1">
          Powered by <span className="font-semibold">Aptos Labs</span>
        </p>
      </div>
    </div>
  );
}
