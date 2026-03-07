const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const Wallet = require('../models/Wallets');
const config = require('../config/config');
const { createAndSendOtp, verifyOtp: verifyOtpCode } = require('../services/otpService');
const {
  AppError,
  ValidationError,
  AuthenticationError,
  DatabaseError,
  asyncErrorHandler
} = require('../middlewares/errorHandler');

/**
 * Generate JWT Token
 * 
 * Creates a JWT token for user authentication with configurable expiration.
 * 
 * @param {string} userId - User's database ID
 * @param {string} expiresIn - Token expiration time (optional)
 * @returns {string} JWT token
 */
const generateToken = (userId, expiresIn = config.jwt.expiresIn) => {
  try {
    return jwt.sign(
      { 
        id: userId,
        iat: Math.floor(Date.now() / 1000) // Issued at time
      },
      config.jwt.secret,
      { expiresIn }
    );
  } catch (error) {
    console.error('Token generation error:', error);
    throw new AppError('Failed to generate authentication token', 500);
  }
};

/**
 * Set Authentication Cookie
 * 
 * Sets an httpOnly cookie with the JWT token for secure authentication.
 * 
 * @param {Object} res - Express response object
 * @param {string} token - JWT token to set in cookie
 */
const setAuthCookie = (res, token) => {
  res.cookie('authToken', token, {
    ...config.security.cookie,
    // httpOnly: true,     // Already set in config
    // secure: true,       // Already set in config for production
    // sameSite: 'strict', // Already set in config
    // maxAge: 3600000     // Already set in config (1 hour)
  });
};

/**
 * Clear Authentication Cookie
 * 
 * Clears the authentication cookie (used for logout).
 * 
 * @param {Object} res - Express response object
 */
const clearAuthCookie = (res) => {
  res.cookie('authToken', '', {
    ...config.security.cookie,
    maxAge: 0 // Expire immediately
  });
};

/**
 * Format User Response
 * 
 * Creates a consistent user response object, excluding sensitive information.
 * 
 * @param {Object} user - User document from database
 * @returns {Object} Formatted user object for API response
 */
const formatUserResponse = (user) => {
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    isVerified: user.isVerified,
    dateOfBirth: user.dateOfBirth,
    address: user.address,
    createdAt: user.createdAt
    // Note: BVN, NIN, and password are intentionally excluded for security
  };
};

/**
 * Check if User Exists
 * 
 * Helper function to check if a user already exists with given email or phone.
 * 
 * @param {string} email - User's email address
 * @param {string} phoneNumber - User's phone number
 * @returns {Promise<Object|null>} Existing user or null
 */
const checkUserExists = async (email, phoneNumber) => {
  try {
    return await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { phoneNumber }
      ]
    });
  } catch (error) {
    console.error('Database error checking user existence:', error);
    throw new DatabaseError('Failed to check user existence');
  }
};

/**
 * Register User Handler - UPDATED
 * 
 * @route   POST /api/auth/register
 * @desc    Register a new user with comprehensive validation and error handling
 * @access  Public
 */
const registerUser = asyncErrorHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    bvn,
    nin,
    dateOfBirth
  } = req.body;

  // Normalize email to lowercase
  const normalizedEmail = email.toLowerCase().trim();



  try {
    // Check if user already exists
    const existingUser = await checkUserExists(normalizedEmail, phoneNumber);
    
    if (existingUser) {
      // Determine which field is duplicate for better error message
      let duplicateField = '';
      if (existingUser.email === normalizedEmail) {
        duplicateField = 'email address';
      } else if (existingUser.phoneNumber === phoneNumber) {
        duplicateField = 'phone number';
      }
      
      throw new ValidationError(`An account with this ${duplicateField} already exists`, [{
        field: existingUser.email === normalizedEmail ? 'email' : 'phoneNumber',
        message: `This ${duplicateField} is already registered`,
        value: existingUser.email === normalizedEmail ? normalizedEmail : phoneNumber
      }]);
    }

    // Check for duplicate BVN (more specific check)
    const existingBVN = await User.findOne({ bvn });
    if (existingBVN) {
      throw new ValidationError('This BVN is already registered with another account', [{
        field: 'bvn',
        message: 'BVN is already in use',
        value: bvn
      }]);
    }

    // Check for duplicate NIN
    const existingNIN = await User.findOne({ nin });
    if (existingNIN) {
      throw new ValidationError('This NIN is already registered with another account', [{
        field: 'nin',
        message: 'NIN is already in use',
        value: nin
      }]);
    }

    // Create new user instance
    const newUser = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      password, // Will be hashed by the pre-save middleware
      phoneNumber,
      bvn,
      nin,
      dateOfBirth: new Date(dateOfBirth)
    });

    // Save user to database
    const savedUser = await newUser.save();

    // NEW: Create wallet for the user

    const newWallet = new Wallet({
      userId: savedUser._id,
      totalBalance: 0,
      availableBalance: 0,
      lockedBalance: 0,
      totalPayouts: 0,
      totalContributions: 0,
      totalWithdrawals: 0
    });

    await newWallet.save();


    // Send OTP to verify phone number
    const { devOtp } = await createAndSendOtp(savedUser);


    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your phone number.',
      data: {
        requiresOtp: true,
        phoneNumber: savedUser.phoneNumber,
        userId: savedUser._id,
        ...(process.env.NODE_ENV !== 'production' && { devOtp }),
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    // Log registration error
    console.error(`❌ Registration failed for ${normalizedEmail}:`, error.message);
    
    // Re-throw the error to be handled by global error handler
    throw error;
  }
});

