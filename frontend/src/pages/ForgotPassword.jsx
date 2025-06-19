import React, { useState } from 'react';
import { toast } from 'react-toastify';
import BASE_URL from '../utils/config';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(''); // To show success/error messages on the page

  const handleChange = e => {
    setEmail(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(''); // Clear previous messages

    if (!email) {
      toast.warn('Please enter your email address.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/auth/forget-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(
          result.message || 'Password reset link sent. Please check your email.'
        );
        setMessage(
          'If an account with that email exists, a password reset link has been sent. Please check your inbox (and spam folder).'
        );
        setEmail(''); // Clear the input field
      } else {
        toast.error(
          result.message ||
            'Failed to send password reset link. Please try again.'
        );
        setMessage(result.message || 'An error occurred. Please try again.');
      }
    } catch (err) {
      console.error('Forgot Password error:', err);
      toast.error(
        'Server not responding or network error. Please try again later.'
      );
      setMessage(
        'Server not responding or network error. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-100">
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
            Forgot Password
          </h2>
          <p className="text-sm sm:text-base text-slate-500">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-BaseColor focus:border-transparent transition-shadow duration-150 ease-in-out shadow-sm placeholder-slate-400"
              value={email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          {message && (
            <p
              className={`text-sm ${message.includes('error') || message.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}
            >
              {message}
            </p>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex items-center justify-center px-6 py-3 my-3 border border-transparent text-base font-semibold rounded-lg shadow-md text-white bg-BaseColor hover:bg-BHoverColor focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-BaseColor disabled:opacity-60 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200 ease-in-out"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
            <p className="text-sm text-center text-slate-600">
              Remember your password?{' '}
              <Link
                className="font-medium text-BaseColor hover:text-BHoverColor hover:underline transition-colors duration-150 ease-in-out"
                to="/login"
              >
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
