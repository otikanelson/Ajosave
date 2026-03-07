# Requirements Document

## Introduction

The AjoSave mobile app currently swallows API and auth errors silently — they're logged to the console but never surfaced to the user. This feature adds a consistent, user-facing error feedback layer across all auth screens (sign-in, create-account, verify-otp, kyc) and the underlying API/error utilities. Users will see clear, actionable messages instead of staring at a spinner or a blank screen when something goes wrong.

## Glossary

- **App**: The AjoSave React Native / Expo mobile application.
- **Auth_Screen**: Any of the four authentication screens: `signin.tsx`, `create-account.tsx`, `verify-otp.tsx`, `kyc.tsx`.
- **Error_Banner**: An inline, non-modal UI component rendered within a screen that displays an error message to the user.
- **Toast**: A transient, auto-dismissing overlay notification used for non-blocking feedback.
- **ApiError**: The custom error class defined in `utils/errors.ts` that carries `message`, `code`, `status`, and `type` fields.
- **Error_Handler**: The `handleApiError` function in `utils/errors.ts` and the catch blocks in `services/apiService.ts`.
- **Auth_Flow**: The sequence of screens a user traverses during sign-up or sign-in, including OTP verification and KYC.
- **Validation_Error**: A client-side error produced before an API call when user input fails local checks.
- **Network_Error**: An `ApiError` with `type === 'network'`, indicating connectivity or timeout issues.

---

## Requirements

### Requirement 1: Inline Error Display on Auth Screens

**User Story:** As a user, I want to see a clear error message on the screen when my sign-in or sign-up fails, so that I understand what went wrong and can take corrective action.

#### Acceptance Criteria

1. WHEN an API call on an Auth_Screen fails, THE Auth_Screen SHALL display an Error_Banner containing the `message` field of the resulting ApiError.
2. WHEN an Error_Banner is displayed, THE Auth_Screen SHALL render it between the form fields and the submit button, visible without scrolling.
3. WHEN the user modifies any form field after an Error_Banner is shown, THE Auth_Screen SHALL dismiss the Error_Banner.
4. WHEN a new API call is initiated on an Auth_Screen, THE Auth_Screen SHALL dismiss any existing Error_Banner before the call completes.
5. THE Error_Banner SHALL display a distinct visual style (red/error color) that differentiates it from field-level validation errors.

---

### Requirement 2: Contextual Error Messages for Auth Failures

**User Story:** As a user, I want error messages that are specific to what I was trying to do, so that I'm not confused by generic technical messages.

#### Acceptance Criteria

1. WHEN a sign-in attempt returns HTTP 401, THE App SHALL display the message "Incorrect phone number or password. Please try again."
2. WHEN a sign-in attempt returns HTTP 429, THE App SHALL display the message "Too many login attempts. Please wait a moment and try again."
3. WHEN a sign-up attempt returns HTTP 400 or HTTP 422, THE App SHALL display the message from the server response if present, otherwise display "Please check your details and try again."
4. WHEN an OTP verification attempt fails with an expired or invalid code, THE App SHALL display the message "This code is invalid or has expired. Please request a new one."
5. WHEN a KYC submission fails du