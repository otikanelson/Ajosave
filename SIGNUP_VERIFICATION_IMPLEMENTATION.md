# Multi-Step Signup with Verification Implementation

## Overview
This document outlines the implementation of a comprehensive multi-step signup process with email/phone OTP verification and Paystack BVN/NIN verification for both web and mobile platforms.

---

## Backend Implementation

### 1. Paystack Verification Service
**File:** `backend/src/services/paystackVerification.js`

Provides integration with Paystack API for:
- **BVN Verification**: Validates 11-digit Bank Verification Numbers
- **NIN Verification**: Validates 11-digit National Identification Numbers with date of birth

**Key Functions:**
- `verifyBVN(bvn)` - Verifies BVN using Paystack API
- `verifyNIN(nin, dateOfBirth)` - Verifies NIN using Paystack API
- `verifyIdentity(bvn, nin, dateOfBirth)` - Parallel verification of both

**Dev Mode:** When `PAYSTACK_SECRET_KEY` is not set, the service simulates verification for testing.

### 2. Auth Controller Updates
**File:** `backend/src/controllers/authController.js`

Added two new endpoints:
- `verifyBvnHandler` - POST `/api/auth/verify-bvn`
- `verifyNinHandler` - POST `/api/auth/verify-nin`

These endpoints:
1. Validate input (11 digits for BVN/NIN)
2. Call Paystack verification service
3. Return verification results or error messages

### 3. Auth Routes Updates
**File:** `backend/src/routes/authRoutes.js`

Added routes:
```javascript
router.post('/verify-bvn', verifyBvnHandler);
router.post('/verify-nin', verifyNinHandler);
```

---

## Web Implementation

### 1. Multi-Step Signup Component
**File:** `frontend/src/components/auth/SignupSteps.jsx`

A comprehensive 3-step signup process:

#### Step 1: Basic Information
- First Name & Last Name
- Email Address
- Phone Number (with +234 prefix)
- Password (with strength requirements)

#### Step 2: Identity Verification
- BVN input with inline verification button
- NIN input with inline verification button
- Date of Birth input
- Real-time verification status display
- Paystack API integration

#### Step 3: Review & Confirmation
- Summary of all entered information
- Verification status display
- Final account creation button (only enabled after both BVN and NIN are verified)

**Features:**
- Step indicator with progress tracking
- Form validation at each step
- Real-time error handling
- Loading states during verification
- Inline verification buttons for BVN/NIN
- Visual feedback for verified documents
- Responsive design

### 2. Integration with Auth Page
**File:** `frontend/src/pages/Auth.jsx`

Updated to use `SignupSteps` component instead of the old `Signup` component.

---

## Mobile Implementation

### 1. Create Account Screen (Step 1)
**File:** `mobile/app/(auth)/create-account.tsx`

Collects basic user information:
- First Name & Last Name
- Email Address
- Phone Number
- Password

Routes to KYC verification screen after validation.

### 2. KYC Verification Screen (Step 2)
**File:** `mobile/app/(auth)/kyc-verify.tsx`

New dedicated screen for identity verification:
- BVN input (11 digits)
- NIN input (11 digits)
- Date of Birth input
- Simulated verification process with step-by-step animation
- Paystack API integration

**Features:**
- Step indicator: "Step 1 of 2: KYC Verification"
- Animated verification overlay showing:
  - "Validating BVN..."
  - "Validating NIN..."
  - "Cross-checking identity..."
  - "Finalising verification..."
- Progress dots animation
- Error handling and display

### 3. OTP Verification Screen (Step 2 - Continued)
**File:** `mobile/app/(auth)/verify-otp.tsx`

Existing screen handles OTP verification after KYC:
- 6-digit OTP input
- Auto-fill in dev mode
- Resend functionality with timer
- Routes to setup-biometric on success

---

## Verification Flow

