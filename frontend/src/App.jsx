import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './components/common/Toast'
import { useSessionTimeout } from './hooks/useSessionTimeout'
import { useNetworkStatus } from './hooks/useNetworkStatus'
import SessionTimeoutWarning from './components/common/SessionTimeoutWarning'
import NetworkStatus from './components/common/NetworkStatus'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import About from './pages/About'
import HowItWorks from './pages/HowItWorks'
import Contact from './pages/Contact'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsConditions from './pages/TermsConditions'
import RefundPolicy from './pages/RefundPolicy'
import HelpCenter from './pages/HelpCenter'
import Security from './pages/Security'
import TrustSafety from './pages/TrustSafety'
import CommunityGuidelines from './pages/CommunityGuidelines'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Groups from './pages/Groups'
import GroupDetail from './pages/GroupDetail'
import Payment from './pages/Payment'
import Wallet from './pages/Wallet'
import CreateGroup from './components/groups/CreateGroup'
import JoinGroup from './components/groups/JoinGroup'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, pendingOtp } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-deepBlue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deepBlue-600"></div>
      </div>
    )
  }
  
  // If OTP is pending, send back to /auth to complete verification
  if (isAuthenticated && pendingOtp) return <Navigate to="/auth" replace />
  
  return isAuthenticated ? children : <Navigate to="/auth" replace />
}

// Public Route Component (redirect to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, pendingOtp } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-deepBlue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deepBlue-600"></div>
      </div>
    )
  }
  
  // Don't redirect if OTP is still pending — user needs to complete verification
  // Auth.jsx handles the redirect once isAuthenticated=true and pendingOtp=false
  return children
}

// App Content Component with Session Management
const AppContent = () => {
  const sessionTimeout = useSessionTimeout(25, 5); // 25 min timeout, 5 min warning (matches backend 30min)
  const networkStatus = useNetworkStatus();

  return (
    <>
      {/* Network Status Banner */}
      <NetworkStatus 
        isOnline={networkStatus.isOnline} 
        isSlowConnection={networkStatus.isSlowConnection} 
      />
      
      <Routes>
        {/* Public Routes - No Layout wrapper */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/security" element={<Security />} />
        <Route path="/trust-safety" element={<TrustSafety />} />
        <Route path="/community-guidelines" element={<CommunityGuidelines />} />
        <Route 
          path="/auth" 
          element={
            <PublicRoute>
              <div className="min-h-screen bg-deepBlue-50">
                <Auth />
              </div>
            </PublicRoute>
          } 
        />
        
        {/* Protected Routes - With Layout wrapper */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/groups" 
          element={
            <ProtectedRoute>
              <Layout>
                <Groups />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/groups/:id" 
          element={
            <ProtectedRoute>
              <Layout>
                <GroupDetail />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/groups/create" 
          element={
            <ProtectedRoute>
              <Layout>
                <CreateGroup />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/groups/join" 
          element={
            <ProtectedRoute>
              <Layout>
                <JoinGroup />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/payment" 
          element={
            <ProtectedRoute>
              <Layout>
                <Payment />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/wallet" 
          element={
            <ProtectedRoute>
              <Layout>
                <Wallet />
              </Layout>
            </ProtectedRoute>
          } 
        />
      </Routes>
      
      {/* Session Timeout Warning */}
      <SessionTimeoutWarning
        show={sessionTimeout.showWarning}
        timeLeft={sessionTimeout.timeLeft}
        onExtend={sessionTimeout.extendSession}
        onDismiss={sessionTimeout.dismissWarning}
      />
    </>
  );
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App