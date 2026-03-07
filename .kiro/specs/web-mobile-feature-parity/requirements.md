# Requirements Document

## Introduction

This feature brings full UI parity between the Ajosave web (React/Vite) and mobile (React Native/Expo) platforms, ports missing functionality in both directions, enforces the turn-based contribution business rule, and introduces a new Wallet Lock feature on both platforms. The backend (Node.js/Express) will be extended where new API surface is required.

---

## Glossary

- **Dashboard**: The home screen of the web app (`/dashboard`) or the Home tab of the mobile app.
- **Groups_List**: The page/screen that lists all of a user's savings groups (web `/groups`, mobile Groups tab).
- **Group_Detail**: The page/screen showing a single group's full details, members, and history.
- **Wallet_Page**: The page/screen showing wallet balance, bank accounts, and transactions (web `/wallet`, mobile Wallet tab).
- **Pay_Screen**: The screen used to make a contribution payment (web `/payment`, mobile Pay tab).
- **Web_App**: The React/Vite frontend located in `frontend/`.
- **Mobile_App**: The React Native/Expo app located in `mobile/`.
- **Backend**: The Node.js/Express API located in `backend/`.
- **Upcoming_Contributions_Alert**: A banner that surfaces groups whose `nextContribution` date is approaching or past due.
- **Due_Now_Badge**: A red visual indicator on a group card when `nextContribution` is past due.
- **Progress_Bar**: A horizontal bar showing `currentTurn / maxMembers` cycle progress on a group card.
- **Invitation_Card**: A gradient card displaying a group's `invitationCode` with Copy and Share actions.
- **Credibility_Badge**: A badge displaying a group's `credibilityScore` percentage.
- **History_Tab**: The "History" tab inside Group_Detail that lists group-scoped transactions.
- **Withdraw_Button**: A button on the Wallet_Page that initiates a withdrawal to a linked bank account.
- **Export_Button**: A button on the Wallet_Page that exports the user's transaction history.
- **Auto_Withdrawal_Modal**: A modal for configuring automatic withdrawal of payouts to a bank account.
- **Fund_Wallet_Flow**: The Paystack-powered flow for adding money to the wallet.
- **Transaction_Filters**: Pill-style filter tabs (All / Contribution / Payout / Withdrawal) on the Wallet_Page.
- **Bank_Account_Section**: The section on the Wallet_Page that lists linked bank accounts with primary badge and management actions.
- **Payment_Method_Toggle**: A toggle on the Pay_Screen allowing selection between Wallet and Card (Paystack) payment methods.
- **Turn_Guard**: Backend and frontend logic that prevents a user from paying into a group when it is not their turn.
- **Lock_Feature**: A savings lock/vault that prevents a portion of wallet funds from being spent until a user-defined condition or date is met.
- **Locked_Balance**: The portion of wallet funds currently held in one or more active locks.
- **Lock**: A single savings lock record with an amount, optional label, and a release condition (date or manual).
- **Wallet_Service**: The backend service and frontend/mobile service layer handling wallet operations.
- **Transaction**: A record of a financial event (contribution, payout, withdrawal, fund_wallet, lock, unlock).

---

## Requirements

### Requirement 1: Upcoming Contributions Alert on Mobile Dashboard

**User Story:** As a mobile user, I want to see an alert on my home screen when I have upcoming contribution due dates, so that I am reminded to make payments on time.

#### Acceptance Criteria

1. WHEN the Home screen loads and at least one active group has a `nextContribution` date within the next 7 days, THE Mobile_App SHALL display an Upcoming_Contributions_Alert banner below the balance card.
2. THE Upcoming_Contributions_Alert SHALL list up to 3 groups, showing each group's name, contribution amount, and formatted due date.
3. WHEN the user taps the "Make Payment" link inside the Upcoming_Contributions_Alert, THE Mobile_App SHALL navigate to the Pay_Screen.
4. IF no active groups have a `nextContribution` date within the next 7 days, THEN THE Mobile_App SHALL NOT render the Upcoming_Contributions_Alert banner.

---

### Requirement 2: "Due Now" Badge on Mobile Group Cards

**User Story:** As a mobile user, I want to see a clear visual indicator on group cards when a contribution is overdue, so that I can immediately identify which groups need urgent attention.

#### Acceptance Criteria

1. WHEN a group card is rendered on the Groups_List and the group's `nextContribution` date is earlier than the current date, THE Mobile_App SHALL display a red "Due Now" badge on that group card.
2. THE Due_Now_Badge SHALL be visually distinct from the group's status badge and SHALL use a red background with white text.
3. WHEN a group's `nextContribution` date is in the future, THE Mobile_App SHALL NOT display the Due_Now_Badge on that group card.

