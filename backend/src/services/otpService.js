const crypto = require('crypto');
const axios = require('axios');

const TERMII_API_KEY = process.env.TERMII_API_KEY;
const TERMII_SENDER_ID = process.env.TERMII_SENDER_ID || 'N-Alert';
const TERMII_BASE_URL = 'https://v3.api.termii.com/api';

const OTP_EXPIRY_MINUTES = 10;
const OTP_LENGTH = 6;

/**
 * Generate a random numeric OTP
 */
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Hash OTP for storage (never store plain OTP)
 */
const hashOtp = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

/**
 * Send OTP via Termii SMS
 */
const sendOtpSms = async (phoneNumber, otp) => {
  // Normalize to international format for Termii
  const normalized = phoneNumber.startsWith('+')
    ? phoneNumber.slice(1) // Termii wants no leading +
    : phoneNumber.startsWith('0')
    ? `234${phoneNumber.slice(1)}`
    : phoneNumber;

  const message = `Your AjoSave verification code is: ${otp}. Valid for ${OTP_EXPIRY_MINUTES} minutes. Do not share this code.`;

  if (!TERMII_API_KEY) {
    // No SMS provider — log and return OTP in response for testing
    console.log(`📱 [OTP NO-SMS] Code for ${phoneNumber}: ${otp}`);
    return { success: true, dev: true, otp };
  }

  // Always log OTP in dev so you can test without SMS
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📱 [OTP] Code for ${normalized}: ${otp}`);
  }

  const payload = {
    to: normalized,
    from: TERMII_SENDER_ID,
    sms: message,
    type: 'plain',
    channel: 'generic',
    api_key: TERMII_API_KEY,
  };

  const response = await axios.post(`${TERMII_BASE_URL}/sms/send`, payload, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
  });

  console.log('📡 Termii response status:', response.status);
  console.log('📡 Termii response data:', JSON.stringify(response.data));

  if (response.data?.code !== 'ok') {
    console.error('❌ Termii error response:', JSON.stringify(response.data));
    throw new Error(`Termii error: ${response.data?.message || 'Unknown error'}`);
  }

  return { success: true };
};

/**
 * Create and store OTP on user document, then send via SMS.
 * In development: skips SMS and returns the OTP in the response data.
 * In production: sends via Termii SMS.
 */
const createAndSendOtp = async (user) => {
  const otp = generateOtp();
  const expiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  user.otpCode = hashOtp(otp);
  user.otpExpiry = expiry;
  await user.save();

  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    console.log(`\n📱 ========== DEV OTP ==========`);
    console.log(`   Phone : ${user.phoneNumber}`);
    console.log(`   Code  : ${otp}`);
    console.log(`================================\n`);
    return { expiry, devOtp: otp };
  }

  // Send via Termii if key is configured
  try {
    const result = await sendOtpSms(user.phoneNumber, otp);
    // If no SMS provider, return OTP so it can be included in API response
    if (result.dev) return { expiry, devOtp: result.otp };
  } catch (smsErr) {
    console.error(`⚠️ SMS delivery failed for ${user.phoneNumber}:`, smsErr.message);
    // SMS failed — return OTP in response as fallback so auth still works
    return { expiry, devOtp: otp };
  }

  // Always return devOtp so frontend can autofill (remove when real SMS is active)
  return { expiry, devOtp: otp };
};

/**
 * Verify OTP against stored hash.
 * Clears OTP fields on success.
 * Returns true/false.
 */
const verifyOtp = async (user, otp) => {
  if (!user.otpCode || !user.otpExpiry) return false;
  if (new Date() > user.otpExpiry) return false;
  if (hashOtp(otp) !== user.otpCode) return false;

  // Clear OTP after successful verification
  user.otpCode = undefined;
  user.otpExpiry = undefined;
  await user.save();

  return true;
};

module.exports = { createAndSendOtp, verifyOtp, hashOtp };
