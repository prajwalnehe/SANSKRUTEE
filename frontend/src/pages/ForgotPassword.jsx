import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const resp = await api.forgotPassword({ email });
      // backend returns { message, token }
      if (resp?.token) setToken(resp.token);
      setIsSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
        <div className="flex h-screen">
          {/* Left Side - Logo */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-rose-100 via-pink-100 to-amber-100 items-center justify-center">
            <div className="text-center">
              <Link to="/" className="inline-block mb-8">
                <h1 className="text-6xl font-serif font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                  SANSKRUTEE
                </h1>
              </Link>
              <p className="text-xl text-gray-600 max-w-md mx-auto leading-relaxed">
                Discover the elegance of traditional Indian sarees. Your journey to timeless beauty starts here.
              </p>
            </div>
          </div>

          {/* Right Side - Success Message */}
          <div className="w-full lg:w-1/2 flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md text-center">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-neutral-100">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-serif font-semibold text-neutral-800 mb-4">
                  Check Your Email
                </h2>
                <p className="text-gray-600 mb-8">
                  We've sent a password reset link to <span className="font-medium">{email}</span>. Please check your inbox and follow the instructions to reset your password.
                </p>
                {token && (
                  <div className="mb-6 text-xs text-gray-600 break-all">
                    Temporary token (for testing): <span className="font-mono">{token}</span>
                  </div>
                )}
                <Link
                  to="/signin"
                  className="inline-block w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center"
                >
                  Back to Sign In
                </Link>
                <p className="mt-4 text-gray-500 text-sm">
                  Didn't receive the email?{' '}
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="text-rose-500 hover:text-rose-600 font-medium"
                  >
                    Resend
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <div className="flex h-screen">
        {/* Left Side - Logo */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-rose-100 via-pink-100 to-amber-100 items-center justify-center">
          <div className="text-center">
            <Link to="/" className="inline-block mb-8">
              <h1 className="text-6xl font-serif font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                PARIDHAAN
              </h1>
            </Link>
            <p className="text-xl text-gray-600 max-w-md mx-auto leading-relaxed">
              Discover the elegance of traditional Indian sarees. Your journey to timeless beauty starts here.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <Link to="/" className="inline-block mb-6">
                <h1 className="text-3xl font-serif font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                  SANSKRUTEE
                </h1>
              </Link>
            </div>

            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-semibold text-neutral-800 mb-2">
                Forgot Password
              </h2>
              <p className="text-gray-600">
                Enter your email and we'll send you a link to reset your password
              </p>
            </div>

            {/* Forgot Password Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-neutral-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (<div className="text-sm text-red-600">{error}</div>)}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-60"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              {/* Back to Sign In */}
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Remember your password?{' '}
                  <Link
                    to="/signin"
                    className="text-rose-500 hover:text-rose-600 font-semibold transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