/**
 * Login User Handler - UPDATED
 * 
 * @route   POST /api/auth/login
 * @desc    Authenticate user and provide access token
 * @access  Public
 */
const loginUser = asyncErrorHandler(async (req, res) => {
  const { phoneNumber, password } = req.body;



  try {
    // Find user by phone number (include password for verification)
    const user = await User.findOne({ phoneNumber }).select('+password');

    if (!user) {
      throw new AuthenticationError('Invalid phone number or password');
    }

    // Verify password using the method defined in User model
    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      console.warn(`🚫 Invalid password attempt for user: ${user._id}`);
      throw new AuthenticationError('Invalid phone number or password');
    }

    // NEW: Check if wallet exists, create if it doesn't
    let wallet = await Wallet.findOne({ userId: user._id });
    if (!wallet) {

      wallet = new Wallet({
        userId: user._id,
        totalBalance: 0,
        availableBalance: 0,
        lockedBalance: 0
      });
      await wallet.save();

    }

    // Update last login time (optional)
    user.lastLoginAt = new Date();
    await user.save();

    // Send OTP for 2FA
    const { devOtp } = await createAndSendOtp(user);


    res.status(200).json({
      success: true,
      message: 'Credentials verified. Please enter the OTP sent to your phone.',
      data: {
        requiresOtp: true,
        phoneNumber: user.phoneNumber,
        userId: user._id,
        ...(process.env.NODE_ENV !== 'production' && { devOtp }),
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    // Log login error
    console.error(`❌ Login failed for ${phoneNumber}:`, error.message);
    
    // Re-throw the error to be handled by global error handler
    throw error;
  }
});

/**
 * Verify User Handler
 * 
 * @route   PUT /api/auth/verify
 * @desc    Complete user verification process and update profile
 * @access  Private (requires authentication)
 */
const verifyUser = asyncErrorHandler(async (req, res) => {
  const { address } = req.body;
  const userId = req.user._id;



  try {
    // Find user by ID
    const user = await User.findById(userId);

    if (!user) {
      throw new AuthenticationError('User not found. Please login again');
    }

    // Check if user is already verified
    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message: 'User is already verified',
        data: {
          user: formatUserResponse(user)
        },
        timestamp: new Date().toISOString()
      });
    }

    // Update user verification status and address
    user.isVerified = true;
    user.address = address.trim();
    user.verifiedAt = new Date();

    // Save updated user
    const updatedUser = await user.save();

    // Log successful verification


    // Send success response
    res.status(200).json({
      success: true,
      message: 'Verification completed successfully',
      data: {
        user: formatUserResponse(updatedUser)
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    // Log verification error
    console.error(`❌ Verification failed for user ${userId}:`, error.message);
    
    // Re-throw the error to be handled by global error handler
    throw error;
  }
});

/**
 * Logout User Handler
 * 
 * @route   POST /api/auth/logout
 * @desc    Logout user and clear authentication cookie
 * @access  Private (requires authentication)
 */
const logoutUser = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;



  try {
    // Clear authentication cookie
    clearAuthCookie(res);

    // Optionally update last logout time
    if (req.user) {
      req.user.lastLogoutAt = new Date();
      await req.user.save();
    }

    // Log successful logout


    // Send success response
    res.status(200).json({
      success: true,
      message: 'Logout successful',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    // Log logout error
    console.error(`❌ Logout failed for user ${userId}:`, error.message);
    
    // Even if there's an error, clear the cookie and respond successfully
    clearAuthCookie(res);
    res.status(200).json({
      success: true,
      message: 'Logout successful',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get Current User Handler
 * 
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user's information
 * @access  Private (requires authentication)
 */
const getCurrentUser = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    // Get user from database (req.user might be outdated)
    const user = await User.findById(userId);

    if (!user) {
      throw new AuthenticationError('User not found. Please login again');
    }

    // Send user information
    res.status(200).json({
      success: true,
      message: 'User information retrieved successfully',
      data: {
        user: formatUserResponse(user)
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ Failed to get user info for ${userId}:`, error.message);
    throw error;
  }
});

/**
 * Refresh Token Handler
 * 
 * @route   POST /api/auth/refresh
 * @desc    Refresh authentication token
 * @access  Private (requires valid token)
 */
const refreshToken = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    // Generate new token
    const newToken = generateToken(userId);

    // Set new authentication cookie
    setAuthCookie(res, newToken);



    // Send success response
    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ Token refresh failed for user ${userId}:`, error.message);
    throw error;
  }
});

/**
 * Send OTP Handler
 * @route   POST /api/auth/send-otp
 * @desc    Send OTP to a user's phone (resend support)
 * @access  Public
 */
const sendOtp = asyncErrorHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) throw new ValidationError('userId is required');

  const user = await User.findById(userId).select('+otpCode +otpExpiry');
  if (!user) throw new AuthenticationError('User not found');

  const { devOtp } = await createAndSendOtp(user);

  res.status(200).json({
    success: true,
    message: 'OTP sent successfully',
    data: {
      phoneNumber: user.phoneNumber,
      ...(process.env.NODE_ENV !== 'production' && { devOtp }),
    },
    timestamp: new Date().toISOString(),
  });
});

/**
 * Verify OTP Handler
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP and issue JWT (works for both signup and login)
 * @access  Public
 */
const verifyOtpHandler = asyncErrorHandler(async (req, res) => {
  const { userId, otp } = req.body;
  if (!userId || !otp) throw new ValidationError('userId and otp are required');

  const user = await User.findById(userId).select('+otpCode +otpExpiry +password');
  if (!user) throw new AuthenticationError('User not found');

  const valid = await verifyOtpCode(user, otp);
  if (!valid) throw new AuthenticationError('Invalid or expired OTP');

  // Mark phone as verified
  if (!user.isPhoneVerified) {
    user.isPhoneVerified = true;
    await user.save();
  }

  // Issue token
  const token = generateToken(user._id);
  setAuthCookie(res, token);



  res.status(200).json({
    success: true,
    message: 'OTP verified successfully',
    data: { user: formatUserResponse(user), token },
    timestamp: new Date().toISOString(),
  });
});

/**
 * Face Verification Handler
 * @route   POST /api/auth/verify-face
 * @desc    Mark user's face as verified (dev: simulated, prod: Persona webhook)
 * @access  Private
 */
const verifyFace = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;
  const isDev = process.env.NODE_ENV !== 'production';

  const user = await User.findById(userId);
  if (!user) throw new AuthenticationError('User not found');

  if (isDev) {
    // Dev simulation — mark as verified immediately
    user.isFaceVerified = true;
    user.faceVerifiedAt = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Face verification successful (simulated)',
      data: { user: formatUserResponse(user) },
      timestamp: new Date().toISOString(),
    });
  }

  // Production: This endpoint is called by Persona webhook after real verification
  // The Persona inquiry ID would be validated here
  const { inquiryId } = req.body;
  if (!inquiryId) throw new ValidationError('inquiryId is required in production');

  // TODO: Validate inquiryId with Persona API before marking verified
  user.isFaceVerified = true;
  user.faceVerifiedAt = new Date();
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Face verification successful',
    data: { user: formatUserResponse(user) },
    timestamp: new Date().toISOString(),
  });
});
/**
 * Forgot Password Handler
 * @route   POST /api/auth/forgot-password
 * @desc    Send OTP to user's phone number to initiate password reset
 * @access  Public
 */
