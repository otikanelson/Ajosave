# Requirements Document

## Introduction

This document specifies the requirements for implementing complete backend API integration across all mobile UI screens in the AjoSave mobile application. The feature connects existing React Native Expo screens with the backend API through established service layers and context providers, enabling full functionality for user authentication, wallet management, savings group operations, and payment processing.

The backend API is operational at http://localhost:5000/api with httpOnly cookie-based JWT authentication. Service layers (authService, walletService, groupService, transactionService) and context providers (AuthContext, WalletContext, GroupsContext) are already implemented. This feature focuses on updating UI screens to consume these services with proper validation, loading states, and error handling.

## Glossary

- **Mobile_App**: The React Native Expo mobile application for AjoSave
- **Backend_API**: The REST API server running at http://localhost:5000/api
- **Auth_Service**: Authentication service layer providing signup, login, verify, logout operations
- **Wallet_Service**: Wallet service layer providing balance, bank account, and transaction operations
- **Group_Service**: Group service layer providing create, join, and group management operations
- **Transaction_Service**: Transaction service layer providing contribution and transaction history operations
- **Auth_Context**: React context provider managing authentication state
- **Wallet_Context**: React context provider managing wallet and transaction state
- **Groups_Context**: React context provider managing groups state
- **Signup_Screen**: User registration screen at mobile/app/(auth)/signup.tsx
- **Signin_Screen**: User login screen at mobile/app/(auth)/signin.tsx
- **KYC_Screen**: User verification screen at mobile/app/(auth)/kyc.tsx
- **Home_Screen**: Dashboard screen at mobile/app/(tabs)/home.tsx
- **Wallet_Screen**: Wallet management screen at mobile/app/(tabs)/wallet.tsx
- **Groups_Screen**: Groups listing screen at mobile/app/(tabs)/groups.tsx
- **Pay_Screen**: Payment/contribution screen at mobile/app/(tabs)/pay.tsx
- **Paystack**: Third-party payment gateway for processing contributions
- **KYC**: Know Your Customer - identity verification process requiring BVN, NIN, and personal details
- **BVN**: Bank Verification Number - 11-digit Nigerian bank identifier
- **NIN**: National Identification Number - 11-digit Nigerian identity number
- **httpOnly_Cookie**: Secure cookie mechanism for storing JWT tokens, automatically sent with requests

## Requirements

### Requirement 1: Signup Screen Backend Integration

**User Story:** As a new user, I want to register with my complete KYC information so that I can create an account and access the platform.

#### Acceptance Criteria

1. THE Signup_Screen SHALL collect firstName, lastName, email, phoneNumber, password, BVN, NIN, and dateOfBirth fields
2. WHEN the user submits the signup form, THE Signup_Screen SHALL validate that firstName is not empty and contains only letters
3. WHEN the user submits the signup form, THE Signup_Screen SHALL validate that lastName is not empty and contains only letters
4. WHEN the user submits the signup form, THE Signup_Screen SHALL validate that email matches standard email format
5. WHEN the user submits the signup form, THE Signup_Screen SHALL validate that phoneNumber is not empty and matches Nigerian phone format
6. WHEN the user submits the signup form, THE Signup_Screen SHALL validate that password is at least 8 characters long
7. WHEN the user submits the signup form, THE Signup_Screen SHALL validate that BVN is exactly 11 digits
8. WHEN the user submits the signup form, THE Signup_Screen SHALL validate that NIN is exactly 11 digits
9. WHEN the user submits the signup form, THE Signup_Screen SHALL validate that dateOfBirth is in ISO format (YYYY-MM-DD) and user is at least 18 years old
10. WHEN all validations pass, THE Signup_Screen SHALL call Auth_Context.signup() with the form data
11. WHILE the signup request is processing, THE Signup_Screen SHALL display a loading indicator and disable the submit button
12. WHEN the signup succeeds, THE Signup_Screen SHALL navigate to the Home_Screen
13. IF the signup fails, THEN THE Signup_Screen SHALL display the error message to the user
14. WHEN the signup fails, THE Signup_Screen SHALL re-enable the submit button

### Requirement 2: Signin Screen Backend Integration

**User Story:** As a registered user, I want to login with my phone number and password so that I can access my account.

#### Acceptance Criteria

