const admin = require('firebase-admin');
const serviceAccount = require('../config/dissect-cf-firebase-config.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

/**
 * Returns the database
 */
module.exports = db;