---

### Requirement 3: Progress Bar on Mobile Group Cards

**User Story:** As a mobile user, I want to see cycle progress on each group card, so that I can quickly understand how far along each group's savings cycle is.

#### Acceptance Criteria

1. THE Mobile_App SHALL display a Progress_Bar on each group card in the Groups_List showing `currentTurn / maxMembers` as a filled proportion.
2. THE Progress_Bar SHALL display a label showing the numeric values (e.g., "2/6 turns").
3. WHEN `currentTurn` equals `maxMembers`, THE Mobile_App SHALL render the Progress_Bar at 100% fill.
4. IF `currentTurn` is 0 or undefined, THEN THE Mobile_App SHALL render the Progress_Bar at 0% fill without error.

---

### Requirement 4: Invitation Code Copy/Share on Mobile Group Cards

**User Story:** As a mobile user, I want to copy or share a group's invitation code directly from the group list, so that I can quickly invite others without navigating into the group detail.

#### Acceptance Criteria

1. THE Mobile_App SHALL display an Invitation_Card on each group card in the Groups_List, showing the group's `invitationCode`.
2. THE Invitation_Card SHALL include a Copy button that writes the `invitationCode` to the device clipboard and shows a confirmation message.
3. THE Invitation_Card SHALL include a Share button that opens the native share sheet with a pre-composed message containing the group name and `invitationCode`.
4. WHEN the user taps the Copy or Share button, THE Mobile_App SHALL NOT navigate away from the Groups_List.

---

### Requirement 5: Credibility Score Badge on Mobile Group Cards

**User Story:** As a mobile user, I want to see a group's credibility score on the group card, so that I can assess group reliability at a glance.

#### Acceptance Criteria

1. THE Mobile_App SHALL display a Credibility_Badge on each group card in the Groups_List showing the group's `credibilityScore` as a percentage.
2. WHEN `credibilityScore` is undefined or null, THE Mobile_App SHALL NOT render the Credibility_Badge.

---

### Requirement 6: Group Detail History Tab — Real Data on Both Platforms

**User Story:** As a user, I want to view the transaction history for a specific group inside the group detail screen, so that I can track all contributions and payouts for that group.

#### Acceptance Criteria

1. WHEN the user selects the "History" tab in Group_Detail, THE Web_App SHALL fetch and display group-scoped transactions from the Backend using the group's `_id`.
2. WHEN the user selects the "History" tab in Group_Detail, THE Mobile_App SHALL fetch and display group-scoped transactions from the Backend using the group's `_id`.
3. THE History_Tab SHALL display each transaction's type, amount, description, date, and status.
4. WHEN no transactions exist for the group, THE History_Tab SHALL display an empty state message.
5. IF the Backend returns an error when fetching group history, THEN THE History_Tab SHALL display an error message with a retry action.
6. THE Backend SHALL support filtering transactions by `groupId` on the `GET /api/transactions` endpoint.

---

### Requirement 7: Withdraw Button on Web Wallet Page — Wired to Backend

**User Story:** As a web user, I want to initiate a withdrawal from my wallet to my linked bank account, so that I can access my funds.

#### Acceptance Criteria

1. WHEN the user clicks the Withdraw_Button on the Wallet_Page, THE Web_App SHALL display a withdrawal modal prompting the user to select a linked bank account and enter an amount.
2. WHEN the user confirms the withdrawal, THE Web_App SHALL call the Backend withdrawal endpoint with the selected bank account and amount.
3. IF the requested withdrawal amount exceeds the user's `availableBalance`, THEN THE Web_App SHALL display an error message and SHALL NOT submit the request.
4. WHEN the withdrawal is successfully processed, THE Web_App SHALL refresh the wallet balance and transaction list.
5. THE Backend SHALL expose a `POST /api/wallets/withdraw` endpoint that validates the amount against `availableBalance`, deducts the amount, creates a withdrawal transaction record, and returns the updated wallet.
6. IF the Backend returns an error, THEN THE Web_App SHALL display the error message to the user.

---

### Requirement 8: Export Transactions Button on Web Wallet Page — Wired to Backend

**User Story:** As a web user, I want to export my transaction history, so that I can keep personal financial records.

#### Acceptance Criteria