1. THE Signin_Screen SHALL collect phoneNumber and password fields
2. WHEN the user submits the signin form, THE Signin_Screen SHALL validate that phoneNumber is not empty
3. WHEN the user submits the signin form, THE Signin_Screen SHALL validate that password is not empty
4. WHEN all validations pass, THE Signin_Screen SHALL call Auth_Context.login() with phoneNumber and password
5. WHILE the login request is processing, THE Signin_Screen SHALL display a loading indicator and disable the submit button
6. WHEN the login succeeds, THE Signin_Screen SHALL navigate to the Home_Screen
7. IF the login fails, THEN THE Signin_Screen SHALL display the error message to the user
8. WHEN the login fails, THE Signin_Screen SHALL re-enable the submit button and clear the password field

### Requirement 3: KYC Verification Screen Backend Integration

**User Story:** As a registered user, I want to complete my verification by providing my address so that I can access all platform features.

#### Acceptance Criteria

1. THE KYC_Screen SHALL collect the address field
2. WHEN the user submits the verification form, THE KYC_Screen SHALL validate that address is not empty and at least 10 characters long
3. WHEN validation passes, THE KYC_Screen SHALL call Auth_Context.verifyUser() with the address
4. WHILE the verification request is processing, THE KYC_Screen SHALL display a loading indicator and disable the submit button
5. WHEN the verification succeeds, THE KYC_Screen SHALL navigate to the Home_Screen
6. IF the verification fails, THEN THE KYC_Screen SHALL display the error message to the user
7. WHEN the verification fails, THE KYC_Screen SHALL re-enable the submit button

### Requirement 4: Home Dashboard Screen Backend Integration

**User Story:** As an authenticated user, I want to see my wallet balance and recent transactions on the home screen so that I can monitor my savings activity.

#### Acceptance Criteria

1. WHEN the Home_Screen loads, THE Home_Screen SHALL call Wallet_Context.fetchWallet() to retrieve wallet data
2. WHEN the Home_Screen loads, THE Home_Screen SHALL call Wallet_Context.fetchTransactions() with limit of 5 to retrieve recent transactions
3. WHILE wallet data is loading, THE Home_Screen SHALL display a loading skeleton for the balance section
4. WHEN wallet data is available, THE Home_Screen SHALL display wallet.availableBalance formatted as currency
5. WHEN wallet data is available, THE Home_Screen SHALL display wallet.totalContributions formatted as currency
6. WHEN wallet data is available, THE Home_Screen SHALL display wallet.totalPayouts formatted as currency
7. WHEN transactions are available, THE Home_Screen SHALL display the 5 most recent transactions with amount, type, and date
8. WHEN the user pulls to refresh, THE Home_Screen SHALL call Wallet_Context.refreshWallet() to reload data
9. IF wallet data fails to load, THEN THE Home_Screen SHALL display an error message with a retry button
10. WHEN the retry button is pressed, THE Home_Screen SHALL attempt to reload wallet data

### Requirement 5: Wallet Screen Backend Integration

**User Story:** As an authenticated user, I want to view my complete transaction history and manage my bank accounts so that I can track my financial activity.

#### Acceptance Criteria

1. WHEN the Wallet_Screen loads, THE Wallet_Screen SHALL call Wallet_Context.fetchTransactions() to retrieve all transactions
2. WHEN the Wallet_Screen loads, THE Wallet_Screen SHALL call Wallet_Service.getBankAccounts() to retrieve linked bank accounts
3. WHILE transaction data is loading, THE Wallet_Screen SHALL display a loading skeleton
4. WHEN transactions are available, THE Wallet_Screen SHALL display all transactions in reverse chronological order
5. FOR ALL transactions displayed, THE Wallet_Screen SHALL show transaction type, amount, status, description, and date
6. WHEN bank accounts are available, THE Wallet_Screen SHALL display each account with accountName, accountNumber, and bankName
7. WHEN bank accounts are available, THE Wallet_Screen SHALL indicate which account is marked as primary
8. WHEN the user presses the add bank account button, THE Wallet_Screen SHALL navigate to the add bank account flow
9. WHEN the user pulls to refresh, THE Wallet_Screen SHALL reload transactions and bank accounts
10. IF transaction data fails to load, THEN THE Wallet_Screen SHALL display an error message with a retry button

### Requirement 6: Add Bank Account Flow

**User Story:** As an authenticated user, I want to add my bank account so that I can receive payouts from savings groups.

#### Acceptance Criteria

