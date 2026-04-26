# Admin Backend APIs - Implementation Tasks

## Overview

This document outlines all implementation tasks for the admin backend APIs. Tasks are organized by feature area and should be implemented in order, as later tasks depend on earlier ones.

## Task List

- [x] 1. Create Admin model and AuditLog model
  - [x] 1.1 Create `backend/src/models/Admin.js` with fields: email, password, name, role (super_admin, admin, moderator), isActive, lastLoginAt, preferences (language, timezone, notifications), createdAt, updatedAt. Include password hashing pre-save hook and matchPassword method. Exclude password from default queries.
  - [x] 1.2 Create `backend/src/models/AuditLog.js` with fields: adminId (ref Admin), action (enum: user_suspended, user_activated, user_deactivated, kyc_approved, kyc_rejected, transaction_reversed, transaction_failed, group_modified, setting_changed, admin_login, admin_logout, bulk_operation), entityType (user, group, transaction, setting, admin), entityId, details (Mixed), oldValue (Mixed), newValue (Mixed), ipAddress, userAgent, timestamp. Add compound indexes on adminId+timestamp and action+timestamp.
  - [x] 1.3 Create `backend/src/models/Alert.js` with fields: title, description, severity (critical, warning, info), isDismissed, dismissedBy (ref Admin), dismissedAt, createdAt. Add index on isDismissed+severity.
  - [x] 1.4 Create `backend/src/models/Settings.js` with fields: key (unique), value (Mixed), description, category (transactions, groups, users, system), updatedBy (ref Admin), updatedAt. Seed default settings on first load.
  - [x] 1.5 Create `backend/src/models/SupportTicket.js` with fields: ticketId (unique, auto-generated), userId (ref User), subject, description, status (open, in_progress, resolved, closed), priority (low, medium, high, urgent), responses (array of { adminId, message, timestamp }), createdAt, updatedAt. Add indexes on status and priority.

- [x] 2. Create admin authentication middleware and utilities
  - [x] 2.1 Create `backend/src/middlewares/adminAuth.js` with: `adminProtect` middleware (verifies JWT with admin role claim, loads Admin document, attaches to req.admin), `adminAuthorize(...roles)` middleware (checks admin role against allowed roles), `requireAdminRole` convenience export for `adminProtect + adminAuthorize('admin', 'super_admin', 'moderator')`. Reuse `extractToken` and `verifyToken` from existing authMiddleware but load from Admin model instead of User model.
  - [x] 2.2 Create `backend/src/utils/adminHelpers.js` with: `createAuditLog(adminId, action, entityType, entityId, details, req)` async helper that creates an AuditLog document, `buildPaginationMeta(total, page, pageSize)` that returns `{ total, page, pageSize, totalPages }`, `buildSortOptions(sortField, sortOrder, allowedFields)` that validates sort field against allowedFields and returns a Mongoose sort object, `buildFilterQuery(filters)` that constructs a Mongoose query object from filter params, `formatListResponse(items, paginationMeta)` that returns `{ items, ...paginationMeta }`.
  - [x] 2.3 Create `backend/src/utils/responseHelpers.js` with: `sendSuccess(res, data, message, statusCode)` that sends `{ success: true, message, data, timestamp }`, `sendError(res, message, statusCode, errors)` that sends `{ success: false, message, errors, timestamp }`, `sendListResponse(res, items, paginationMeta, message)` that sends `{ success: true, message, data: { items, ...paginationMeta }, timestamp }`.

- [x] 3. Implement admin authentication controller and routes
  - [x] 3.1 Create `backend/src/controllers/adminAuthController.js` with handlers: `adminLogin` (validate email+password, verify against Admin model, issue JWT with `{ id, role: admin.role, type: 'admin' }` claims, set httpOnly cookie, create audit log), `adminLogout` (clear cookie, create audit log), `adminRefreshToken` (issue new token), `getAdminProfile` (return admin profile excluding password), `updateAdminProfile` (update name, preferences, create audit log), `updateAdminPassword` (validate current password, hash new password, save, create audit log).
  - [x] 3.2 Create `backend/src/routes/adminAuthRoutes.js` with: `POST /login`, `POST /logout` (protected), `POST /refresh` (protected), `GET /profile` (protected), `PUT /profile` (protected), `PUT /password` (protected). Apply `adminProtect` to protected routes.
  - [x] 3.3 Register admin auth routes in `backend/server.js` under `/api/admin/auth`.

