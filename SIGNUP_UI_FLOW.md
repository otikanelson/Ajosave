# Signup UI Flow & Visual Guide

## Web Signup Flow

### Step 1: Basic Information
```
┌─────────────────────────────────────┐
│  Welcome Back                       │
├─────────────────────────────────────┤
│  [Login] [Sign Up]                  │
├─────────────────────────────────────┤
│                                     │
│  Step Indicator:                    │
│  ① ─── ② ─── ③                     │
│                                     │
│  Create Your Account                │
│                                     │
│  First Name*    Last Name*          │
│  [John      ]   [Doe        ]       │
│                                     │
│  Email Address*                     │
│  [john@example.com                ] │
│                                     │
│  Phone Number*                      │
│  [🇳🇬 +234] [8012345678]           │
│                                     │
│  Password*                          │
│  [••••••••••••••••] [👁]            │
│  At least 6 chars with uppercase... │
│                                     │
│  [Back] [Continue →]                │
└─────────────────────────────────────┘
```

### Step 2: Identity Verification
```
┌─────────────────────────────────────┐
│  Welcome Back                       │
├─────────────────────────────────────┤
│  [Login] [Sign Up]                  │
├─────────────────────────────────────┤
│                                     │
│  Step Indicator:                    │
│  ✓ ─── ② ─── ③                     │
│                                     │
│  Verify Your Identity               │
│                                     │
│  ℹ️ We need to verify your identity │
│     using your BVN and NIN for      │
│     security purposes.              │
│                                     │
│  BVN (11 digits)*                   │
│  [12345678901] [Verify]             │
│  11-digit Bank Verification Number  │
│                                     │
│  NIN (11 digits)*                   │
│  [12345678901] [Verify]             │
│  11-digit National ID Number        │
│                                     │
│  Date of Birth*                     │
│  [YYYY-MM-DD]                       │
│  You must be at least 18 years old  │
│                                     │
│  [Back] [Continue →]                │
└─────────────────────────────────────┘
```

### Step 2: Verification in Progress
```
┌─────────────────────────────────────┐
│  BVN (11 digits)*                   │
│  [12345678901] [✓ Verified]         │
│  ✓ BVN verified successfully        │
│                                     │
│  NIN (11 digits)*                   │
│  [12345678901] [⟳ Verifying...]    │
│  Validating NIN...                  │
│                                     │
│  Date of Birth*                     │
│  [1990-01-15]                       │
│                                     │
│  [Back] [Continue →]                │
└─────────────────────────────────────┘
```

### Step 3: Review & Confirm
```
┌─────────────────────────────────────┐
│  Welcome Back                       │
├─────────────────────────────────────┤
│  [Login] [Sign Up]                  │
├─────────────────────────────────────┤
│                                     │
│  Step Indicator:                    │
│  ✓ ─── ✓ ─── ③                     │
│                                     │
│  Review Your Information            │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ First Name      John             ││
│  │ Last Name       Doe              ││
│  │ Email           john@example.com ││
│  │ Phone           +2348012345678   ││
│  │ BVN             12345678901      ││
│  │ NIN             12345678901      ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ ✓ All verifications passed      ││
│  │ Your identity has been verified ││
│  │ successfully.                   ││
│  └─────────────────────────────────┘│
│                                     │
│  [Back] [Create Account →]          │
└─────────────────────────────────────┘
```

### Step 4: OTP Verification (Existing)
```
┌─────────────────────────────────────┐
│  Verify Your Phone                  │
├─────────────────────────────────────┤
│                                     │
│  Enter the 6-digit code sent to     │
│  +234 801 234 5678                  │
│                                     │
│  [1] [2] [3] [4] [5] [6]            │
│                                     │
│  Resend code in 0:30                │
│                                     │
│  [Verify →]                         │
│                                     │
│  ✓ Account Created!                 │
│  Your wallet has been created       │
│  automatically.                     │
│  Redirecting to dashboard...        │
└─────────────────────────────────────┘
```

---

## Mobile Signup Flow

### Screen 1: Create Account
```
┌──────────────────────────────┐
│ ← AjoSave                    │
├──────────────────────────────┤
│                              │
│      Hello!                  │
│   Welcome to AjoSave         │
│                              │
│         ┌────────┐           │
│         │   👤   │           │
│         └────────┘           │
│                              │
│  First Name                  │
│  [Enter your first name    ] │
│                              │
│  Last Name                   │
│  [Enter your last name     ] │
│                              │
│  Email Address               │
│  [Enter your email         ] │
│  e.g. yourname@example.com   │
│                              │
│  Phone Number                │
│  [+234] [8012345678       ]  │
│                              │
│  Password                    │
│  [Min 8 characters       ] 👁 │
│  Min 8 chars with uppercase  │
│                              │
│  ┌──────────────────────────┐│
│  │ Continue →               ││
│  └──────────────────────────┘│
│                              │
│  Already have an account?    │
│  Sign In                     │
└──────────────────────────────┘
```