1. WHEN the user clicks the Export_Button on the Wallet_Page, THE Web_App SHALL request a transaction export from the Backend.
2. THE Backend SHALL expose a `GET /api/transactions/export` endpoint that returns the authenticated user's transactions as a CSV file.
3. WHEN the export is ready, THE Web_App SHALL trigger a file download in the browser with a filename containing the user's name and the export date.
4. IF the Backend returns an error during export, THEN THE Web_App SHALL display an error message to the user.

---

### Requirement 9: Auto-Withdrawal Setup — Wired to Backend on Web

**User Story:** As a web user, I want to save my auto-withdrawal preferences so that payouts are automatically sent to my bank account.

#### Acceptance Criteria

1. WHEN the user opens the Auto_Withdrawal_Modal and clicks "Save Settings", THE Web_App SHALL submit the configuration (bank account, percentage, minimum amount, enabled flag) to the Backend.
2. THE Backend SHALL expose a `POST /api/wallets/auto-withdrawal` endpoint that persists the auto-withdrawal settings on the user's wallet document.
3. WHEN the Auto_Withdrawal_Modal opens, THE Web_App SHALL fetch the user's real bank accounts from the Backend and populate the bank account selector.
4. WHEN the Auto_Withdrawal_Modal opens, THE Web_App SHALL pre-populate the form with the user's existing auto-withdrawal settings if any exist.
5. IF the Backend returns an error when saving, THEN THE Web_App SHALL display the error message inside the modal.

---

### Requirement 10: Fund Wallet via Paystack on Web

**User Story:** As a web user, I want to fund my wallet using Paystack, so that I have balance available for contributions.

#### Acceptance Criteria

1. THE Web_App SHALL display a "Fund Wallet" button on the Wallet_Page.
2. WHEN the user clicks "Fund Wallet", THE Web_App SHALL display a modal prompting the user to enter an amount, with a minimum of ₦100.
3. WHEN the user confirms the amount, THE Web_App SHALL initialize a Paystack payment using the Backend's `POST /api/wallets/fund/initialize` endpoint and redirect or open the Paystack checkout.
4. WHEN Paystack reports a successful payment, THE Web_App SHALL call the Backend's `POST /api/wallets/fund/verify` endpoint with the payment reference.
5. WHEN verification succeeds, THE Web_App SHALL refresh the wallet balance and transaction list and display a success message.
6. IF the user cancels the Paystack flow, THEN THE Web_App SHALL dismiss the modal without modifying the wallet balance.
7. IF verification fails, THEN THE Web_App SHALL display an error message with the payment reference for support follow-up.

---

### Requirement 11: Transaction Type Filters on Web Wallet Page

**User Story:** As a web user, I want to filter my transaction history by type, so that I can quickly find specific transactions.

#### Acceptance Criteria

1. THE Web_App SHALL display Transaction_Filters (All, Contribution, Payout, Withdrawal) on the Wallet_Page above the transaction list.
2. WHEN the user selects a filter, THE Web_App SHALL display only transactions matching the selected type.
3. WHEN the "All" filter is selected, THE Web_App SHALL display all transactions regardless of type.
4. THE Web_App SHALL highlight the currently active filter visually.
5. WHEN the transaction list is empty after filtering, THE Web_App SHALL display an empty state message.

---

### Requirement 12: Bank Account Management Section on Web Wallet Page

**User Story:** As a web user, I want to view and manage my linked bank accounts on the wallet page, so that I can control where my withdrawals are sent.

#### Acceptance Criteria

1. THE Web_App SHALL display a Bank_Account_Section on the Wallet_Page showing all linked bank accounts fetched from the Backend.
2. EACH bank account card SHALL display the bank name, masked account number, account holder name, and a "Primary" badge if `isPrimary` is true.
3. THE Web_App SHALL provide an "Add Bank Account" action that navigates to or opens the bank account addition flow.
4. WHEN the user selects "Set as Primary" on a non-primary account, THE Web_App SHALL call the Backend's `PATCH /api/wallets/bank-accounts/:accountId/set-primary` endpoint and refresh the list.
5. IF the Backend returns an error when loading bank accounts, THEN THE Web_App SHALL display an error message with a retry action.

---

### Requirement 13: Real API Data on Web Wallet Page

**User Story:** As a web user, I want the wallet page to show my real balance and transactions from the server, so that I see accurate financial information.

#### Acceptance Criteria