- [x] 4. Implement dashboard statistics and recent activities APIs
  - [x] 4.1 Create `backend/src/controllers/adminDashboardController.js` with `getDashboardStats` handler: query User, Group, Transaction models in parallel using `Promise.all`, support optional `period` query param (today, week, month, year) to filter by date range, return `{ totalUsers, activeGroups, totalSavings, transactionsCount24h, timestamp }`. Use `Promise.all` for parallel queries to meet the 2-second performance target.
  - [x] 4.2 Add `getRecentActivities` handler to dashboard controller: query AuditLog model sorted by timestamp descending, support `limit` (default 20, max 100) and `offset` pagination params, return activities with `{ type, description, timestamp, entityId, entityType, adminName }`.
  - [x] 4.3 Add `getAlerts` handler: query Alert model where `isDismissed: false`, sort by severity order (critical→warning→info) then timestamp descending, support optional `severity` filter param, return alerts array.
  - [x] 4.4 Add `dismissAlert` handler: find alert by ID, set `isDismissed: true`, `dismissedBy: req.admin._id`, `dismissedAt: new Date()`, save and return updated alert.
  - [x] 4.5 Create `backend/src/routes/adminDashboardRoutes.js` with: `GET /stats`, `GET /activities`, `GET /alerts`, `POST /alerts/:id/dismiss`. All routes protected with `adminProtect`.
  - [x] 4.6 Register dashboard routes in `backend/server.js` under `/api/admin/dashboard`.

- [x] 5. Implement user management APIs
  - [x] 5.1 Create `backend/src/controllers/adminUserController.js` with `getUsers` handler: support query params `search` (regex on firstName, lastName, phoneNumber, email), `kycStatus` (filter by isVerified/isFaceVerified), `accountStatus` (filter by isActive/isSuspended/isDeactivated), `sortBy` (name, joinDate, kycStatus — validated against allowedFields), `sortOrder` (asc/desc), `limit` (default 20, max 1000), `offset` (default 0). Return paginated list with `{ items, total, page, pageSize, totalPages }`. Exclude sensitive fields (password, bvn, nin).
  - [x] 5.2 Add `getUserById` handler: find user by ID, populate wallet summary (totalBalance, totalContributions), populate group memberships (group name, status, joinDate), return comprehensive user object excluding password/bvn/nin. Return 404 if not found.
  - [x] 5.3 Add `suspendUser` handler: validate user exists and is not already suspended, set `isSuspended: true`, `suspendedAt: new Date()`, `suspensionReason` from request body, save user, create audit log with action `user_suspended`. Return 400 if already suspended.
  - [x] 5.4 Add `activateUser` handler: validate user exists, set `isSuspended: false`, `isDeactivated: false`, `isActive: true`, clear `suspensionReason`, save user, create audit log with action `user_activated`.
  - [x] 5.5 Add `deactivateUser` handler: validate user exists, set `isDeactivated: true`, `isActive: false`, save user, create audit log with action `user_deactivated`.
  - [x] 5.6 Add `approveKyc` handler: validate user exists and KYC is not already verified (check `isVerified`), set `isVerified: true`, `verifiedAt: new Date()`, save user, create audit log with action `kyc_approved`. Return 400 if already verified.
  - [x] 5.7 Add `rejectKyc` handler: validate user exists, set `isVerified: false`, save user with rejection reason in audit log details, create audit log with action `kyc_rejected`.
  - [x] 5.8 Add `getPendingKyc` handler: query users where `isVerified: false` and `isPhoneVerified: true`, return paginated list with same structure as `getUsers`.
  - [x] 5.9 Create `backend/src/routes/adminUserRoutes.js` with: `GET /` (getUsers), `GET /kyc/pending` (getPendingKyc), `GET /:id` (getUserById), `PUT /:id/suspend` (suspendUser), `PUT /:id/activate` (activateUser), `PUT /:id/deactivate` (deactivateUser), `PUT /:id/kyc/approve` (approveKyc), `PUT /:id/kyc/reject` (rejectKyc). All routes protected with `adminProtect`.
  - [x] 5.10 Register user routes in `backend/server.js` under `/api/admin/users`.

