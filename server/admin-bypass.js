// Temporary admin bypass for testing - REMOVE IN PRODUCTION
const { db } = require('./db');
const { adminSessions } = require('../shared/schema');

async function createTestAdminSession() {
  const sessionToken = 'test-admin-session-' + Date.now();
  const email = 'saint@fifthelementsomatics.com';
  
  await db.insert(adminSessions).values({
    email,
    sessionToken,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  });
  
  console.log('Test admin session created:', sessionToken);
  console.log('Cookie to set: admin_session=' + sessionToken);
  return sessionToken;
}

// Run if called directly
if (require.main === module) {
  createTestAdminSession().then(() => process.exit(0));
}

module.exports = { createTestAdminSession };