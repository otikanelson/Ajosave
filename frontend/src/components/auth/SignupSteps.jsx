import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle, AlertCircle, Info, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { APIError } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import OtpVerification from './OtpVerification';
import { useToast } from '../common/Toast';

const SignupSteps = () => {
  const { signup, completeOtpLogin } = useAuth();
  const toast = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '',
    localPhone: '', password: '', showPassword: false,
  });
  const [kycData, setKycData] = useState({
    bvn: '', nin: '', dateOfBirth: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState({});
  const [otpState, setOtpState] = useState(null);
  const [success, setSuccess] = useState(false);

  const fullPhone = formData.localPhone ? `+234${formData.localPhone}` : '';

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processed = value;

    if (name === 'localPhone') {
      processed = value.replace(/\D/g, '').slice(0, 10);
    } else if (name === 'dateOfBirth') {
      const digits = value.replace(/\D/g, '').slice(0, 8);
      if (digits.length > 6) processed = `${digits.slice(0,4)}-${digits.slice(4,6)}-${digits.slice(6)}`;
      else if (digits.length > 4) processed = `${digits.slice(0,4)}-${digits.slice(4)}`;
      else processed = digits;
    }

    if (name === 'showPassword') {
      setFormData(prev => ({ ...prev, [name]: !prev[name] }));
    } else if (['bvn', 'nin', 'dateOfBirth'].includes(name)) {
      if (name === 'bvn' || name === 'nin') {
        processed = value.replace(/\D/g, '').slice(0, 11);
      }
      setKycData(prev => ({ ...prev, [name]: processed }));
      setFieldErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    } else {
      setFormData(prev => ({ ...prev, [name]: processed }));
      setFieldErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    }
  };

  const validateStep1 = () => {
    const errors = {};
    if (!formData.firstName.trim() || formData.firstName.trim().length < 2) errors.firstName = 'First name must be at least 2 characters';
    if (!formData.lastName.trim() || formData.lastName.trim().length < 2) errors.lastName = 'Last name must be at least 2 characters';
    if (!formData.email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) errors.email = 'Please enter a valid email address';
    if (!formData.localPhone || formData.localPhone.length < 10) errors.localPhone = 'Enter a valid 10-digit number';
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) errors.password = 'Password must contain uppercase, lowercase, and number';
    return errors;
  };

  const validateStep2 = () => {
    const errors = {};
    if (!kycData.bvn || kycData.bvn.length !== 11) errors.bvn = `BVN must be exactly 11 digits (${kycData.bvn.length}/11)`;
    if (!kycData.nin || kycData.nin.length !== 11) errors.nin = `NIN must be exactly 11 digits (${kycData.nin.length}/11)`;
    if (!kycData.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
    } else {
      const birth = new Date(kycData.dateOfBirth);
      const age = new Date().getFullYear() - birth.getFullYear();
      if (isNaN(birth.getTime())) errors.dateOfBirth = 'Enter a valid date (YYYY-MM-DD)';
      else if (age < 18) errors.dateOfBirth = 'You must be at least 18 years old';
    }
    return errors;
  };

  const handleVerifyBVN = async () => {
    if (!kycData.bvn || kycData.bvn.length !== 11) {
      setFieldErrors(prev => ({ ...prev, bvn: 'BVN must be 11 digits' }));
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-bvn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bvn: kycData.bvn }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'BVN verification failed');

      setVerificationStatus(prev => ({ ...prev, bvn: { verified: true, data: data.data } }));
      toast.success('BVN verified successfully');
    } catch (err) {
      toast.error(err.message || 'BVN verification failed');
      setFieldErrors(prev => ({ ...prev, bvn: err.message }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyNIN = async () => {
    if (!kycData.nin || kycData.nin.length !== 11) {
      setFieldErrors(prev => ({ ...prev, nin: 'NIN must be 11 digits' }));
      return;
    }
    if (!kycData.dateOfBirth) {
      setFieldErrors(prev => ({ ...prev, dateOfBirth: 'Date of birth is required' }));
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-nin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nin: kycData.nin, dateOfBirth: kycData.dateOfBirth }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'NIN verification failed');

      setVerificationStatus(prev => ({ ...prev, nin: { verified: true, data: data.data } }));
      toast.success('NIN verified successfully');
    } catch (err) {
      toast.error(err.message || 'NIN verification failed');
      setFieldErrors(prev => ({ ...prev, nin: err.message }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = async () => {
    if (currentStep === 1) {
      const errors = validateStep1();
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const errors = validateStep2();
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }
      setCurrentStep(3);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep !== 3) return;

    try {
      setIsLoading(true);
      const result = await signup({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneNumber: fullPhone,
        bvn: kycData.bvn,
        nin: kycData.nin,
        dateOfBirth: kycData.dateOfBirth,
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
      {/* Step Indicator */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition duration-200 ${
              step < currentStep ? 'bg-green-500 text-white' :
              step === currentStep ? 'bg-deepBlue-600 text-white' :
              'bg-deepBlue-100 text-deepBlue-600'
            }`}>
              {step < currentStep ? <CheckCircle size={20} /> : step}
            </div>
            {step < 3 && (
              <div className={`flex-1 h-1 mx-2 transition duration-200 ${
                step < currentStep ? 'bg-green-500' : 'bg-deepBlue-100'
              }`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <>
            <h2 className="text-2xl font-bold text-deepBlue-800 mb-6">Create Your Account</h2>
            
            <div className="grid grid-cols-2 gap-4">
              {[['firstName', 'First Name', 'John', 'given-name'], ['lastName', 'Last Name', 'Doe', 'family-name']].map(([name, label, ph, ac]) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-deepBlue-700 mb-2">{label} *</label>
                  <input type="text" name={name} value={formData[name]} onChange={handleChange} placeholder={ph} className={inputCls(name)} disabled={isLoading} autoComplete={ac} />
                  {hasErr(name) && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{getErr(name)}</p>}
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-deepBlue-700 mb-2">Email Address *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className={inputCls('email')} disabled={isLoading} autoComplete="email" />
              {hasErr('email') && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{getErr('email')}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-deepBlue-700 mb-2">Phone Number *</label>
              <div className={`flex items-center border rounded-lg overflow-hidden transition duration-200 ${hasErr('localPhone') ? 'border-red-500 bg-red-50' : 'border-deepBlue-200'}`}>
                <span className="px-3 py-3 bg-gray-50 border-r border-deepBlue-200 text-sm font-medium text-deepBlue-700 whitespace-nowrap">🇳🇬 +234</span>
                <input type="tel" name="localPhone" value={formData.localPhone} onChange={handleChange} placeholder="8012345678" className="flex-1 px-3 py-3 focus:outline-none bg-transparent" disabled={isLoading} maxLength={10} />
              </div>
              {hasErr('localPhone') ? <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{getErr('localPhone')}</p>
                : <p className="text-xs text-deepBlue-500 mt-1 flex items-center gap-1"><Info className="w-3 h-3" />10-digit number after +234</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-deepBlue-700 mb-2">Password *</label>
              <div className={`relative border rounded-lg transition duration-200 ${hasErr('password') ? 'border-red-500 bg-red-50' : 'border-deepBlue-200'}`}>
                <input type={formData.showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Create a strong password" className="w-full px-4 py-3 focus:outline-none bg-transparent pr-12 rounded-lg" disabled={isLoading} autoComplete="new-password" />
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, showPassword: !prev.showPassword }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-deepBlue-400 hover:text-deepBlue-600" tabIndex={-1}>
                  {formData.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {hasErr('password') ? <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{getErr('password')}</p>
                : <p className="text-xs text-deepBlue-500 mt-1">At least 6 characters with uppercase, lowercase, and number</p>}
            </div>
          </>
        )}

        {/* Step 2: KYC Verification */}
        {currentStep === 2 && (
          <>
            <h2 className="text-2xl font-bold text-deepBlue-800 mb-6">Verify Your Identity</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">We need to verify your identity using your BVN and NIN for security purposes.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-deepBlue-700 mb-2">BVN (11 digits) *</label>
              <div className="flex gap-2">
                <input type="text" name="bvn" value={kycData.bvn} onChange={handleChange} placeholder="12345678901" maxLength={11} className={`flex-1 ${inputCls('bvn')}`} disabled={isLoading || verificationStatus.bvn?.verified} />
                <button type="button" onClick={handleVerifyBVN} disabled={isLoading || kycData.bvn.length !== 11 || verificationStatus.bvn?.verified} className={`px-4 py-3 rounded-lg font-semibold transition duration-200 ${
                  verificationStatus.bvn?.verified ? 'bg-green-500 text-white' :
                  isLoading || kycData.bvn.length !== 11 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' :
                  'bg-deepBlue-600 hover:bg-deepBlue-700 text-white'
                }`}>
                  {isLoading ? <Loader size={18} className="animate-spin" /> : verificationStatus.bvn?.verified ? '✓ Verified' : 'Verify'}
                </button>
              </div>
              {hasErr('bvn') ? <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{getErr('bvn')}</p>
                : <p className="text-xs text-deepBlue-500 mt-1">11-digit Bank Verification Number ({kycData.bvn.length}/11)</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-deepBlue-700 mb-2">NIN (11 digits) *</label>
              <div className="flex gap-2">
                <input type="text" name="nin" value={kycData.nin} onChange={handleChange} placeholder="12345678901" maxLength={11} className={`flex-1 ${inputCls('nin')}`} disabled={isLoading || verificationStatus.nin?.verified} />
                <button type="button" onClick={handleVerifyNIN} disabled={isLoading || kycData.nin.length !== 11 || !kycData.dateOfBirth || verificationStatus.nin?.verified} className={`px-4 py-3 rounded-lg font-semibold transition duration-200 ${
                  verificationStatus.nin?.verified ? 'bg-green-500 text-white' :
                  isLoading || kycData.nin.length !== 11 || !kycData.dateOfBirth ? 'bg-gray-300 text-gray-600 cursor-not-allowed' :
                  'bg-deepBlue-600 hover:bg-deepBlue-700 text-white'
                }`}>
                  {isLoading ? <Loader size={18} className="animate-spin" /> : verificationStatus.nin?.verified ? '✓ Verified' : 'Verify'}
                </button>
              </div>
              {hasErr('nin') ? <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{getErr('nin')}</p>
                : <p className="text-xs text-deepBlue-500 mt-1">11-digit National Identification Number ({kycData.nin.length}/11)</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-deepBlue-700 mb-2">Date of Birth *</label>
              <input type="text" name="dateOfBirth" value={kycData.dateOfBirth} onChange={handleChange} placeholder="YYYY-MM-DD" maxLength={10} className={inputCls('dateOfBirth')} disabled={isLoading} inputMode="numeric" />
              {hasErr('dateOfBirth') ? <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{getErr('dateOfBirth')}</p>
                : <p className="text-xs text-deepBlue-500 mt-1">You must be at least 18 years old</p>}
            </div>
          </>
        )}

        {/* Step 3: Review */}
        {currentStep === 3 && (
          <>
            <h2 className="text-2xl font-bold text-deepBlue-800 mb-6">Review Your Information</h2>
            
            <div className="space-y-4 bg-gray-50 p-6 rounded-lg mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-deepBlue-600 font-semibold">First Name</p>
                  <p className="text-sm text-deepBlue-800">{formData.firstName}</p>
                </div>
                <div>
                  <p className="text-xs text-deepBlue-600 font-semibold">Last Name</p>
                  <p className="text-sm text-deepBlue-800">{formData.lastName}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-deepBlue-600 font-semibold">Email</p>
                <p className="text-sm text-deepBlue-800">{formData.email}</p>
              </div>
              <div>
                <p className="text-xs text-deepBlue-600 font-semibold">Phone</p>
                <p className="text-sm text-deepBlue-800">{fullPhone}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-deepBlue-600 font-semibold">BVN</p>
                  <p className="text-sm text-deepBlue-800">{kycData.bvn}</p>
                </div>
                <div>
                  <p className="text-xs text-deepBlue-600 font-semibold">NIN</p>
                  <p className="text-sm text-deepBlue-800">{kycData.nin}</p>
                </div>
              </div>
            </div>

            {verificationStatus.bvn?.verified && verificationStatus.nin?.verified && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-semibold">All verifications passed</span>
                </div>
                <p className="text-sm text-green-600">Your identity has been verified successfully.</p>
              </div>
            )}
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-6">
          {currentStep > 1 && (
            <button type="button" onClick={() => setCurrentStep(currentStep - 1)} disabled={isLoading} className="flex-1 py-3 rounded-lg font-semibold border-2 border-deepBlue-600 text-deepBlue-600 hover:bg-deepBlue-50 transition duration-200 disabled:opacity-50">
              Back
            </button>
          )}
          {currentStep < 3 && (
            <button type="button" onClick={handleNextStep} disabled={isLoading} className={`flex-1 py-3 rounded-lg font-semibold transition duration-200 ${isLoading ? 'bg-deepBlue-300 cursor-not-allowed' : 'bg-deepBlue-600 hover:bg-deepBlue-700 text-white'}`}>
              {isLoading ? <div className="flex items-center justify-center gap-2"><LoadingSpinner size="sm" text="" /><span>Processing...</span></div> : 'Continue'}
            </button>
          )}
          {currentStep === 3 && (
            <button type="submit" disabled={isLoading || !verificationStatus.bvn?.verified || !verificationStatus.nin?.verified} className={`flex-1 py-3 rounded-lg font-semibold transition duration-200 ${
              isLoading || !verificationStatus.bvn?.verified || !verificationStatus.nin?.verified
                ? 'bg-gray-300 cursor-not-allowed text-gray-600'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}>
              {isLoading ? <div className="flex items-center justify-center gap-2"><LoadingSpinner size="sm" text="" /><span>Creating Account...</span></div> : 'Create Account'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SignupSteps;
