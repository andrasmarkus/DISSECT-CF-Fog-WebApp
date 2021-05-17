const admin = require('firebase-admin');
const serviceAccount = require('../config/dissect-cf-firebase-adminsdk-8azqh-53aba3f558.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

/**
 * Returns the database
 */
module.exports = db;