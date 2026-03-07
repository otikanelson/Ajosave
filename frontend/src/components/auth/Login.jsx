import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { APIError } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import OtpVerification from './OtpVerification';
import { useToast } from '../common/Toast';

const Login = () => {
  const { login, completeOtpLogin } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({ localPhone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [otpState, setOtpState] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('rememberedPhone');
    if (saved) setFormData(prev => ({ ...prev, localPhone: saved.replace(/^\+234/, '') }));
  }, []);

  const fullPhone = formData.localPhone ? `+234${formData.localPhone}` : '';

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'localPhone') {
      const digits = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, localPhone: digits }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setFieldErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  };

  const validate = () => {
    const errors = {};
    if (!formData.localPhone) errors.localPhone = 'Phone number is required';
    else if (formData.localPhone.length < 10) errors.localPhone = 'Enter a valid 10-digit number';
    if (!formData.password) errors.password = 'Password is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }

    try {
      setIsLoading(true);
      const result = await login({ phoneNumber: fullPhone, password: formData.password });
      if (result?.requiresOtp) {
        setOtpState({ userId: result.userId, phoneNumber: result.phoneNumber, devOtp: result.devOtp });
      }
    } catch (err) {
      if (err instanceof APIError && err.statusCode === 401) {
        toast.error('Invalid phone number or password');
        setFieldErrors({ localPhone: ' ', password: ' ' });
      } else if (err instanceof APIError && err.statusCode === 429) {
        toast.error('Too many attempts. Please wait 15 minutes before trying again.');
      } else {
        toast.error(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSuccess = ({ user, token }) => {
    completeOtpLogin(user, token);
    setSuccess(true);
    // Navigation is handled by Auth.jsx useEffect watching isAuthenticated
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-deepBlue-800 mb-2">Login Successful!</h3>
        <LoadingSpinner size="md" text="Loading your dashboard..." />
      </div>
    );
  }

  if (otpState) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-deepBlue-800 text-center mb-2">Verify Your Identity</h3>
        <OtpVerification
          userId={otpState.userId}
          phoneNumber={otpState.phoneNumber}
          devOtp={otpState.devOtp}
          onSuccess={handleOtpSuccess}
          onBack={() => setOtpState(null)}
        />
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Phone Number with +234 prefix */}
        <div>
          <label className="block text-sm font-medium text-deepBlue-700 mb-2">Phone Number</label>
          <div className={`flex items-center border rounded-lg overflow-hidden transition duration-200 ${
            fieldErrors.localPhone ? 'border-red-500 bg-red-50' : 'border-deepBlue-200'
          }`}>
            <span className="px-3 py-3 bg-gray-50 border-r border-deepBlue-200 text-sm font-medium text-deepBlue-700 whitespace-nowrap">
              🇳🇬 +234
            </span>
            <input
              type="tel"
              name="localPhone"
              value={formData.localPhone}
              onChange={handleChange}
              placeholder="8012345678"
              className="flex-1 px-3 py-3 focus:outline-none bg-transparent"
              disabled={isLoading}
              autoComplete="tel"
              maxLength={10}
            />
          </div>
          {fieldErrors.localPhone?.trim() && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />{fieldErrors.localPhone}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-deepBlue-700 mb-2">Password</label>
          <div className={`relative border rounded-lg transition duration-200 ${
            fieldErrors.password ? 'border-red-500 bg-red-50' : 'border-deepBlue-200'
          }`}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-3 focus:outline-none bg-transparent pr-12 rounded-lg"
              disabled={isLoading}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-deepBlue-400 hover:text-deepBlue-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {fieldErrors.password?.trim() && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />{fieldErrors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-lg font-semibold transition duration-200 ${
            isLoading ? 'bg-deepBlue-300 cursor-not-allowed' : 'bg-deepBlue-600 hover:bg-deepBlue-700 text-white'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <LoadingSpinner size="sm" text="" /><span>Logging in...</span>
            </div>
          ) : 'Log In'}
        </button>

        <div className="text-center">
          <button type="button" className="text-deepBlue-600 text-sm hover:underline" disabled={isLoading}>
            Forgot Password?
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