- [x] 6. Implement group management APIs
  - [x] 6.1 Create `backend/src/controllers/adminGroupController.js` with `getGroups` handler: support query params `search` (regex on name), `status` (filter by group status enum), `sortBy` (name, totalPool, status, nextPayout — validated), `sortOrder`, `limit`, `offset`. Populate admin field (firstName, lastName). Return paginated list with member count, totalPool, status, nextPayout.
  - [x] 6.2 Add `getGroupById` handler: find group by ID, populate `admin` (name, email, phone), populate `membersList.userId` (firstName, lastName, phoneNumber), include recent transactions (last 10) from Transaction model for this groupId. Return 404 if not found.
  - [x] 6.3 Add `updateGroupStatus` handler: validate group exists, validate new status is a valid enum value, update `status` field, save group, create audit log with action `group_modified` including old and new status. Return 404 if not found.
  - [x] 6.4 Add `updateGroupSettings` handler: validate group exists, allow updating `contributionAmount`, `frequency`, `maxMembers`, `description` fields, save group, create audit log with action `group_modified` including changed fields. Return 404 if not found.
  - [x] 6.5 Create `backend/src/routes/adminGroupRoutes.js` with: `GET /` (getGroups), `GET /:id` (getGroupById), `PUT /:id/status` (updateGroupStatus), `PUT /:id/settings` (updateGroupSettings). All routes protected with `adminProtect`.
  - [x] 6.6 Register group routes in `backend/server.js` under `/api/admin/groups`.

- [x] 7. Implement transaction monitoring APIs
  - [x] 7.1 Create `backend/src/controllers/adminTransactionController.js` with `getTransactions` handler: support query params `search` (regex on transactionId; populate userId to search by user name), `status` (filter by transaction status enum), `type` (filter by transaction type enum), `startDate` and `endDate` (filter createdAt range), `sortBy` (amount, createdAt, status — validated), `sortOrder`, `limit` (default 20, max 1000), `offset`. Populate `userId` (firstName, lastName, phoneNumber) and `groupId` (name). Return paginated list.
  - [x] 7.2 Add `getTransactionById` handler: find transaction by ID or transactionId field, populate `userId` (firstName, lastName, phoneNumber, email) and `groupId` (name, status), return full transaction details including paymentDetails. Return 404 if not found.
  - [x] 7.3 Add `reverseTransaction` handler: validate transaction exists and status is `completed`, update status to `cancelled`, find user's wallet and reverse the balance impact (add amount back for debits, deduct for credits based on transaction type), create a new Transaction record with type matching original but prefixed as reversal in description, create audit log with action `transaction_reversed`. Return 400 if already cancelled.
  - [x] 7.4 Add `markTransactionFailed` handler: validate transaction exists and status is `pending`, update status to `failed`, create audit log with action `transaction_failed`.
  - [x] 7.5 Create `backend/src/routes/adminTransactionRoutes.js` with: `GET /` (getTransactions), `GET /:id` (getTransactionById), `POST /:id/reverse` (reverseTransaction), `POST /:id/fail` (markTransactionFailed). All routes protected with `adminProtect`.
  - [x] 7.6 Register transaction routes in `backend/server.js` under `/api/admin/transactions`.

- [x] 8. Implement audit logs API
  - [x] 8.1 Create `backend/src/controllers/adminAuditController.js` with `getAuditLogs` handler: support query params `search` (populate adminId to search by admin name; search on entityId), `action` (filter by action enum), `startDate` and `endDate` (filter timestamp range), `sortBy` (timestamp, action — validated), `sortOrder`, `limit` (default 20, max 1000), `offset`. Populate `adminId` (name, email). Return paginated list.
  - [x] 8.2 Create `backend/src/routes/adminAuditRoutes.js` with: `GET /` (getAuditLogs). Route protected with `adminProtect`.
  - [x] 8.3 Register audit routes in `backend/server.js` under `/api/admin/audit-logs`.