1. THE Add_Bank_Account_Form SHALL collect accountNumber and bankCode fields
2. WHEN the user enters a 10-digit accountNumber and selects a bankCode, THE Add_Bank_Account_Form SHALL call Wallet_Service.verifyBankAccount() to verify the account
3. WHILE account verification is processing, THE Add_Bank_Account_Form SHALL display a loading indicator
4. WHEN verification succeeds, THE Add_Bank_Account_Form SHALL display the returned accountName for user confirmation
5. WHEN the user confirms the account details, THE Add_Bank_Account_Form SHALL call Wallet_Service.addBankAccount() with accountNumber, accountName, bankCode, and bankName
6. WHEN the bank account is added successfully, THE Add_Bank_Account_Form SHALL call Wallet_Context.refreshWallet() to update wallet data
7. WHEN the bank account is added successfully, THE Add_Bank_Account_Form SHALL navigate back to the Wallet_Screen
8. IF verification fails, THEN THE Add_Bank_Account_Form SHALL display an error message indicating invalid account details
9. IF adding the bank account fails, THEN THE Add_Bank_Account_Form SHALL display the error message to the user

### Requirement 7: Groups Screen Backend Integration

**User Story:** As an authenticated user, I want to view all my savings groups and create or join new groups so that I can participate in collective savings.

#### Acceptance Criteria

1. WHEN the Groups_Screen loads, THE Groups_Screen SHALL call Groups_Context.fetchGroups() to retrieve user's groups
2. WHILE groups data is loading, THE Groups_Screen SHALL display a loading skeleton
3. WHEN groups are available, THE Groups_Screen SHALL display each group with name, contributionAmount, frequency, status, and memberCount
4. FOR ALL groups displayed, THE Groups_Screen SHALL show the next contribution date if status is active
5. WHEN the user presses a group item, THE Groups_Screen SHALL navigate to the group details screen with the groupId
6. WHEN the user presses the create group button, THE Groups_Screen SHALL navigate to the create group form
7. WHEN the user presses the join group button, THE Groups_Screen SHALL navigate to the join group form
8. WHEN the user pulls to refresh, THE Groups_Screen SHALL call Groups_Context.refreshGroups() to reload data
9. IF groups data fails to load, THEN THE Groups_Screen SHALL display an error message with a retry button
10. WHEN no groups exist, THE Groups_Screen SHALL display an empty state with create and join group options

### Requirement 8: Create Group Flow

**User Story:** As an authenticated user, I want to create a new savings group so that I can invite others to save together.

#### Acceptance Criteria

1. THE Create_Group_Form SHALL collect name, description, maxMembers, duration, contributionAmount, frequency, and payoutOrder fields
2. WHEN the user submits the form, THE Create_Group_Form SHALL validate that name is not empty and at least 3 characters long
3. WHEN the user submits the form, THE Create_Group_Form SHALL validate that maxMembers is between 2 and 50
4. WHEN the user submits the form, THE Create_Group_Form SHALL validate that duration is between 1 and 52
5. WHEN the user submits the form, THE Create_Group_Form SHALL validate that contributionAmount is greater than 0
6. WHEN the user submits the form, THE Create_Group_Form SHALL validate that frequency is one of Weekly, Bi-Weekly, or Monthly
7. WHEN the user submits the form, THE Create_Group_Form SHALL validate that payoutOrder is one of random, firstCome, or bidding
8. WHEN all validations pass, THE Create_Group_Form SHALL call Groups_Context.createGroup() with the form data
9. WHILE the create request is processing, THE Create_Group_Form SHALL display a loading indicator and disable the submit button
10. WHEN the group is created successfully, THE Create_Group_Form SHALL display the invitationCode to the user
11. WHEN the group is created successfully, THE Create_Group_Form SHALL provide options to share the invitationCode or navigate to the group details
12. IF group creation fails, THEN THE Create_Group_Form SHALL display the error message to the user

### Requirement 9: Join Group Flow

**User Story:** As an authenticated user, I want to join an existing savings group using an invitation code so that I can participate in the group's savings cycle.

#### Acceptance Criteria

1. THE Join_Group_Form SHALL collect an invitationCode field
2. WHEN the user enters an invitationCode, THE Join_Group_Form SHALL convert it to uppercase
3. WHEN the user submits the form, THE Join_Group_Form SHALL validate that invitationCode is not empty and exactly 6 characters
4. WHEN validation passes, THE Join_Group_Form SHALL call Groups_Context.findGroupByCode() with the invitationCode
5. WHILE the search is processing, THE Join_Group_Form SHALL display a loading indicator
6. WHEN a group is found, THE Join_Group_Form SHALL display group details including name, contributionAmount, frequency, and current member count
7. WHEN the user confirms joining, THE Join_Group_Form SHALL call Groups_Context.joinGroup() with the groupId
8. WHEN the join succeeds, THE Join_Group_Form SHALL navigate to the group details screen
9. IF the group is not found, THEN THE Join_Group_Form SHALL display an error message indicating invalid code
10. IF the group is full, THEN THE Join_Group_Form SHALL display an error message indicating the group has reached maximum members
11. IF joining fails, THEN THE Join_Group_Form SHALL display the error message to the user

