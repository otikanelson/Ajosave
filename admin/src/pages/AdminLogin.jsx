import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'
import { Lock, Phone, Eye, EyeOff, ShieldCheck } from 'lucide-react'

export default function AdminLogin() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState('credentials')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAdminAuth()

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      // TODO: POST /api/admin/auth/send-otp
      await new Promise(r => setTimeout(r, 800)) // mock delay
      setStep('otp')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      // TODO: POST /api/admin/auth/verify-otp
      await new Promise(r => setTimeout(r, 800)) // mock delay
      const mockUser = {
        id: '1',
        name: 'Admin User',
        phoneNumber,
        role: 'super_admin',
        email: 'admin@ajosave.com'
      }
      login('mock-token', mockUser)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-deepBlue-900/30 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-deepBlue-600 rounded-2xl mb-4 shadow-lg shadow-deepBlue-900/50">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">AjoSave</h1>
          <p className="text-green-400 text-sm font-semibold tracking-widest uppercase mt-1">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-dark-800 rounded-2xl shadow-2xl border border-dark-700 p-8">
          {step === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit}>
              <h2 className="text-xl font-bold text-dark-100 mb-1">Welcome back</h2>
              <p className="text-dark-400 text-sm mb-6">Sign in to your admin account</p>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Phone */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-dark-300 mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="w-full bg-dark-900 border border-dark-600 text-dark-100 placeholder-dark-500 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-deepBlue-500 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-dark-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-dark-900 border border-dark-600 text-dark-100 placeholder-dark-500 rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-deepBlue-500 focus:border-transparent transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-deepBlue-600 hover:bg-deepBlue-500 text-white font-bold py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Sending OTP...</span>
                  </span>
                ) : 'Continue'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit}>
              <h2 className="text-xl font-bold text-dark-100 mb-1">Verify your identity</h2>
              <p className="text-dark-400 text-sm mb-6">
                Enter the 6-digit OTP sent to <span className="text-deepBlue-400 font-semibold">{phoneNumber}</span>
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-semibold text-dark-300 mb-1.5">OTP Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength="6"
                  className="w-full bg-dark-900 border border-dark-600 text-dark-100 placeholder-dark-600 rounded-lg px-4 py-3 text-center text-2xl tracking-[0.5em] font-bold focus:outline-none focus:ring-2 focus:ring-deepBlue-500 focus:border-transparent transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-deepBlue-600 hover:bg-deepBlue-500 text-white font-bold py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Verifying...</span>
                  </span>
                ) : 'Verify & Login'}
              </button>

              <button
                type="button"
                onClick={() => { setStep('credentials'); setOtp(''); setError('') }}
                className="w-full mt-3 text-dark-400 hover:text-dark-200 font-medium py-2 text-sm transition"
              >
                ← Back
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-dark-600 text-xs mt-6">
          For security issues contact{' '}
          <a href="mailto:support@ajosave.com" className="text-deepBlue-400 hover:text-deepBlue-300">
            support@ajosave.com
          </a>
        </p>
      </div>
    </div>
  )
}
