const request = require('supertest');
const mongoose = require('mongoose');
const Transaction = require('../models/Transactions');
const Wallet = require('../models/Wallets');
const User = require('../models/Users');
const Group = require('../models/Groups');
const Admin = require('../models/Admin');
const AuditLog = require('../models/AuditLog');

describe('Admin Transaction Controller', () => {
  let app;
  let adminToken;
  let testAdmin;
  let testUser;
  let testWallet;
  let testGroup;
  let testTransaction;

  beforeAll(async () => {
    // Setup test app
    app = require('../../server');
    
    // Create test admin
    testAdmin = await Admin.create({
      email: 'admin@test.com',
      password: 'password123',
      name: 'Test Admin',
      role: 'admin',
      isActive: true
    });

    // Create test user
    testUser = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      phoneNumber: '+2348012345678',
      dateOfBirth: new Date('1990-01-01'),
      password: 'password123',
      bvn: '12345678901',
      nin: '12345678901',
      isVerified: true
    });

    // Create test wallet
    testWallet = await Wallet.create({
      userId: testUser._id,
      totalBalance: 100000,
      availableBalance: 100000,
      lockedBalance: 0
    });

    // Create test group
    testGroup = await Group.create({
      name: 'Test Group',
      admin: testAdmin._id,
      maxMembers: 10,
      members: [testUser._id],
      invitationCode: 'ABC123',
      contributionAmount: 10000,
      frequency: 'Monthly',
      payoutOrder: 'random',
      duration: 12
    });

    // Create test transaction
    testTransaction = await Transaction.create({
      userId: testUser._id,
      groupId: testGroup._id,
      transactionId: Transaction.generateTransactionId(),
      type: 'contribution',
      amount: 10000,
      status: 'completed',
      description: 'Monthly contribution',
      paymentMethod: 'card',
      completedAt: new Date()
    });

    // Generate admin token
    const jwt = require('jsonwebtoken');
    const config = require('../config/config');
    adminToken = jwt.sign(
      { id: testAdmin._id, role: testAdmin.role, type: 'admin' },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  });

  afterAll(async () => {
    // Cleanup
    await Transaction.deleteMany({});
    await Wallet.deleteMany({});
    await User.deleteMany({});
    await Group.deleteMany({});
    await Admin.deleteMany({});
    await AuditLog.deleteMany({});
  });

  describe('GET /api/admin/transactions', () => {
    it('should retrieve transactions with pagination', async () => {
      const res = await request(app)
        .get('/api/admin/transactions')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toBeDefined();
      expect(res.body.data.total).toBeDefined();
      expect(res.body.data.page).toBeDefined();
      expect(res.body.data.pageSize).toBeDefined();
    });

    it('should filter transactions by status', async () => {
      const res = await request(app)
        .get('/api/admin/transactions?status=completed')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.items.every(t => t.status === 'completed')).toBe(true);
    });

    it('should filter transactions by type', async () => {
      const res = await request(app)
        .get('/api/admin/transactions?type=contribution')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.items.every(t => t.type === 'contribution')).toBe(true);
    });

    it('should sort transactions by amount', async () => {
      const res = await request(app)
        .get('/api/admin/transactions?sortBy=amount&sortOrder=asc')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      // Verify sorting
      const amounts = res.body.data.items.map(t => t.amount);
      for (let i = 1; i < amounts.length; i++) {
        expect(amounts[i] >= amounts[i - 1]).toBe(true);
      }
    });

    it('should reject invalid sort field', async () => {
      const res = await request(app)
        .get('/api/admin/transactions?sortBy=invalid')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('should reject invalid status', async () => {
      const res = await request(app)
        .get('/api/admin/transactions?status=invalid')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/admin/transactions/:id', () => {
    it('should retrieve transaction by ID', async () => {
      const res = await request(app)
        .get(`/api/admin/transactions/${testTransaction._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(testTransaction._id.toString());
      expect(res.body.data.userId).toBeDefined();
      expect(res.body.data.userId.firstName).toBe('John');
    });

    it('should retrieve transaction by transactionId', async () => {
      const res = await request(app)
        .get(`/api/admin/transactions/${testTransaction.transactionId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.transactionId).toBe(testTransaction.transactionId);
    });

    it('should return 404 for non-existent transaction', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/admin/transactions/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/admin/transactions/:id/reverse', () => {
    it('should reverse a completed transaction', async () => {
      const initialBalance = testWallet.availableBalance;

      const res = await request(app)
        .post(`/api/admin/transactions/${testTransaction._id}/reverse`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.originalTransaction.status).toBe('cancelled');
      expect(res.body.data.reversalTransaction).toBeDefined();

      // Verify wallet balance was updated
      const updatedWallet = await Wallet.findById(testWallet._id);
      expect(updatedWallet.availableBalance).toBe(initialBalance + testTransaction.amount);

      // Verify audit log was created
      const auditLog = await AuditLog.findOne({
        action: 'transaction_reversed',
        entityId: testTransaction._id.toString()
      });
      expect(auditLog).toBeDefined();
    });

    it('should not reverse a non-completed transaction', async () => {
      const pendingTx = await Transaction.create({
        userId: testUser._id,
        groupId: testGroup._id,
        transactionId: Transaction.generateTransactionId(),
        type: 'contribution',
        amount: 5000,
        status: 'pending',
        description: 'Pending contribution'
      });

      const res = await request(app)
        .post(`/api/admin/transactions/${pendingTx._id}/reverse`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Cannot reverse');
    });

    it('should return 404 for non-existent transaction', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .post(`/api/admin/transactions/${fakeId}/reverse`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/admin/transactions/:id/fail', () => {
    it('should mark a pending transaction as failed', async () => {
      const pendingTx = await Transaction.create({
        userId: testUser._id,
        groupId: testGroup._id,
        transactionId: Transaction.generateTransactionId(),
        type: 'contribution',
        amount: 5000,
        status: 'pending',
        description: 'Pending contribution'
      });

      const res = await request(app)
        .post(`/api/admin/transactions/${pendingTx._id}/fail`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('failed');

      // Verify audit log was created
      const auditLog = await AuditLog.findOne({
        action: 'transaction_failed',
        entityId: pendingTx._id.toString()
      });
      expect(auditLog).toBeDefined();
    });

    it('should not mark a non-pending transaction as failed', async () => {
      const res = await request(app)
        .post(`/api/admin/transactions/${testTransaction._id}/fail`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Cannot mark transaction as failed');
    });

    it('should return 404 for non-existent transaction', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .post(`/api/admin/transactions/${fakeId}/fail`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe('Authentication', () => {
    it('should reject requests without authentication token', async () => {
      const res = await request(app)
        .get('/api/admin/transactions')
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('should reject requests with invalid token', async () => {
      const res = await request(app)
        .get('/api/admin/transactions')
        .set('Authorization', 'Bearer invalid_token')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });
});