const forgotPassword = asyncErrorHandler(async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) throw new ValidationError('Phone number is required');

  const user = await User.findOne({ phoneNumber });

  // Always respond with success to prevent phone number enumeration
  if (!user) {
    return res.status(200).json({
      success: true,
      message: 'If an account with that number exists, an OTP has been sent.',
      data: {},
      timestamp: new Date().toISOString(),
    });
  }

  const { devOtp } = await createAndSendOtp(user);

  res.status(200).json({
    success: true,
    message: 'OTP sent to your phone number.',
    data: {
      userId: user._id,
      phoneNumber: user.phoneNumber,
      ...(process.env.NODE_ENV !== 'production' && { devOtp }),
    },
    timestamp: new Date().toISOString(),
  });
});

/**
 * Reset Password Handler
 * @route   POST /api/auth/reset-password
 * @desc    Verify OTP and set a new password
 * @access  Public
 */
const resetPassword = asyncErrorHandler(async (req, res) => {
  const { userId, otp, newPassword } = req.body;
  if (!userId || !otp || !newPassword) {
    throw new ValidationError('userId, otp, and newPassword are required');
  }

  const user = await User.findById(userId).select('+otpCode +otpExpiry +password');
  if (!user) throw new AuthenticationError('User not found');

  const valid = await verifyOtpCode(user, otp);
  if (!valid) throw new AuthenticationError('Invalid or expired OTP');

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successfully. Please log in with your new password.',
    data: {},
    timestamp: new Date().toISOString(),
  });
});

module.exports = {
  registerUser,
  loginUser,
  verifyUser,
  logoutUser,
  getCurrentUser,
  refreshToken,
  sendOtp,
  verifyOtpHandler,
  verifyFace,
  forgotPassword,
  resetPassword,
  generateToken,
  formatUserResponse
};
