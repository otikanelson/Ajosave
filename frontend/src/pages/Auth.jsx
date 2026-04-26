import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Login from '../components/auth/Login'
import SignupSteps from '../components/auth/SignupSteps'
import { ArrowLeft } from 'lucide-react'

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login')
  const navigate = useNavigate()
  const { loading, isAuthenticated, pendingOtp } = useAuth()

  // Navigate to dashboard once auth is fully complete
  useEffect(() => {
    if (!loading && isAuthenticated && !pendingOtp) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, pendingOtp, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-deepBlue-50 to-deepBlue-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deepBlue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-deepBlue-50 to-deepBlue-100 py-8">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-6">

          <div className="flex items-center justify-center mb-8 relative">
            <button
              onClick={() => navigate('/')}
              className="absolute left-0 flex items-center text-deepBlue-600 hover:text-deepBlue-800"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
            </button>
            <h2 className="text-2xl font-bold text-deepBlue-800">Welcome Back</h2>
          </div>

          <div className="flex mb-6 bg-deepBlue-50 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 px-4 rounded-md font-semibold transition duration-200 ${
                activeTab === 'login'
                  ? 'bg-white text-deepBlue-600 shadow-sm'
                  : 'text-deepBlue-500'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-2 px-4 rounded-md font-semibold transition duration-200 ${
                activeTab === 'signup'
                  ? 'bg-white text-deepBlue-600 shadow-sm'
                  : 'text-deepBlue-500'
              }`}
            >
              Sign Up
            </button>
          </div>

          {activeTab === 'login' ? (
            <Login />
          ) : (
            <SignupSteps />
          )}
        </div>
      </div>
    </div>
  )
}

export default Auth