### Requirement 10: Pay Screen Backend Integration

**User Story:** As a group member, I want to make contributions to my savings groups using Paystack so that I can fulfill my savings commitments.

#### Acceptance Criteria

1. WHEN the Pay_Screen loads, THE Pay_Screen SHALL call Groups_Context.fetchGroups() to retrieve groups requiring contributions
2. THE Pay_Screen SHALL display only groups with status of active
3. FOR ALL active groups displayed, THE Pay_Screen SHALL show the contributionAmount and next contribution date
4. WHEN the user selects a group and presses pay, THE Pay_Screen SHALL initialize Paystack payment with the contributionAmount
5. WHEN Paystack payment is initialized, THE Pay_Screen SHALL pass the user's email and the contributionAmount to Paystack
6. WHILE payment is processing, THE Pay_Screen SHALL display a loading indicator
7. WHEN Paystack payment succeeds, THE Pay_Screen SHALL receive a payment reference
8. WHEN payment reference is received, THE Pay_Screen SHALL call Transaction_Service.createContribution() with groupId, reference, and amount
9. WHEN the contribution is recorded successfully, THE Pay_Screen SHALL display a success message with transaction details
10. WHEN the contribution is recorded successfully, THE Pay_Screen SHALL call Wallet_Context.refreshWallet() to update wallet balance
11. WHEN the contribution is recorded successfully, THE Pay_Screen SHALL call Groups_Context.refreshGroups() to update group data
12. IF Paystack payment fails, THEN THE Pay_Screen SHALL display the Paystack error message to the user
13. IF recording the contribution fails, THEN THE Pay_Screen SHALL display an error message and advise the user to contact support with the payment reference

### Requirement 11: Group Details Screen Implementation

**User Story:** As a group member, I want to view detailed information about a savings group so that I can track the group's progress and member activity.

#### Acceptance Criteria

1. WHEN the Group_Details_Screen loads, THE Group_Details_Screen SHALL call Groups_Context.fetchGroupDetails() with the groupId
2. WHILE group details are loading, THE Group_Details_Screen SHALL display a loading skeleton
3. WHEN group details are available, THE Group_Details_Screen SHALL display name, description, contributionAmount, frequency, and status
4. WHEN group details are available, THE Group_Details_Screen SHALL display currentTurn, totalPool, and credibilityScore
5. WHEN group details are available, THE Group_Details_Screen SHALL display the complete membersList with each member's name, role, status, and contribution statistics
6. WHEN group details are available, THE Group_Details_Screen SHALL display nextContribution date if status is active
7. WHEN group details are available, THE Group_Details_Screen SHALL display nextPayout date if status is active
8. WHEN the user is the group admin, THE Group_Details_Screen SHALL display the invitationCode for sharing
9. WHEN the user pulls to refresh, THE Group_Details_Screen SHALL reload group details
10. IF group details fail to load, THEN THE Group_Details_Screen SHALL display an error message with a retry button

### Requirement 12: Form Validation Error Display

**User Story:** As a user filling out forms, I want to see clear validation errors so that I can correct my input and successfully submit forms.

#### Acceptance Criteria

1. WHEN a form field fails validation, THE Mobile_App SHALL display an error message below the field
2. THE Mobile_App SHALL display validation errors in red text
3. WHEN a field with an error is corrected, THE Mobile_App SHALL remove the error message
4. WHEN the user attempts to submit a form with validation errors, THE Mobile_App SHALL prevent submission and highlight all invalid fields
5. THE Mobile_App SHALL display specific error messages for each validation rule (e.g., "BVN must be exactly 11 digits")

### Requirement 13: Loading State Management

**User Story:** As a user performing actions, I want to see loading indicators so that I know the app is processing my request.

#### Acceptance Criteria

1. WHILE any API request is processing, THE Mobile_App SHALL display a loading indicator
2. WHILE a form is submitting, THE Mobile_App SHALL disable the submit button to prevent duplicate submissions
3. WHILE data is loading on a screen, THE Mobile_App SHALL display loading skeletons matching the expected content layout
4. WHEN a pull-to-refresh action is triggered, THE Mobile_App SHALL display the native refresh indicator
5. THE Mobile_App SHALL remove all loading indicators when the request completes or fails

### Requirement 14: Error Handling and User Feedback