### Web Flow
```
1. User enters basic info (Step 1)
   ↓
2. User enters BVN/NIN/DOB (Step 2)
   ↓
3. User clicks "Verify" for BVN → Paystack API call
   ↓
4. User clicks "Verify" for NIN → Paystack API call
   ↓
5. Review information (Step 3)
   ↓
6. Click "Create Account" → Backend signup
   ↓
7. OTP sent to phone
   ↓
8. User enters OTP
   ↓
9. Account created, redirect to dashboard
```

### Mobile Flow
```
1. User enters basic info (create-account.tsx)
   ↓
2. Click "Continue" → Route to kyc-verify.tsx
   ↓
3. User enters BVN/NIN/DOB (kyc-verify.tsx)
   ↓
4. Click "Verify & Continue" → Backend signup with verification
   ↓
5. Animated verification process
   ↓
6. OTP sent to phone
   ↓
7. Route to verify-otp.tsx
   ↓
8. User enters 6-digit OTP
   ↓
9. Account created, route to setup-biometric
```

---

## API Endpoints

### Verification Endpoints

#### POST `/api/auth/verify-bvn`
**Request:**
```json
{
  "bvn": "12345678901"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "BVN verified successfully",
  "data": {
    "bvn": "12345678901",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-15"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "BVN verification failed: Invalid BVN"
}
```

#### POST `/api/auth/verify-nin`
**Request:**
```json
{
  "nin": "12345678901",
  "dateOfBirth": "1990-01-15"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "NIN verified successfully",
  "data": {
    "nin": "12345678901",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-15",
    "gender": "M"
  }
}
```

---

## Environment Variables

Add to `.env` file:
```
PAYSTACK_SECRET_KEY=sk_live_xxxxx  # For production
# Leave empty for dev mode (simulated verification)
```

---

## Development Mode

When `PAYSTACK_SECRET_KEY` is not set:
- BVN verification returns simulated success
- NIN verification returns simulated success
- Console logs show verification attempts
- Useful for testing without Paystack API calls

---

## Testing Checklist

### Web
- [ ] Step 1: Enter basic info and proceed to Step 2
- [ ] Step 2: Enter BVN and click "Verify" - should show success
- [ ] Step 2: Enter NIN and click "Verify" - should show success
- [ ] Step 3: Review information and create account
- [ ] OTP verification works correctly
- [ ] Account created successfully

### Mobile
- [ ] Create account screen: Enter basic info and continue
- [ ] KYC verify screen: Enter BVN/NIN/DOB
- [ ] Verification animation plays
- [ ] OTP screen appears after verification
- [ ] OTP verification works correctly
- [ ] Account created successfully

---

## Security Considerations

1. **BVN/NIN Validation**: Verified through Paystack API before account creation
2. **OTP Verification**: Required for phone number confirmation
3. **Password Requirements**: Enforced (uppercase, lowercase, numbers)
4. **Age Verification**: Enforced (18+ years old)
5. **Duplicate Prevention**: Checks for existing BVN/NIN/email/phone
6. **Secure Storage**: BVN/NIN stored encrypted in database

---

## Future Enhancements

1. **Face Verification**: Integrate Persona for biometric verification
2. **Email Verification**: Add email confirmation step
3. **Address Verification**: Collect and verify residential address
4. **Document Upload**: Allow users to upload ID documents
5. **Verification Status**: Show verification status in user dashboard
6. **Retry Logic**: Implement exponential backoff for API failures

---

## Files Modified/Created

### Created:
- `backend/src/services/paystackVerification.js`
- `frontend/src/components/auth/SignupSteps.jsx`
- `mobile/app/(auth)/kyc-verify.tsx`

### Modified:
- `backend/src/controllers/authController.js` - Added verification handlers
- `backend/src/routes/authRoutes.js` - Added verification routes
- `frontend/src/pages/Auth.jsx` - Updated to use SignupSteps
- `mobile/app/(auth)/create-account.tsx` - Updated route to kyc-verify

---

## Support

For issues or questions:
1. Check console logs for error messages
2. Verify Paystack API key is set correctly
3. Ensure all required fields are filled
4. Check network connectivity
5. Review backend logs for API errors
