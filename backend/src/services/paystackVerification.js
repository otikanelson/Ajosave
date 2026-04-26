const axios = require('axios');

const PAYSTACK_API_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

/**
 * Verify BVN using Paystack API
 * @param {string} bvn - 11-digit BVN
 * @returns {Promise<Object>} Verification result
 */
const verifyBVN = async (bvn) => {
  if (!PAYSTACK_API_KEY) {
    // Dev mode: simulate verification
    console.log(`📋 [BVN VERIFICATION - DEV] BVN: ${bvn}`);
    return {
      success: true,
      verified: true,
      data: {
        bvn,
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-15',
      },
      message: 'BVN verified successfully (simulated)',
    };
  }

  try {
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/bank/resolve_bvn/${bvn}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    if (response.data?.status === true) {
      return {
        success: true,
        verified: true,
        data: response.data.data,
        message: 'BVN verified successfully',
      };
    }

    return {
      success: false,
      verified: false,
      message: response.data?.message || 'BVN verification failed',
    };
  } catch (error) {
    console.error('❌ BVN verification error:', error.message);
    return {
      success: false,
      verified: false,
      message: error.response?.data?.message || 'BVN verification failed',
      error: error.message,
    };
  }
};

/**
 * Verify NIN using Paystack API
 * @param {string} nin - 11-digit NIN
 * @param {string} dateOfBirth - Date of birth in YYYY-MM-DD format
 * @returns {Promise<Object>} Verification result
 */
const verifyNIN = async (nin, dateOfBirth) => {
  if (!PAYSTACK_API_KEY) {
    // Dev mode: simulate verification
    console.log(`📋 [NIN VERIFICATION - DEV] NIN: ${nin}, DOB: ${dateOfBirth}`);
    return {
      success: true,
      verified: true,
      data: {
        nin,
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth,
        gender: 'M',
      },
      message: 'NIN verified successfully (simulated)',
    };
  }

  try {
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/identity/nin/resolve`,
      {
        params: {
          nin,
          date_of_birth: dateOfBirth,
        },
        headers: {
          Authorization: `Bearer ${PAYSTACK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    if (response.data?.status === true) {
      return {
        success: true,
        verified: true,
        data: response.data.data,
        message: 'NIN verified successfully',
      };
    }

    return {
      success: false,
      verified: false,
      message: response.data?.message || 'NIN verification failed',
    };
  } catch (error) {
    console.error('❌ NIN verification error:', error.message);
    return {
      success: false,
      verified: false,
      message: error.response?.data?.message || 'NIN verification failed',
      error: error.message,
    };
  }
};

/**
 * Verify both BVN and NIN
 * @param {string} bvn - 11-digit BVN
 * @param {string} nin - 11-digit NIN
 * @param {string} dateOfBirth - Date of birth in YYYY-MM-DD format
 * @returns {Promise<Object>} Combined verification result
 */
const verifyIdentity = async (bvn, nin, dateOfBirth) => {
  try {
    const [bvnResult, ninResult] = await Promise.all([
      verifyBVN(bvn),
      verifyNIN(nin, dateOfBirth),
    ]);

    return {
      success: bvnResult.success && ninResult.success,
      verified: bvnResult.verified && ninResult.verified,
      bvn: bvnResult,
      nin: ninResult,
      message: bvnResult.verified && ninResult.verified
        ? 'Identity verified successfully'
        : 'Identity verification failed',
    };
  } catch (error) {
    console.error('❌ Identity verification error:', error.message);
    return {
      success: false,
      verified: false,
      message: 'Identity verification failed',
      error: error.message,
    };
  }
};

module.exports = {
  verifyBVN,
  verifyNIN,
  verifyIdentity,
};