1. WHEN the Wallet_Page loads, THE Web_App SHALL fetch wallet data from `GET /api/wallets/me` and display the real `availableBalance`, `lockedBalance`, `totalContributions`, and `totalPayouts`.
2. WHEN the Wallet_Page loads, THE Web_App SHALL fetch transactions from `GET /api/transactions` and display them in the transaction list.
3. THE Web_App SHALL replace all hardcoded mock wallet data with live API data.
4. WHEN the API call fails, THE Web_App SHALL display an error state with a retry button.
5. WHILE data is loading, THE Web_App SHALL display a loading indicator in place of the balance and transaction list.

---

### Requirement 14: Wallet/Card Payment Method Toggle on Web Pay Screen

**User Story:** As a web user, I want to choose between paying from my wallet balance or using a card via Paystack, so that I have flexibility in how I make contributions.

#### Acceptance Criteria

1. THE Web_App SHALL display a Payment_Method_Toggle on the Pay_Screen with "Wallet" and "Card (Paystack)" options.
2. WHEN the user selects "Wallet", THE Web_App SHALL deduct the contribution amount from the user's wallet balance via the Backend's `POST /api/transactions/contribution/wallet` endpoint.
3. WHEN the user selects "Card (Paystack)", THE Web_App SHALL initiate a Paystack checkout for the contribution amount.
4. WHEN the "Wallet" method is selected and the user's `availableBalance` is less than the contribution amount, THE Web_App SHALL display an insufficient balance warning and disable the pay button.
5. THE Web_App SHALL display the user's current wallet balance on the Pay_Screen for reference.

---

### Requirement 15: Turn-Based Contribution Enforcement

**User Story:** As a group admin, I want the system to prevent members from paying into a group when it is not their turn, so that the ajo rotation order is respected.

#### Acceptance Criteria

1. WHEN a user attempts to submit a contribution for a group, THE Backend SHALL verify that it is the user's turn in the group's rotation before processing the payment.
2. IF it is not the user's turn, THEN THE Backend SHALL return a 403 error with a descriptive message indicating whose turn it currently is.
3. WHEN the Pay_Screen loads on the Mobile_App, THE Mobile_App SHALL display a visual indicator on each group card showing whether it is currently the user's turn.
4. WHEN the Pay_Screen loads on the Web_App, THE Web_App SHALL display a visual indicator on each group card showing whether it is currently the user's turn.
5. WHEN it is not the user's turn for a selected group, THE Pay_Screen SHALL disable the pay button and display a message explaining the restriction.
6. THE Backend turn validation SHALL apply to both the card payment endpoint (`POST /api/transactions/contribution`) and the wallet payment endpoint (`POST /api/transactions/contribution/wallet`).

---

### Requirement 16: Wallet Lock Feature

**User Story:** As a user, I want to lock a portion of my wallet balance until a set date or until I manually unlock it, so that I can protect savings from being spent impulsively.

#### Acceptance Criteria

1. THE Web_App SHALL display a "Lock Funds" button on the Wallet_Page.
2. THE Mobile_App SHALL display a "Lock Funds" button on the Wallet_Page.
3. WHEN the user taps "Lock Funds", THE App SHALL display a lock creation form requesting: amount to lock, optional label, and release condition (specific date or manual unlock).
4. WHEN the user submits the lock form, THE Backend SHALL create a Lock record, deduct the locked amount from `availableBalance`, and add it to `lockedBalance`.
5. IF the requested lock amount exceeds the user's `availableBalance`, THEN THE Backend SHALL return a 400 error and THE App SHALL display an error message.
6. THE Wallet_Page on both platforms SHALL display a list of active locks showing each lock's label, locked amount, and release condition.
7. WHEN a lock's release date has passed, THE Backend SHALL automatically release the lock, restore the amount to `availableBalance`, and create an unlock transaction record.
8. WHEN the user manually unlocks a lock (where the release condition is "manual"), THE Backend SHALL release the lock, restore the amount to `availableBalance`, and create an unlock transaction record.
9. IF the user attempts to manually unlock a date-locked lock before its release date, THEN THE Backend SHALL return a 403 error and THE App SHALL display a message showing the earliest release date.
10. THE Backend SHALL expose the following endpoints for the Lock_Feature:
    - `POST /api/wallets/locks` — create a new lock
    - `GET /api/wallets/locks` — list the authenticated user's active locks
    - `POST /api/wallets/locks/:lockId/unlock` — manually unlock a lock
11. FOR ALL lock and unlock operations, THE Backend SHALL update `availableBalance` and `lockedBalance` atomically to prevent race conditions.
12. THE Transaction record for a lock creation SHALL have type `lock` and for a lock release SHALL have type `unlock`.
