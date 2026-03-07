import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { APIError } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import OtpVerification from './OtpVerification';
import { useToast } from '../common/Toast';

const Signup = () => {
  const { signup, completeOtpLogin } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '',
    localPhone: '', bvn: '', nin: '', dateOfBirth: '', password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [otpState, setOtpState] = useState(null);
  const [success, setSuccess] = useState(false);

  const fullPhone = formData.localPhone ? `+234${formData.localPhone}` : '';

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processed = value;

    if (name === 'localPhone') {
      processed = value.replace(/\D/g, '').slice(0, 10);
    } else if (name === 'bvn' || name === 'nin') {
      processed = value.replace(/\D/g, '').slice(0, 11);
    } else if (name === 'dateOfBirth') {
      // Auto-format YYYY-MM-DD
      const digits = value.replace(/\D/g, '').slice(0, 8);
      if (digits.length > 6) processed = `${digits.slice(0,4)}-${digits.slice(4,6)}-${digits.slice(6)}`;
      else if (digits.length > 4) processed = `${digits.slice(0,4)}-${digits.slice(4)}`;
      else processed = digits;
    }

    setFormData(prev => ({ ...prev, [name]: processed }));
    setFieldErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  };

  const validate = () => {
    const errors = {};
    if (!formData.firstName.trim() || formData.firstName.trim().length < 2) errors.firstName = 'First name must be at least 2 characters';
    if (!formData.lastName.trim() || formData.lastName.trim().length < 2) errors.lastName = 'Last name must be at least 2 characters';
    if (!formData.email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) errors.email = 'Please enter a valid email address';
    if (!formData.localPhone || formData.localPhone.length < 10) errors.localPhone = 'Enter a valid 10-digit number';
    if (!formData.bvn || formData.bvn.length !== 11) errors.bvn = `BVN must be exactly 11 digits (${formData.bvn.length}/11)`;
    if (!formData.nin || formData.nin.length !== 11) errors.nin = `NIN must be exactly 11 digits (${formData.nin.length}/11)`;
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
    } else {
      const birth = new Date(formData.dateOfBirth);
      const age = new Date().getFullYear() - birth.getFullYear();
      if (isNaN(birth.getTime())) errors.dateOfBirth = 'Enter a valid date (YYYY-MM-DD)';
      else if (age < 18) errors.dateOfBirth = 'You must be at least 18 years old';
    }
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) errors.password = 'Password must contain uppercase, lowercase, and number';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      document.getElementsByName(Object.keys(errors)[0])[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    try {
      setIsLoading(true);
      const result = await signup({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneNumber: fullPhone,
        bvn: formData.bvn,
        nin: formData.nin,
        dateOfBirth: formData.dateOfBirth,
        password: formData.password,
      });
      if (result?.requiresOtp) {
        setOtpState({ userId: result.userId, phoneNumber: result.phoneNumber, devOtp: result.devOtp });
      }
    } catch (err) {
      if (err instanceof APIError) {
        toast.error(err.message);
        if (err.errors?.length > 0) {
          const fe = {};
          err.errors.forEach(e => { fe[e.field] = e.message; });
          setFieldErrors(fe);
        }
      } else if (err instanceof APIError && err.statusCode === 429) {
        toast.error('Too many attempts. Please wait 15 minutes before trying again.');
      } else {
        toast.error('An unexpected error occurred. Please try again.');
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
        <h3 className="text-xl font-semibold text-deepBlue-800 mb-2">Account Created!</h3>
        <p className="text-deepBlue-600 mb-2">Your wallet has been created automatically.</p>
        <LoadingSpinner size="md" text="Redirecting to dashboard..." />
      </div>
    );
  }

  if (otpState) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-deepBlue-800 text-center mb-2">Verify Your Phone</h3>
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

  const hasErr = (f) => !!fieldErrors[f];
  const getErr = (f) => fieldErrors[f];
  const inputCls = (f) => `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
    hasErr(f) ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-deepBlue-200 focus:ring-deepBlue-500'
  }`;

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="grid grid-cols-2 gap-4">
          {[['firstName', 'First Name', 'John', 'given-name'], ['lastName', 'Last Name', 'Doe', 'family-name']].map(([name, label, ph, ac]) => (
            <div key={name}>
              <label className="block text-sm font-medium text-deepBlue-700 mb-2">{label} *</label>
              <input type="text" name={name} value={formData[name]} onChange={handleChange} placeholder={ph} className={inputCls(name)} disabled={isLoading} autoComplete={ac} />
              {hasErr(name) && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{getErr(name)}</p>}
            </div>
          ))}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-deepBlue-700 mb-2">Email Address *</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className={inputCls('email')} disabled={isLoading} autoComplete="email" />
          {hasErr('email') && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{getErr('email')}</p>}
        </div>

        {/* Phone with +234 prefix */}
        <div>
          <label className="block text-sm font-medium text-deepBlue-700 mb-2">Phone Number *</label>
          <div className={`flex items-center border rounded-lg overflow-hidden transition duration-200 ${hasErr('localPhone') ? 'border-red-500 bg-red-50' : 'border-deepBlue-200'}`}>
            <span className="px-3 py-3 bg-gray-50 border-r border-deepBlue-200 text-sm font-medium text-deepBlue-700 whitespace-nowrap">🇳🇬 +234</span>
            <input type="tel" name="localPhone" value={formData.localPhone} onChange={handleChange} placeholder="8012345678" className="flex-1 px-3 py-3 focus:outline-none bg-transparent" disabled={isLoading} maxLength={10} />
          </div>
          {hasErr('localPhone') ? <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{getErr('localPhone')}</p>
            : <p className="text-xs text-deepBlue-500 mt-1 flex items-center gap-1"><Info className="w-3 h-3" />10-digit number after +234</p>}
        </div>

        {/* BVN */}
        <div>
          <label className="block text-sm font-medium text-deepBlue-700 mb-2">BVN *</label>
          <input type="text" name="bvn" value={formData.bvn} onChange={handleChange} placeholder="12345678901" maxLength={11} className={inputCls('bvn')} disabled={isLoading} />
          {hasErr('bvn') ? <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{getErr('bvn')}</p>
            : <p className="text-xs text-deepBlue-500 mt-1">11-digit Bank Verification Number ({formData.bvn.length}/11)</p>}
        </div>

        {/* NIN */}
        <div>
          <label className="block text-sm font-medium text-deepBlue-700 mb-2">NIN *</label>
          <input type="text" name="nin" value={formData.nin} onChange={handleChange} placeholder="12345678901" maxLength={11} className={inputCls('nin')} disabled={isLoading} />
          {hasErr('nin') ? <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{getErr('nin')}</p>
            : <p className="text-xs text-deepBlue-500 mt-1">11-digit National Identification Number ({formData.nin.length}/11)</p>}
        </div>

        {/* DOB with auto-format */}
        <div>
          <label className="block text-sm font-medium text-deepBlue-700 mb-2">Date of Birth *</label>
          <input type="text" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} placeholder="YYYY-MM-DD" maxLength={10} className={inputCls('dateOfBirth')} disabled={isLoading} inputMode="numeric" />
          {hasErr('dateOfBirth') ? <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{getErr('dateOfBirth')}</p>
            : <p className="text-xs text-deepBlue-500 mt-1">You must be at least 18 years old</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-deepBlue-700 mb-2">Password *</label>
          <div className={`relative border rounded-lg transition duration-200 ${hasErr('password') ? 'border-red-500 bg-red-50' : 'border-deepBlue-200'}`}>
            <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Create a strong password" className="w-full px-4 py-3 focus:outline-none bg-transparent pr-12 rounded-lg" disabled={isLoading} autoComplete="new-password" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-deepBlue-400 hover:text-deepBlue-600" tabIndex={-1}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {hasErr('password') ? <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{getErr('password')}</p>
            : <p className="text-xs text-deepBlue-500 mt-1">At least 6 characters with uppercase, lowercase, and number</p>}
        </div>

        <button type="submit" disabled={isLoading} className={`w-full py-3 rounded-lg font-semibold transition duration-200 ${isLoading ? 'bg-deepBlue-300 cursor-not-allowed' : 'bg-deepBlue-600 hover:bg-deepBlue-700 text-white'}`}>
          {isLoading ? <div className="flex items-center justify-center gap-2"><LoadingSpinner size="sm" text="" /><span>Creating Account...</span></div> : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default Signup;
