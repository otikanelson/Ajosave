# Signup Verification - Quick Start Guide

## What Was Implemented

### 🌐 Web Platform
**Multi-step signup with 3 screens:**

1. **Step 1: Basic Information**
   - First Name, Last Name, Email, Phone, Password
   - Form validation
   - Progress indicator

2. **Step 2: Identity Verification**
   - BVN input with "Verify" button
   - NIN input with "Verify" button
   - Date of Birth
   - Real-time verification status
   - Paystack API integration

3. **Step 3: Review & Confirm**
   - Summary of all information
   - Verification status display
   - Create Account button (only enabled after verification)

4. **Step 4: OTP Verification** (existing)
   - 6-digit OTP input
   - Auto-fill in dev mode

### 📱 Mobile Platform
**Split into 2 screens:**

1. **Create Account Screen**
   - First Name, Last Name, Email, Phone, Password
   - Routes to KYC verification

2. **KYC Verification Screen** (NEW)
   - BVN, NIN, Date of Birth
   - Animated verification process
   - Shows: "Validating BVN...", "Validating NIN...", etc.
   - Routes to OTP verification

3. **OTP Verification Screen** (existing)
   - 6-digit OTP input
   - Resend functionality

### 🔧 Backend
**New verification service:**
- Paystack BVN verification API
- Paystack NIN verification API
- Dev mode simulation (no API key needed)

---

## How to Test

### Web Testing
1. Go to `/auth` page
2. Click "Sign Up" tab
3. Fill in Step 1 (basic info)
4. Click "Continue"
5. Fill in Step 2 (BVN/NIN/DOB)
6. Click "Verify" buttons for BVN and NIN
7. Wait for verification (simulated in dev mode)
8. Review information in Step 3
9. Click "Create Account"
10. Enter OTP when prompted

### Mobile Testing
1. Navigate to create account screen
2. Fill in basic information
3. Click "Continue"
4. Fill in BVN, NIN, Date of Birth
5. Click "Verify & Continue"
6. Watch animated verification process
7. Enter OTP when prompted

---

## Environment Setup

### For Development (No Paystack Key)
```bash
# Leave PAYSTACK_SECRET_KEY empty or unset
# Verification will be simulated
```

### For Production (With Paystack)
```bash
# Add to .env
PAYSTACK_SECRET_KEY=sk_live_xxxxx
```

---

## Key Features

✅ **Multi-step form** with progress tracking
✅ **Real-time validation** at each step
✅ **Paystack integration** for BVN/NIN verification
✅ **Dev mode** for testing without API keys
✅ **Animated verification** process on mobile
✅ **Error handling** with user-friendly messages
✅ **Responsive design** for all screen sizes
✅ **OTP verification** after account creation
✅ **Age verification** (18+ years old)
✅ **Duplicate prevention** for BVN/NIN/email/phone

---

## API Endpoints

### Verification Endpoints
```
POST /api/auth/verify-bvn
POST /api/auth/verify-nin
```

### Existing Endpoints (Still Used)
```
POST /api/auth/register
POST /api/auth/send-otp
POST /api/auth/verify-otp
```

---

## File Structure

```
backend/
├── src/
│   ├── services/
│   │   └── paystackVerification.js (NEW)
│   ├── controllers/
│   │   └── authController.js (UPDATED)
│   └── routes/
│       └── authRoutes.js (UPDATED)

frontend/
├── src/
│   ├── components/auth/
│   │   └── SignupSteps.jsx (NEW)
│   └── pages/
│       └── Auth.jsx (UPDATED)

mobile/
└── app/(auth)/
    ├── create-account.tsx (UPDATED)
    ├── kyc-verify.tsx (NEW)
    └── verify-otp.tsx (EXISTING)
```

---

## Verification Flow Diagram

### Web
```
Basic Info → Identity Verification → Review → OTP → Dashboard
(Step 1)    (Step 2)                (Step 3) (Step 4)
```

### Mobile
```
Basic Info → KYC Verification → OTP → Setup Biometric
(Screen 1)  (Screen 2)         (Screen 3)
```

---

## Testing with Dev OTP

In development mode, the OTP is automatically returned in the API response:

```json
{
  "success": true,
  "data": {
    "requiresOtp": true,
    "userId": "...",
    "phoneNumber": "+234...",
    "devOtp": "123456"  // Use this for testing
  }
}
```

---

## Common Issues & Solutions

### Issue: Verification button disabled
**Solution:** Ensure BVN/NIN is exactly 11 digits

### Issue: "Paystack API error"
**Solution:** Check if `PAYSTACK_SECRET_KEY` is set correctly in `.env`

### Issue: OTP not received
**Solution:** In dev mode, check console for the OTP code

### Issue: Age validation error
**Solution:** Ensure date of birth is for someone 18+ years old

---

## Next Steps

1. **Test the signup flow** on both web and mobile
2. **Configure Paystack API key** for production
3. **Monitor verification logs** in backend
4. **Gather user feedback** on the process
5. **Optimize based on analytics**

---

## Support & Documentation

- Full implementation details: `SIGNUP_VERIFICATION_IMPLEMENTATION.md`
- Backend service: `backend/src/services/paystackVerification.js`
- Web component: `frontend/src/components/auth/SignupSteps.jsx`
- Mobile screen: `mobile/app/(auth)/kyc-verify.tsx`
