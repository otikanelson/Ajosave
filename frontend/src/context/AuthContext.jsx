import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authServices';
import { APIError } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Tracks when credentials are verified but OTP hasn't been completed yet
  const [pendingOtp, setPendingOtp] = useState(false);

  /**
   * Initialize authentication state on mount
   * Checks if user is already logged in by fetching current user
   */
  useEffect(() => {
    initializeAuth();
  }, []);

  /**
   * Initialize Authentication
   * 
   * Attempts to fetch current user from backend to restore session
   */
  const initializeAuth = async () => {
    try {
      setLoading(true);
      console.log('🔄 Initializing authentication...');
      
      // Try to get current user (will work if valid cookie exists)
      const response = await authService.getCurrentUser();
      
      const user = response.data?.user || response.user;
      if (response.success && user) {
        setUser(user);
        setIsAuthenticated(true);
        console.log('✅ User authenticated:', user.email);
      }
    } catch (error) {
      // 401 = no session, expected for logged-out users — don't log as error
      if (error instanceof APIError && error.statusCode === 401) {
        console.log('ℹ️ No active session found');
      } else {
        console.error('❌ Auth initialization error:', error);
      }
      
      // Clear any stale auth state
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login User
   * 
   * @param {Object} credentials - Login credentials
   * @returns {Promise<void>}
   */
  const login = async (credentials) => {
    try {
      setError(null);
      console.log('🔐 Logging in...');
      
      const response = await authService.login(credentials);
      
      if (response.data?.requiresOtp) {
        setPendingOtp(true);
        return { requiresOtp: true, userId: response.data.userId, phoneNumber: response.data.phoneNumber, devOtp: response.data.devOtp };
      }

      const user = response.data?.user || response.user;
      if (response.success && user) {
        setUser(user);
        setIsAuthenticated(true);
        console.log('✅ Login successful');
        return { success: true, user };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('❌ Login failed:', error);
      setError(error.message);
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  /**
   * Sign Up User
   * 
   * @param {Object} userData - User registration data
   * @returns {Promise<void>}
   */
  const signup = async (userData) => {
    try {
      setError(null);
      console.log('📝 Signing up...');
      
      const response = await authService.register(userData);
      
      if (response.data?.requiresOtp) {
        setPendingOtp(true);
        return { requiresOtp: true, userId: response.data.userId, phoneNumber: response.data.phoneNumber, devOtp: response.data.devOtp };
      }

      const user = response.data?.user || response.user;
      if (response.success && user) {
        setUser(user);
        setIsAuthenticated(true);
        console.log('✅ Signup successful');
        return { success: true, user };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('❌ Signup failed:', error);
      setError(error.message);
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  /**
   * Complete OTP Login
   * Called after OTP is verified — sets user state and marks as authenticated
   */
  const completeOtpLogin = (user, token) => {
    console.log('✅ completeOtpLogin called, user:', user, 'token present:', !!token);
    setPendingOtp(false);
    setUser(user || null);
    setIsAuthenticated(true);
    setError(null);
  };

  /**
   * Logout User
   * 
   * @returns {Promise<void>}
   */
  const logout = async () => {
    try {
      setLoading(true);
      
      console.log('👋 Logging out...');
      
      await authService.logout();
      
      // Clear local state
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      
      // Even if logout API call fails, clear local state
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verify User Account
   * 
   * @param {Object} verificationData - Verification data (address, etc.)
   * @returns {Promise<void>}
   */
  const verifyAccount = async (verificationData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Verifying account...');
      
      const response = await authService.verifyUser(verificationData);
      
      const user = response.data?.user || response.user;
      if (response.success && user) {
        setUser(user);
        console.log('✅ Verification successful');
        return { success: true, user };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('❌ Verification failed:', error);
      setError(error.message);
      
      // Re-throw error so component can handle it
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh Authentication Token
   * 
   * Refreshes the httpOnly cookie with a new token
   * @returns {Promise<void>}
   */
  const refreshAuth = async () => {
    try {
      console.log('🔄 Refreshing auth token...');
      
      await authService.refreshToken();
      
      console.log('✅ Token refreshed');
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      
      // If token refresh fails, user needs to log in again
      setUser(null);
      setIsAuthenticated(false);
      
      throw error;
    }
  };

  /**
   * Update User Data
   * 
   * Updates user data in state (useful after profile updates)
   * @param {Object} userData - Updated user data
   */
  const updateUser = (userData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
  };

  /**
   * Clear Error
   * 
   * Clears the error state
   */
  const clearError = () => {
    setError(null);
  };

  // Context value
  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    pendingOtp,
    login,
    signup,
    logout,
    verifyAccount,
    refreshAuth,
    updateUser,
    clearError,
    completeOtpLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};