### Screen 2: KYC Verification
```
┌──────────────────────────────┐
│ ← AjoSave                    │
├──────────────────────────────┤
│                              │
│  Verify Your Identity        │
│  Step 1 of 2: KYC Verification
│                              │
│      ┌────────┐              │
│      │   🛡️   │              │
│      └────────┘              │
│                              │
│  ℹ️ Please provide your BVN  │
│     and NIN for identity     │
│     verification.            │
│                              │
│  BVN (11 digits)             │
│  [12345678901             ]  │
│                              │
│  NIN (11 digits)             │
│  [12345678901             ]  │
│                              │
│  Date of Birth               │
│  [YYYY-MM-DD              ]  │
│                              │
│  ┌──────────────────────────┐│
│  │ Verify & Continue →      ││
│  └──────────────────────────┘│
└──────────────────────────────┘
```

### Screen 2: Verification Animation
```
┌──────────────────────────────┐
│                              │
│  ┌────────────────────────┐  │
│  │                        │  │
│  │    ⟳ Verifying        │  │
│  │                        │  │
│  │  Validating BVN...     │  │
│  │                        │  │
│  │  ● ● ● ●              │  │
│  │                        │  │
│  └────────────────────────┘  │
│                              │
│  (Shows steps:)              │
│  1. Validating BVN...        │
│  2. Validating NIN...        │
│  3. Cross-checking identity..│
│  4. Finalising verification..│
└──────────────────────────────┘
```

### Screen 3: OTP Verification
```
┌──────────────────────────────┐
│ ← AjoSave                    │
├──────────────────────────────┤
│                              │
│      Verify OTP              │
│  Step 2 of 2: Phone Verify   │
│                              │
│      ┌────────┐              │
│      │   🔒   │              │
│      └────────┘              │
│                              │
│  We've sent a 6-digit code   │
│  to +234 801 ****5678        │
│                              │
│  Enter Code                  │
│  [1] [2] [3] [4] [5] [6]     │
│                              │
│  Resend code in 0:30         │
│                              │
│  ┌──────────────────────────┐│
│  │ Verify →                 ││
│  └──────────────────────────┘│
│                              │
│  ✓ Account Created!          │
│  Setting up biometric...     │
└──────────────────────────────┘
```

---

## Verification Status Indicators

### Web
```
Unverified:     [Verify]           (Blue button)
Verifying:      [⟳ Verifying...]   (Spinner)
Verified:       [✓ Verified]       (Green button)
Error:          [Verify]           (Red border, error message)
```

### Mobile
```
Unverified:     [Verify & Continue →]
Verifying:      [⟳ Verifying...]
Verified:       ✓ (Green checkmark)
Error:          Error message displayed
```

---

## Step Indicator Progress

### Web
```
Step 1: ① ─── ② ─── ③
Step 2: ✓ ─── ② ─── ③
Step 3: ✓ ─── ✓ ─── ③
```

### Mobile
```
Screen 1: Create Account
Screen 2: Step 1 of 2 - KYC Verification
Screen 3: Step 2 of 2 - OTP Verification
```

---

## Error States

### Web - BVN Error
```
BVN (11 digits)*
[12345678901] [Verify]
❌ BVN verification failed: Invalid BVN
```

### Web - NIN Error
```
NIN (11 digits)*
[12345678901] [Verify]
❌ NIN verification failed: Invalid NIN
```

### Mobile - Validation Error
```
BVN (11 digits)
[1234567890] ← Only 10 digits
❌ BVN must be 11 digits
```

---

## Success States

### Web - All Verified
```
┌─────────────────────────────────┐
│ ✓ All verifications passed      │
│ Your identity has been verified │
│ successfully.                   │
└─────────────────────────────────┘
```

### Mobile - Account Created
```
✓ Account Created!
Setting up biometric...
```

---

## Responsive Breakpoints

### Web
- Desktop (1024px+): Full 3-column layout
- Tablet (768px-1023px): 2-column layout
- Mobile (< 768px): Single column, stacked

### Mobile
- All screens optimized for mobile-first design
- Keyboard-aware scrolling
- Touch-friendly input fields
- Large tap targets (44px minimum)

---

## Accessibility Features

✓ Clear step indicators
✓ Descriptive labels for all inputs
✓ Error messages with icons
✓ Loading states with spinners
✓ Success confirmations
✓ Keyboard navigation support
✓ Screen reader friendly
✓ High contrast colors
✓ Sufficient spacing between elements
✓ Clear call-to-action buttons
