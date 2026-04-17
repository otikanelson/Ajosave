const cron = require('node-cron');
const Lock = require('../models/Lock');
const Wallet = require('../models/Wallets');
const Transaction = require('../models/Transactions');

/**
 * Release expired date-based locks.
 * Runs every hour.
 */
const startLockReleaseCron = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('🔓 Running lock release cron...');
    try {
      const expiredLocks = await Lock.find({
        status: 'active',
        releaseType: 'date',
        releaseDate: { $lte: new Date() }
      });

      console.log(`🔓 Found ${expiredLocks.length} expired lock(s)`);

      for (const lock of expiredLocks) {
        try {
          // Validate lock has required fields
          if (!lock.userId || !lock.amount) {
            console.warn(`⚠️ Skipping invalid lock ${lock._id}: missing userId or amount`);
            continue;
          }

          const wallet = await Wallet.findOne({ userId: lock.userId });
          if (!wallet) {
            console.error(`❌ Wallet not found for lock ${lock._id}`);
            continue;
          }

          await wallet.unlockFunds(lock.amount);

          lock.status = 'released';
          lock.releasedAt = new Date();
          await lock.save();

          const transaction = new Transaction({
            userId: lock.userId,
            transactionId: Transaction.generateTransactionId(),
            type: 'unlock',
            amount: lock.amount,
            status: 'completed',
            description: lock.label ? `Auto-unlocked: ${lock.label}` : 'Funds auto-unlocked',
            paymentMethod: 'wallet',
            metadata: { lockId: lock._id, autoRelease: true },
            completedAt: new Date()
          });
          await transaction.save();

          console.log(`✅ Released lock ${lock._id} for user ${lock.userId}`);
        } catch (err) {
          console.error(`❌ Failed to release lock ${lock._id}:`, err.message);
          // Continue processing remaining locks
        }
      }
    } catch (err) {
      console.error('❌ Lock release cron error:', err.message);
    }
  });

  console.log('⏰ Lock release cron scheduled (hourly)');
};

module.exports = { startLockReleaseCron };
