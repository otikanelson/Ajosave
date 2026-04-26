const express = require('express');
const router = express.Router();

const { adminProtect } = require('../middlewares/adminAuth');
const {
  getUsers,
  getUserById,
  suspendUser,
  activateUser,
  deactivateUser,
  approveKyc,
  rejectKyc,
  getPendingKyc
} = require('../controllers/adminUserController');

// All routes require admin authentication
router.use(adminProtect);

// List and KYC pending — specific routes before parameterised /:id
router.get('/', getUsers);
router.get('/kyc/pending', getPendingKyc);

// Single user
router.get('/:id', getUserById);

// Account status actions
router.put('/:id/suspend', suspendUser);
router.put('/:id/activate', activateUser);
router.put('/:id/deactivate', deactivateUser);

// KYC actions
router.put('/:id/kyc/approve', approveKyc);
router.put('/:id/kyc/reject', rejectKyc);

module.exports = router;
