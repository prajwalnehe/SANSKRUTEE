import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const resp = await api.signin({ email: formData.email, password: formData.password });
      // store token then redirect to intended page or home
      if (resp?.token) localStorage.setItem('auth_token', resp.token);
      if (resp?.user?.isAdmin) {
        localStorage.setItem('auth_is_admin', 'true');
      } else {
        try { localStorage.removeItem('auth_is_admin'); } catch {}
      }
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">
      <div className="flex h-screen">
        {/* Left Side - Logo */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 items-center justify-center">
          <div className="text-center">
            <Link to="/" className="inline-block mb-8">
              <h1 className="text-5xl font-serif font-bold text-black">
                SANSKRUTEE
              </h1>
            </Link>
            <p className="text-lg text-gray-600 max-w-sm mx-auto leading-relaxed">
              Discover premium Fashion crafted for comfort and style.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center py-8 px-4">
          <div className="w-full max-w-sm">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-6">
              <Link to="/" className="inline-block mb-6">
                <h1 className="text-2xl font-serif font-bold text-black">
                  SANSKRUTEE
                </h1>
              </Link>
            </div>

            {/* Form Header */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-serif font-semibold text-neutral-800 mb-1">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Sign in to your account to continue shopping
              </p>
            </div>

            {/* Sign In Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-neutral-100">
              {error && (<div className="mb-4 text-sm text-red-600">{error}</div>)}
              {success && (<div className="mb-4 text-sm text-green-600">{success}</div>)}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-rose-500 focus:ring-rose-400 border-neutral-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-rose-500 hover:text-rose-600 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(location.state?.from?.pathname || '/')}
                  className="w-full mt-2 border border-neutral-200 text-neutral-700 py-2 rounded-lg font-semibold hover:bg-neutral-50 transition-all duration-300"
                >
                  Continue as Guest
                </button>
              </form>

              {/* Divider */}
              <div className="mt-6 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>
              </div>

              {/* Social Login */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7000';
                    window.location.href = `${BACKEND_URL}/api/auth/google`;
                  }}
                  className="flex items-center justify-center w-full px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Googlee
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="text-rose-500 hover:text-rose-600 font-semibold transition-colors"
                  >
                    Sign up here
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

export default SignIn;