- [x] 9. Implement analytics API
  - [x] 9.1 Create `backend/src/controllers/adminAnalyticsController.js` with `getAnalytics` handler: support `period` query param (week, month, quarter, year), compute date range from period, run aggregation pipelines in parallel using `Promise.all` for: user growth (daily/weekly new user counts using `$group` on `createdAt`), group creation trends (daily/weekly new group counts), transaction volume by type (sum of amounts grouped by type and date), savings trends (cumulative totalPool across groups). Return `{ userGrowth, groupTrends, transactionVolume, savingsTrends }` each as arrays of `{ date, value }` pairs.
  - [x] 9.2 Create `backend/src/routes/adminAnalyticsRoutes.js` with: `GET /` (getAnalytics). Route protected with `adminProtect`.
  - [x] 9.3 Register analytics routes in `backend/server.js` under `/api/admin/analytics`.

- [x] 10. Implement support tickets API
  - [x] 10.1 Create `backend/src/controllers/adminSupportController.js` with `getTickets` handler: support query params `search` (regex on ticketId; populate userId to search by user name), `status` (filter by ticket status enum), `priority` (filter by priority enum), `limit`, `offset`. Populate `userId` (firstName, lastName, phoneNumber). Return paginated list.
  - [x] 10.2 Add `getTicketById` handler: find ticket by ID or ticketId field, populate `userId` and `responses.adminId` (name). Return 404 if not found.
  - [x] 10.3 Add `updateTicketStatus` handler: validate ticket exists, update status field, create audit log. Return updated ticket.
  - [x] 10.4 Add `addTicketResponse` handler: validate ticket exists, push new response `{ adminId: req.admin._id, message, timestamp: new Date() }` to responses array, save ticket, create audit log.
  - [x] 10.5 Create `backend/src/routes/adminSupportRoutes.js` with: `GET /` (getTickets), `GET /:id` (getTicketById), `PUT /:id/status` (updateTicketStatus), `POST /:id/responses` (addTicketResponse). All routes protected with `adminProtect`.
  - [x] 10.6 Register support routes in `backend/server.js` under `/api/admin/support-tickets`.

- [x] 11. Implement settings management API
  - [x] 11.1 Create `backend/src/controllers/adminSettingsController.js` with `getSettings` handler: query all Settings documents, optionally filter by `category` query param, return array of settings objects.
  - [x] 11.2 Add `updateSetting` handler: find setting by key, validate new value against setting's expected type/range (e.g., numeric limits must be positive numbers), update `value`, `updatedBy`, `updatedAt`, save, create audit log with action `setting_changed` including `oldValue` and `newValue`. Return 400 for invalid values, 404 if key not found.
  - [x] 11.3 Create `backend/src/routes/adminSettingsRoutes.js` with: `GET /` (getSettings), `PUT /:key` (updateSetting). All routes protected with `adminProtect`.
  - [x] 11.4 Register settings routes in `backend/server.js` under `/api/admin/settings`.
  - [x] 11.5 Create a settings seed script or initialization function in `backend/src/services/settingsInit.js` that inserts default settings if none exist: `maxGroupSize` (50), `minContributionAmount` (100), `maxContributionAmount` (1000000), `maxTransactionAmount` (5000000), `maxWithdrawalAmount` (2000000), `kycRequired` (true), `maintenanceMode` (false).

- [x] 12. Implement bulk operations API
  - [x] 12.1 Create `backend/src/controllers/adminBulkController.js` with `bulkUserAction` handler: accept `{ action: 'suspend'|'activate'|'deactivate', userIds: string[], reason?: string }` in request body, validate userIds array (max 1000), process each userId sequentially or in batches of 50, track `{ successful: [], failed: [] }` results, create individual audit log entries for each successful operation, return summary `{ successful: number, failed: number, errors: [{ id, reason }] }`.
  - [x] 12.2 Create `backend/src/routes/adminBulkRoutes.js` with: `POST /users` (bulkUserAction). Route protected with `adminProtect`.
  - [x] 12.3 Register bulk routes in `backend/server.js` under `/api/admin/bulk`.

