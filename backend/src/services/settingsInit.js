const Settings = require('../models/Settings');

/**
 * Initialize Settings
 *
 * Seeds default settings if none exist in the database.
 * Called during server startup after database connection is established.
 *
 * Default settings include:
 * - maxGroupSize: Maximum members in a group
 * - minContributionAmount: Minimum contribution amount
 * - maxContributionAmount: Maximum contribution amount
 * - maxTransactionAmount: Maximum single transaction amount
 * - maxWithdrawalAmount: Maximum withdrawal amount
 * - kycRequired: Whether KYC is required
 * - maintenanceMode: Whether platform is in maintenance
 */
const initializeSettings = async () => {
  try {
    const count = await Settings.countDocuments();

    if (count === 0) {
      console.log('🔧 Initializing default settings...');
      await Settings.seedDefaults();
      console.log('✅ Default settings initialized successfully');
    } else {
      console.log(`✅ Settings already exist (${count} records)`);
    }
  } catch (error) {
    console.error('❌ Error initializing settings:', error.message);
    // Don't throw — allow server to continue even if settings init fails
  }
};

module.exports = {
  initializeSettings
};
