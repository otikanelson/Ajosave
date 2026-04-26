import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminLayout from './components/layout/AdminLayout'

console.log('📱 App component loaded')

// Protected Route Component
const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdminAuth()
  
  console.log('🔐 ProtectedAdminRoute - isAuthenticated:', isAuthenticated, 'loading:', loading)
  
  if (loading) {
    return (
      <div className="min-h-screen bg-deepBlue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deepBlue-600"></div>
      </div>
    )
  }
  
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />
}

// App Content Component
const AppContent = () => {
  console.log('📄 AppContent component rendering')
  
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      
      <Route 
        path="/admin/*" 
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        } 
      />
      
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  )
}

function App() {
  console.log('🎯 App function called')
  
  return (
    <AdminAuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AdminAuthProvider>
  )
}

export default App