- [-] 13. Implement export and reporting API
  - [ ] 13.1 Create `backend/src/controllers/adminExportController.js` with `exportUsers` handler: query users with optional filters (same as getUsers), convert to CSV format using manual string building (no external library needed), set response headers `Content-Type: text/csv` and `Content-Disposition: attachment; filename=users-export.csv`, stream CSV data. Exclude sensitive fields (bvn, nin, password).
  - [ ] 13.2 Add `exportTransactions` handler: query transactions with optional filters (same as getTransactions), convert to CSV and stream response.
  - [ ] 13.3 Add `exportAuditLogs` handler: query audit logs with optional filters, convert to CSV and stream response.
  - [ ] 13.4 Create `backend/src/routes/adminExportRoutes.js` with: `GET /users` (exportUsers), `GET /transactions` (exportTransactions), `GET /audit-logs` (exportAuditLogs). All routes protected with `adminProtect`.
  - [ ] 13.5 Register export routes in `backend/server.js` under `/api/admin/export`.

- [ ] 14. Add admin-specific rate limiting and security middleware
  - [ ] 14.1 Create `backend/src/middlewares/adminRateLimit.js` using `express-rate-limit`: configure a limiter with `windowMs: 60 * 1000` (1 minute) and `max: 100` requests, custom `handler` that returns `{ success: false, message: 'Too many requests', retryAfter }`. Export as `adminRateLimit`.
  - [ ] 14.2 Apply `adminRateLimit` middleware to all `/api/admin/*` routes in `backend/server.js` before route registration.
  - [ ] 14.3 Add request logging middleware for admin routes in `backend/src/middlewares/adminLogger.js`: log `{ adminId, endpoint, method, params, query, timestamp, ip }` for every admin API request. Apply after `adminProtect` so `req.admin` is available.

- [ ] 15. Add input validation for admin routes
  - [ ] 15.1 Add validation rules to `backend/src/middlewares/validation.js` (or create `backend/src/middlewares/adminValidation.js`): `validateAdminLogin` (email required, valid format; password required, min 6 chars), `validateUserAction` (reason required for suspend/deactivate, min 10 chars), `validatePagination` (limit must be integer 1–1000, offset must be non-negative integer), `validateSortParams(allowedFields)` (sortBy must be in allowedFields, sortOrder must be asc or desc), `validateDateRange` (startDate and endDate must be valid ISO dates, startDate must be before endDate), `validateBulkOperation` (action must be valid enum, userIds must be non-empty array of strings, max 1000 items).
  - [ ] 15.2 Apply `validatePagination` and `validateSortParams` to all list endpoints in admin routes.
  - [ ] 15.3 Apply `validateAdminLogin` to the admin login route.
  - [ ] 15.4 Apply `validateUserAction` to suspend and deactivate user routes.
  - [ ] 15.5 Apply `validateDateRange` to transaction and audit log list routes.
  - [ ] 15.6 Apply `validateBulkOperation` to the bulk user action route.

- [ ] 16. Register all admin routes and finalize server setup
  - [ ] 16.1 Ensure all admin route files are imported and registered in `backend/server.js` under the `/api/admin` prefix in this order: adminAuthRoutes (`/api/admin/auth`), adminDashboardRoutes (`/api/admin/dashboard`), adminUserRoutes (`/api/admin/users`), adminGroupRoutes (`/api/admin/groups`), adminTransactionRoutes (`/api/admin/transactions`), adminAuditRoutes (`/api/admin/audit-logs`), adminAnalyticsRoutes (`/api/admin/analytics`), adminSupportRoutes (`/api/admin/support-tickets`), adminSettingsRoutes (`/api/admin/settings`), adminBulkRoutes (`/api/admin/bulk`), adminExportRoutes (`/api/admin/export`).
  - [ ] 16.2 Update CORS configuration in `backend/src/middlewares/security.js` to allow requests from the admin frontend origin (add `process.env.ADMIN_CORS_ORIGIN` to the allowed origins list alongside the existing `CORS_ORIGIN`).
  - [ ] 16.3 Add `ADMIN_CORS_ORIGIN` to `backend/.env` (e.g., `http://localhost:5174` for local admin dev server).
  - [ ] 16.4 Call `settingsInit` from `backend/src/services/settingsInit.js` during server startup in `backend/server.js` after database connection is established.
