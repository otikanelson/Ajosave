**AJOSAVE REQUIREMENTS DOCUMENT**

**1. WHAT AJOSAVE DOES**

AjoSave is a digital platform that helps Nigerians save money together in groups, just like traditional Ajo, but with complete transparency and security. Users can create or join savings groups, contribute money regularly, and receive payouts when it\'s their turn---all tracked automatically with no room for fraud or missing funds.

**The Basic Flow:**

1.  User creates an account and verifies their identity

2.  User creates a new savings group OR joins an existing one using an invite code

3.  Members contribute money on a schedule (weekly, monthly, etc.)

4.  Each member takes turns receiving the collected money

5.  Everything is tracked and transparent---everyone can see all contributions and payouts

**2. WHAT USERS CAN DO (FUNCTIONAL REQUIREMENTS)**

**2.1 Account Management**

**Sign Up & Login:**

- Users register with their phone number

- System sends OTP (one-time password) via SMS to verify phone number

- Users create a password

- Users can log in with phone number and password

- Password reset available via SMS if forgotten

**Identity Verification (KYC):**

- Users must verify their identity to use the platform

- Required information: Full name, date of birth, BVN (Bank Verification Number)

- System verifies BVN with authorized Nigerian verification services

- This helps prevent fraud and meets banking regulations

- Users without verified identity have limited transaction amounts

**Profile Management:**

- Users can update their profile: name, email, profile photo

- Users can add and manage bank account details for withdrawals

- Users can view their transaction history

- Users can delete their account if they want to leave the platform

**2.2 Wallet System**

**Understanding the Wallet:** Think of the wallet as two separate pockets:

- **Available Balance:** Money you can withdraw to your bank account anytime

- **Locked Balance:** Money you\'ve committed to active savings groups that you can\'t withdraw until you receive your payout

**Adding Money to Wallet:**

- Users can deposit money using:

  - Debit card (Visa, Mastercard, Verve)

  - Bank transfer

  - USSD code (future feature)

- All payments processed through Paystack (a licensed Nigerian payment company)

- Money appears in wallet within seconds for card payments

- Bank transfers may take a few minutes to confirm

**Viewing Wallet:**

- Users see their current available and locked balances

- Users see a complete history of all transactions (deposits, contributions, payouts, withdrawals)

- Each transaction shows: date, amount, type, and status

**Withdrawing Money:**

- Users can withdraw their available balance to their bank account

- Users select which bank account to send money to

- Small fee charged (₦100 per withdrawal)

- Money arrives in bank account within 1-2 hours during banking hours

**2.3 Group Savings**

**Creating a Group:**

