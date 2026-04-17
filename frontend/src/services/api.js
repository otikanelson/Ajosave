// src/services/api.js

/**
 * API Service Layer
 * 
 * This module provides a centralized interface for all API calls to the backend.
 * It handles request/response formatting, error handling, and authentication.
 * 
 * Key Features:
 * - Automatic token handling via httpOnly cookies
 * - Consistent error handling and formatting
 * - Request/response interceptors
 * - Base URL configuration
 */

// Base API URL - configure based on environment
// In Vite, environment variables must start with VITE_
const PRIMARY_API_URL = import.meta.env.VITE_API_PRIMARY_URL || 'http://localhost:5000/api';
const FALLBACK_API_URL = import.meta.env.VITE_API_FALLBACK_URL || 'https://ajosave-backend.vercel.app/api';

let API_BASE_URL = PRIMARY_API_URL;

// Log the API URL on startup for debugging
console.log('🔗 Primary API URL:', PRIMARY_API_URL);
console.log('🔗 Fallback API URL:', FALLBACK_API_URL);

/**
 * API Error Class
 * 
 * Custom error class for API-related errors with additional context
 */
class APIError extends Error {
  constructor(message, statusCode, errors = null) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.errors = errors; // Validation errors array
  }
}

/**
 * Make HTTP Request
 * 
 * Core function to make HTTP requests with proper error handling
 * 
 * @param {string} endpoint - API endpoint (e.g., '/auth/login')
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Response data
 * @throws {APIError} If request fails
 */
const makeRequest = async (endpoint, options = {}) => {
  const attemptRequest = async (baseUrl) => {
    try {
      // Construct full URL
      const url = `${baseUrl}${endpoint}`;
      // Default headers
      const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      // Inject JWT token from localStorage if present
      const token = localStorage.getItem('authToken');
      if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
      }
      
      // Merge options with defaults
      const config = {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      };
      
      // Log request in development
      if (import.meta.env.DEV) {
        console.log(`🌐 API Request: ${options.method || 'GET'} ${endpoint} (${baseUrl})`);
      }
      
      // Make the request with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const response = await fetch(url, { ...config, signal: controller.signal });
      clearTimeout(timeoutId);
      
      // Parse JSON response
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new APIError('Invalid response from server', response.status);
      }
      
      // Check if request was successful
      if (!response.ok) {
        const errorMessage = data.message || 'An error occurred';
        const validationErrors = data.errors || null;
        throw new APIError(errorMessage, response.status, validationErrors);
      }
      
      // Log success in development
      if (import.meta.env.DEV) {
        console.log(`✅ API Success: ${options.method || 'GET'} ${endpoint}`);
      }
      
      // Update API_BASE_URL if using fallback
      if (baseUrl === FALLBACK_API_URL && API_BASE_URL !== FALLBACK_API_URL) {
        console.log('📡 Switched to fallback API URL');
        API_BASE_URL = FALLBACK_API_URL;
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  try {
    // Try primary URL first
    return await attemptRequest(API_BASE_URL);
  } catch (primaryError) {
    // If primary fails and it's not the fallback, try fallback
    if (API_BASE_URL !== FALLBACK_API_URL) {
      try {
        console.warn('⚠️ Primary API failed, trying fallback...');
        return await attemptRequest(FALLBACK_API_URL);
      } catch (fallbackError) {
        // Both failed, throw the fallback error
        if (fallbackError instanceof APIError) {
          throw fallbackError;
        }
        throw new APIError(
          'Unable to connect. Please check your internet connection.',
          0
        );
      }
    }
    
    // Primary error and already using fallback
    if (primaryError instanceof APIError) {
      throw primaryError;
    }
    
    throw new APIError(
      'Network error. Please check your internet connection.',
      0
    );
  }
};

/**
 * API Methods
 * 
 * Convenience methods for different HTTP verbs
 */
const api = {
  /**
   * GET Request
   * 
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Response data
   */
  get: async (endpoint, params = {}) => {
    // Build query string from params
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return makeRequest(url, {
      method: 'GET',
    });
  },
  
  /**
   * POST Request
   * 
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @returns {Promise<Object>} Response data
   */
  post: async (endpoint, data = {}) => {
    return makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * PUT Request
   * 
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @returns {Promise<Object>} Response data
   */
  put: async (endpoint, data = {}) => {
    return makeRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * DELETE Request
   * 
   * @param {string} endpoint - API endpoint
   * @returns {Promise<Object>} Response data
   */
  delete: async (endpoint) => {
    return makeRequest(endpoint, {
      method: 'DELETE',
    });
  },

  /**
   * PATCH Request
   */
  patch: async (endpoint, data = {}) => {
    return makeRequest(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * GET Blob — for file downloads (CSV, etc.)
   * Returns the raw Response so the caller can call .blob()
   */
  getBlob: async (endpoint, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${API_BASE_URL}${endpoint}?${queryString}` : `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('authToken');
    const headers = { Accept: '*/*' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(url, { method: 'GET', headers });
    if (!response.ok) {
      let msg = 'Export failed';
      try { const d = await response.json(); msg = d.message || msg; } catch (_) {}
      throw new APIError(msg, response.status);
    }
    return response;
  },
};

// Export API methods and error class
export { api, APIError };