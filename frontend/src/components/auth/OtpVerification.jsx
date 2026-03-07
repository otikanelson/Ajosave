import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { useToast } from '../common/Toast';

/**
 * OTP Verification component.
 * Props:
 *   userId      - string
 *   phoneNumber - string (for display)
 *   onSuccess   - fn({ user, token })
 *   onBack      - fn()
 */
const OtpVerification = ({ userId, phoneNumber, devOtp, onSuccess, onBack }) => {
  const toast = useToast();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
    // Auto-fill in dev mode
    if (devOtp) {
      setOtp(devOtp.split(''));
    }
  }, [devOtp]);

  useEffect(() => {
    if (timer <= 0) { setCanResend(true); return; }
    const id = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleChange = (value, index) => {
    if (value && !/^\d$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      setIsResending(true);
      const response = await api.post('/auth/send-otp', { userId });
      setOtp(['', '', '', '', '', '']);
      setTimer(60);
      setCanResend(false);
      inputRefs.current[0]?.focus();
      // Auto-fill new dev OTP if returned
      if (response.data?.devOtp) {
        setOtp(response.data.devOtp.split(''));
      }
      toast.success('New code sent!');
    } catch (err) {
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) return;
    try {
      setIsLoading(true);
      const response = await api.post('/auth/verify-otp', { userId, otp: code });
      const user = response.data?.user || response.user;
      const token = response.data?.token || response.token;
      onSuccess({ user, token });
    } catch (err) {
      toast.error(err.message || 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const masked = phoneNumber
    ? phoneNumber.replace(/(\+?\d{3})\d+(\d{4})/, '$1****$2')
    : '';

  const isComplete = otp.every(d => d !== '');

  return (
    <div>
      <div className="text-center mb-6">
        <p className="text-deepBlue-600 text-sm">
          We sent a 6-digit code to <span className="font-semibold">{masked}</span>
        </p>
      </div>

      {devOtp && (
        <div className="mb-4 px-3 py-2 bg-yellow-50 border border-yellow-300 rounded-lg text-center">
          <p className="text-xs text-yellow-700 font-medium">DEV MODE — OTP auto-filled: <span className="font-mono font-bold">{devOtp}</span></p>
        </div>
      )}

      {/* OTP boxes */}
      <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={el => inputRefs.current[i] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(e.target.value, i)}
            onKeyDown={e => handleKeyDown(e, i)}
            disabled={isLoading}
            className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none transition-colors ${
              digit ? 'border-deepBlue-500 bg-deepBlue-50' : 'border-deepBlue-200 bg-white'
            }`}
          />
        ))}
      </div>

      {/* Resend */}
      <div className="text-center mb-6">
        {canResend ? (
          <button
            onClick={handleResend}
            disabled={isResending}
            className="text-deepBlue-600 text-sm font-semibold hover:underline flex items-center gap-1 mx-auto"
          >
            <RefreshCw className="w-3 h-3" />
            {isResending ? 'Sending...' : 'Resend Code'}
          </button>
        ) : (
          <p className="text-deepBlue-500 text-sm">
            Resend code in {timer}s
          </p>
        )}
      </div>

      {/* Verify button */}
      <button
        onClick={handleVerify}
        disabled={!isComplete || isLoading}
        className={`w-full py-3 rounded-lg font-semibold transition duration-200 ${
          isComplete && !isLoading
            ? 'bg-deepBlue-600 hover:bg-deepBlue-700 text-white'
            : 'bg-deepBlue-200 cursor-not-allowed text-deepBlue-400'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <LoadingSpinner size="sm" text="" />
            <span>Verifying...</span>
          </div>
        ) : 'Verify'}
      </button>

      <button
        onClick={onBack}
        className="w-full mt-3 py-2 text-sm text-deepBlue-500 hover:text-deepBlue-700"
      >
        ← Back
      </button>
    </div>
  );
};

export default OtpVerification;
