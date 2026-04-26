import React, { createContext, useContext, useState, useEffect } from 'react'

const AdminAuthContext = createContext()

export const AdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminUser, setAdminUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [adminRole, setAdminRole] = useState(null)

  useEffect(() => {
    // Check if admin is already logged in
    const token = localStorage.getItem('adminToken')
    const user = localStorage.getItem('adminUser')
    
    if (token && user) {
      setIsAuthenticated(true)
      const userData = JSON.parse(user)
      setAdminUser(userData)
      setAdminRole(userData.role)
    }
    
    setLoading(false)
  }, [])

  const login = (token, user) => {
    localStorage.setItem('adminToken', token)
    localStorage.setItem('adminUser', JSON.stringify(user))
    setIsAuthenticated(true)
    setAdminUser(user)
    setAdminRole(user.role)
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    setIsAuthenticated(false)
    setAdminUser(null)
    setAdminRole(null)
  }

  const hasPermission = (requiredRole) => {
    const roleHierarchy = {
      'super_admin': 3,
      'moderator': 2,
      'support_agent': 1
    }
    
    return (roleHierarchy[adminRole] || 0) >= (roleHierarchy[requiredRole] || 0)
  }

  return (
    <AdminAuthContext.Provider value={{
      isAuthenticated,
      adminUser,
      loading,
      adminRole,
      login,
      logout,
      hasPermission
    }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }
  return context
}