**User Story:** As a user encountering errors, I want to see clear error messages and recovery options so that I can resolve issues and continue using the app.

#### Acceptance Criteria

1. WHEN an API request fails, THE Mobile_App SHALL display the error message returned from the Backend_API
2. WHEN a network error occurs, THE Mobile_App SHALL display a message indicating no internet connection
3. WHEN an authentication error occurs (401), THE Mobile_App SHALL log the user out and navigate to the Signin_Screen
4. WHEN a server error occurs (500), THE Mobile_App SHALL display a generic error message and provide a retry option
5. WHEN an error occurs during a critical operation, THE Mobile_App SHALL log the error details for debugging
6. THE Mobile_App SHALL display error messages using native alerts or toast notifications
7. WHEN an error has a retry option, THE Mobile_App SHALL provide a retry button that repeats the failed operation

### Requirement 15: Data Caching and Offline Support

**User Story:** As a user with intermittent connectivity, I want to see cached data when offline so that I can still view my information.

#### Acceptance Criteria

1. WHEN the Mobile_App successfully fetches wallet data, THE Mobile_App SHALL cache the data in AsyncStorage
2. WHEN the Mobile_App successfully fetches transactions, THE Mobile_App SHALL cache the data in AsyncStorage
3. WHEN the Mobile_App successfully fetches groups, THE Mobile_App SHALL cache the data in AsyncStorage
4. WHEN the Mobile_App loads a screen while offline, THE Mobile_App SHALL display cached data if available
5. WHEN cached data is displayed, THE Mobile_App SHALL indicate to the user that the data may be outdated
6. WHEN the Mobile_App regains connectivity, THE Mobile_App SHALL automatically refresh cached data in the background
7. WHEN the user logs out, THE Mobile_App SHALL clear all cached data from AsyncStorage

### Requirement 16: Navigation Flow Integration

**User Story:** As a user completing authentication, I want to be automatically navigated to the appropriate screen so that I can access the app seamlessly.

#### Acceptance Criteria

1. WHEN a user successfully signs up, THE Mobile_App SHALL navigate to the Home_Screen
2. WHEN a user successfully signs in, THE Mobile_App SHALL navigate to the Home_Screen
3. WHEN a user successfully completes KYC verification, THE Mobile_App SHALL navigate to the Home_Screen
4. WHEN an unauthenticated user attempts to access a protected screen, THE Mobile_App SHALL navigate to the Signin_Screen
5. WHEN a user logs out, THE Mobile_App SHALL navigate to the Signin_Screen
6. WHEN a user creates a group, THE Mobile_App SHALL navigate to the Group_Details_Screen for the new group
7. WHEN a user joins a group, THE Mobile_App SHALL navigate to the Group_Details_Screen for the joined group
8. WHEN a user completes a contribution, THE Mobile_App SHALL remain on the Pay_Screen and display a success message

### Requirement 17: Input Field Formatting

**User Story:** As a user entering data, I want input fields to be properly formatted so that I can easily provide correct information.

#### Acceptance Criteria

1. WHEN the user types in the phoneNumber field, THE Mobile_App SHALL format the input as a phone number
2. WHEN the user types in the BVN field, THE Mobile_App SHALL restrict input to numeric characters only
3. WHEN the user types in the NIN field, THE Mobile_App SHALL restrict input to numeric characters only
4. WHEN the user types in the contributionAmount field, THE Mobile_App SHALL restrict input to numeric characters and format as currency
5. WHEN the user selects a dateOfBirth, THE Mobile_App SHALL display a date picker and format the result as YYYY-MM-DD
6. WHEN the user types in the invitationCode field, THE Mobile_App SHALL convert input to uppercase automatically
7. THE Mobile_App SHALL display currency amounts formatted with the Nigerian Naira symbol (₦) and thousand separators

### Requirement 18: Paystack Integration Configuration

**User Story:** As a developer, I want Paystack properly configured so that payment processing works correctly in the mobile app.

#### Acceptance Criteria

1. THE Mobile_App SHALL use the Paystack public key from environment configuration
2. WHEN initializing a payment, THE Mobile_App SHALL pass the user's email, amount in kobo (amount * 100), and a unique reference
3. WHEN Paystack payment completes, THE Mobile_App SHALL extract the payment reference from the response
4. THE Mobile_App SHALL handle Paystack payment cancellation by displaying a cancellation message
5. THE Mobile_App SHALL handle Paystack payment errors by displaying the error message from Paystack
6. THE Mobile_App SHALL not store or transmit card details directly - all payment processing SHALL occur through Paystack