- User gives the group a name (e.g., \"Market Ajo\", \"Office Friends\")

- User sets contribution amount (e.g., ₦10,000 per person)

- User sets how often contributions happen (daily, weekly, monthly)

- User sets start date for the first contribution

- User decides if group is private (invitation only) or open

- System generates a unique invite code for the group

- User who creates the group becomes the group admin

**Joining a Group:**

- User enters an invite code shared by a friend or group admin

- User sees group details: name, contribution amount, frequency, current members

- User confirms they want to join

- User is added to the group and assigned a turn order for payouts

- User\'s wallet must have enough money to cover contributions when they\'re due

**Group Details & Tracking:**

- Users see all members in their groups

- Users see the contribution schedule (who pays when)

- Users see the payout rotation (whose turn is next)

- Users see all past contributions and payouts

- Users receive reminders before contributions are due

- Everything is transparent---all members see the same information

**Making Contributions:**

- When it\'s time to contribute, system automatically reminds users

- Users click \"Make Contribution\" button

- Money moves from their wallet\'s available balance to locked balance

- All group members are notified of the contribution

- If a user misses a contribution deadline, they can still pay but may be marked as late

**Receiving Payouts:**

- When it\'s a user\'s turn, they receive all contributions from that cycle

- Money moves from locked balance to available balance

- User can then withdraw to their bank account or keep for next cycle

- All group members see the payout happened

- Turn automatically moves to next person

**Group Admin Powers:**

- Can send reminders to members

- Can view detailed group reports

- Can remove members who consistently don\'t contribute (future feature)

- Cannot access or control members\' money

**2.4 Notifications**

Users receive notifications for important events:

**Via SMS (Text Message):**

- OTP codes for login

- Payment confirmations

- Payout notifications

- Security alerts (if someone tries to log in from new device)

**Via Email:**

- Welcome message when they sign up

- Monthly account summary

- Important updates about the platform

**Via Push Notifications (Mobile App Only):**

- Contribution reminders (1 day before due)

- When someone in their group makes a contribution

- When they receive a payout

- When their wallet balance is low

- General announcements

**Via In-App Notifications:**

- All the above, accessible inside the app anytime

- Notification history kept for 30 days

**3. WEB APP VS MOBILE APP - WHAT\'S DIFFERENT?**

**3.1 Mobile App Features (iOS & Android)**

**Everything the web has, PLUS:**

**Push Notifications:**

- Real-time alerts even when app is closed

- Quick actions from notifications (e.g., \"Make Payment\" button in notification)

**Biometric Login:**

- Use fingerprint or Face ID instead of password

- Faster and more secure login

**Camera Access:**

- Take photos of ID cards for verification

- Upload profile pictures directly from camera

**Better for Daily Use:**

- Designed for small screens and touch

- Faster loading than opening a browser

- Works better with poor internet connection

- Can cache data to view some things offline

**Share & Invite:**

- Easily share group invite codes via WhatsApp, SMS, social media

- Native sharing menu

**3.2 Web App Features (Desktop & Mobile Browser)**

**Core Savings Features:**

- Create and join groups

- Make contributions

- View wallet and transaction history

- Withdraw money

- Manage profile

**Better For:**

- First-time registration (easier to type on bigger screen)

- Viewing detailed reports and transaction history

- Managing multiple groups

- Administrative tasks

- Users who prefer not to install apps

**Limitations:**

- No push notifications (only email and SMS)

- No biometric login

- Requires internet connection for everything

- Slightly slower than mobile app

**Both platforms share the same account---log in on web or mobile with same credentials and see all your data.**

**4. HOW YOUR MONEY AND INFORMATION ARE HANDLED**

**4.1 Your Money**

**We Don\'t Hold Your Money:**

- AjoSave is a technology platform, not a bank

- We don\'t have a bank license and don\'t hold your funds

- All payments go through Paystack, a licensed payment company regulated by the Central Bank of Nigeria

- Paystack holds funds temporarily and transfers them according to your instructions

**How Payments Work:**

**When you deposit:**

1.  You click \"Add Money\" in your wallet

2.  You\'re redirected to Paystack\'s secure payment page

3.  You enter your card details or select bank transfer (you\'re on Paystack\'s website, not ours)

4.  Paystack processes the payment with your bank

5.  Paystack confirms payment successful

6.  We update your wallet balance

7.  You receive confirmation SMS and notification

**When you contribute to a group:**

1.  Money moves from your \"available\" to \"locked\" balance

2.  This happens inside our system (no actual bank transaction)

3.  We keep a record that this money is now committed to your group

**When you receive a payout:**

1.  Money moves from \"locked\" to \"available\" balance in your wallet

2.  You can now withdraw it to your bank account

**When you withdraw:**

1.  You request withdrawal to your bank account

2.  We instruct Paystack to transfer money from their account to your bank

3.  Paystack processes the transfer

4.  Money arrives in your bank account

5.  We update your wallet to reflect the withdrawal

**Your funds are NOT covered by NDIC insurance** (Nigeria Deposit Insurance Corporation) because we\'re not a bank. But Paystack is a licensed and regulated payment company.

**4.2 Your Personal Information**

**What We Collect:**

**During Registration:**

- Phone number (for login and SMS notifications)

- Full name

- Password (encrypted, we never see your actual password)

- Email address (optional)

**During Verification:**

- Date of birth

- BVN (Bank Verification Number)

- NIN (National Identification Number) - future feature

- Photo of ID card (stored securely)

**During Usage:**

- Bank account details (for withdrawals)

- Transaction history (what you paid, when, to which group)

- Device information (phone model, operating system---for security)

- Location (only approximate city/state---for fraud prevention)

**Profile Information:**

- Profile photo (if you upload one)

- Any optional information you add

**What We DO with Your Information:**

**To Provide the Service:**

- Verify your identity (prevent fraud)

- Process payments

- Send you notifications

- Show your transaction history

- Connect you with your savings groups

**For Security:**

- Detect suspicious activity (e.g., someone trying to log in from another country)

- Prevent fraud and money laundering

- Protect your account from unauthorized access

**For Improvement:**

- Understand how people use the app (which features are popular)

- Fix bugs and improve performance

- Plan new features

**We Will NEVER:**

- Sell your information to anyone

- Share your information with marketers

- Post your information on social media

- Use your money for anything other than what you instructed

**What We DO NOT Store:**

**Your actual BVN/NIN:**

- We only verify these with authorized services

- We store only whether verification succeeded or failed

- We don\'t keep your actual 11-digit BVN or NIN in our database

**Your card details:**

- Card information is entered on Paystack\'s website, not ours

- We never see or store your card number, CVV, or expiry date

- We only receive confirmation that payment succeeded

**Who We Share Your Information With:**

**Paystack (Payment Processing):**

- We send your name and phone number when initiating payments

- They need this to process your transactions

- They send us confirmation when payment succeeds or fails

**Verification Services (Identity Checks):**

- We send your BVN and name to verify identity

- These are licensed companies approved by CBN and NIMC

- They respond with \"verified\" or \"not verified\"---we don\'t get your full BVN details

**SMS/Email Service (Termii or Africa\'s Talking):**

- We send your phone number and the message to be delivered

- They deliver OTP codes and notifications

- They don\'t store your personal information

**Government/Law Enforcement (When Required by Law):**

- If we receive a valid court order or official request

- For investigating fraud or criminal activity

- We keep records of what information was shared and why

**We have agreements with all these services requiring them to protect your data and use it only for the specified purpose.**

**4.3 Your Rights Over Your Information**

**Access:**

- You can request a copy of all information we have about you

- We\'ll send it within 7 days

- It\'s provided free of charge

**Correction:**

- If your information is wrong, you can update it in your profile

- For verification information (BVN status), contact support

**Deletion:**

- You can delete your account anytime from settings

- Your personal information is deleted within 90 days

- Transaction records are kept for 7 years (required by law for financial services)

- Anonymous transaction data may be kept for statistics

**Objection:**

- You can opt out of promotional notifications

- You cannot opt out of security alerts or transaction confirmations (needed for service)

**Data Portability:**

- You can export your transaction history as PDF or CSV

- Useful if you want to keep personal records

**4.4 How We Protect Your Information**

**Encryption:**

- All data traveling between your device and our servers is encrypted (like a secret code only we can read)

- Sensitive information in our database is also encrypted

- Your password is scrambled in a way that even we can\'t read it

**Access Control:**

- Only authorized team members can access the database

- No single person has complete access to everything

- All access is logged and monitored

**Security Monitoring:**

- We use automated systems to detect suspicious activity

- Failed login attempts are tracked

- Unusual transaction patterns trigger alerts

**Regular Updates:**

- We regularly update our systems to fix security vulnerabilities

- We follow industry best practices

**What You Should Do:**

- Use a strong password (at least 8 characters, mix of letters, numbers, symbols)

- Don\'t share your password with anyone

- Log out when using shared devices

- Enable biometric login if available (fingerprint, Face ID)

- Report suspicious activity immediately

**5. BANKING & LEGAL PROCEDURES**

**5.1 Regulatory Compliance**

**Central Bank of Nigeria (CBN):**

- We comply with CBN guidelines for digital financial services

- We are NOT a bank or payment service provider (Paystack handles that)

- We are a technology platform facilitating savings group management

- When we launch loans in the future, we\'ll register as required by CBN

**Know Your Customer (KYC):**

- Nigerian law requires us to verify user identities

- This prevents fraud, money laundering, and terrorist financing

- We verify using BVN, which is linked to your bank account and confirmed by your bank

- Users who don\'t complete verification can only transact small amounts

**Anti-Money Laundering (AML):**

- We monitor transactions for suspicious patterns

- New accounts have transaction limits for the first 30 days

- Large or unusual transactions may require additional verification

- We\'re required to report suspicious activity to authorities

**5.2 Transaction Limits**

**New Users (First 30 Days):**

- Maximum ₦100,000 per single deposit

- Maximum ₦200,000 per day in total deposits

- No limit on withdrawals (you can withdraw what you have)

**Verified Users (After 30 Days & KYC Complete):**

- Maximum ₦500,000 per single deposit

- Maximum ₦1,000,000 per day in total deposits

- Limits can be increased with additional verification if needed

**Why These Limits:**

- Protect new users from making mistakes

- Prevent fraud on stolen accounts

- Comply with anti-money laundering regulations

- Can be adjusted as you build history and trust

**5.3 Fees & Charges**

**What\'s Free:**

- Creating an account

- Verifying your identity

- Creating or joining groups

- Viewing your wallet and transaction history

- Receiving money (payouts from groups)

- Depositing money to your wallet

**What Has Fees:**

- **Withdrawal to Bank Account:** ₦100 per withdrawal

- **Payment Processing (Paystack):** 1.5% + ₦100 per deposit (already included in the amount you see)

  - Example: If you deposit ₦10,000, about ₦250 goes to payment processing fees

**No Hidden Charges:**

- All fees are shown before you confirm any transaction

- We don\'t charge monthly subscription fees

- We don\'t charge for using the app or web

**5.4 Dispute Resolution**

**If Something Goes Wrong:**

**Payment Issues:**

1.  Contact support immediately via email or in-app chat

2.  Provide transaction reference number

3.  We investigate within 24 hours

4.  We verify with Paystack

5.  If payment was made but not reflected, we credit your account manually

6.  You receive update within 48 hours

**Group Disputes:**

- If a member isn\'t contributing: Group admin can send reminders

- If payout didn\'t arrive: Check transaction history, contact support if issue

- If wrong amount: We investigate and correct based on records

- If you want to leave a group: Your locked balance is released after your payout turn

**Account Issues:**

- Locked out of account: Use password reset or contact support

- Suspicious activity: We may temporarily lock your account for security, contact support to resolve

- Verification problems: Contact support with your documents

**Escalation:**

- If not resolved within 7 days, request escalation

- Senior support reviews case

- If still not resolved, you can file complaint with Consumer Protection Council (CPC)

**5.5 What Happens to Your Money if AjoSave Closes**

**Your Active Balance:**

- Money in your wallet is held by Paystack, not us

- You can withdraw all available balance to your bank account anytime

- Even if AjoSave closes, your money with Paystack is safe

**Locked Balance (Money in Active Groups):**

- If we close, we\'ll complete all active group cycles first

- Everyone will receive their payouts

- Any remaining locked balance will be moved to available balance

- Users will be notified 90 days in advance to withdraw funds

**Your Data:**

- Transaction records kept for 7 years (legal requirement)

- Personal information deleted as per your request

- You can export all your data before we close

**We\'re required by law to:**

- Notify users 90 days before shutting down

- Complete all pending transactions

- Return all funds to users

- Keep records for regulatory purposes

**6. TERMS OF USE (SIMPLE VERSION)**

**By using AjoSave, you agree to:**

**Your Responsibilities:**

- Provide accurate information (real name, correct phone number, valid BVN)

- Keep your password secure and don\'t share it

- Only use your own money (not stolen or illegal funds)

- Not use the platform for fraud, money laundering, or illegal activities

- Honor your commitments to savings groups you join

- Report any problems or suspicious activity

**Our Responsibilities:**

- Keep the platform working (aim for 99.5% uptime)

- Protect your information with industry-standard security

- Process transactions accurately and promptly

- Respond to support requests within 24 hours

- Notify you of any major changes to terms or features

- Be transparent about fees

**What We\'re NOT Responsible For:**

- Other group members not contributing (that\'s between group members)

- Your bank\'s delays in processing transfers

- Your phone or internet connection problems

- Loss from sharing your password with someone

- Paystack\'s service interruptions (outside our control)

**We Can Suspend or Close Your Account If:**

- You provide false information

- You use the platform for illegal activities

- You violate our terms repeatedly

- We\'re required to by law or regulators

**If we suspend you:**

- You can withdraw your available balance

- We\'ll explain why (unless prevented by law)

- You can appeal if you think it\'s a mistake

**6.1 Privacy & Data Protection (Nigeria Data Protection Regulation - NDPR)**

**We comply with NDPR which gives you rights:**

1.  **Right to Know:** What information we collect and why (explained in Section 4.2)

2.  **Right to Access:** Request a copy of your information (free, within 7 days)

3.  **Right to Correction:** Update wrong information in your profile

4.  **Right to Delete:** Delete your account and personal information (transaction records kept 7 years for legal compliance)

5.  **Right to Object:** Opt out of promotional messages (can\'t opt out of security or transaction notifications)

6.  **Right to Data Portability:** Export your data to take elsewhere

**To exercise these rights:**

- Most can be done in the app (update profile, export data, delete account)

- For others, email (***insert our official ajosave support email later***)

- We respond within 7 days

**7. FREQUENTLY ASKED QUESTIONS**

**Is my money safe?** Yes. Your money is processed and held by Paystack, a licensed payment company regulated by CBN. We don\'t touch your funds directly---we just tell Paystack where to send it based on your instructions.

**What if someone in my group doesn\'t pay?** This is managed within the group. Group admin can send reminders. If someone consistently doesn\'t pay, future versions will allow removal from group. Their turn can be skipped and rescheduled.

**Can I withdraw money I\'ve contributed to a group?** Not until you receive your payout. Once you contribute, that money is \"locked\" for the group cycle. This is how traditional Ajo works---everyone commits.

**What happens if I miss my contribution deadline?** You can still pay late, but you may be marked as late in the group. Other members will see this. Consistent late payments may affect your standing in the group.

**Can the group admin steal the money?** No. The admin has no access to money. All transactions are handled by the system automatically. The admin can only manage group settings and send reminders.

**What if I lose my phone?** Log in from another device with your phone number and password. Your account and money are safe. Enable biometric login on your new phone for extra security.

**How long does withdrawal take?** Usually 1-2 hours during banking hours (Monday-Friday, 9 AM - 5 PM). Withdrawals requested on weekends or holidays process the next business day.

**Why do you need my BVN?** It\'s required by Nigerian law for financial services to verify your identity and prevent fraud. We only verify it---we don\'t store the actual number.

**Can I be in multiple groups?** Yes! You can join as many groups as you want, as long as you can afford the contributions. Each group is independent.

**What happens if AjoSave shuts down?** We\'ll notify everyone 90 days in advance, complete all active group cycles, and allow you to withdraw all your money. Your funds with Paystack are safe regardless.

**CONCLUSION**

AjoSave makes traditional group savings work better by:

- Removing the risk of fraud

- Making everything transparent

- Automating the boring parts (tracking, reminders, payouts)

- Giving everyone a record of their savings

Your money is processed by licensed, regulated companies. Your information is protected and you control it. Everything is designed to be simple, safe, and transparent.

If you have questions not answered here, contact our support team at (***Insert our official ajosave support website here***).
