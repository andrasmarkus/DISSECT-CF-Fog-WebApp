const admin = require('firebase-admin');
const serviceAccount = require('../config/dissect-cf-firebase-config.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: serviceAccount.project_id + '.appspot.com'
});

const db = admin.firestore();
const storage = admin.storage().bucket();

/**
 * Returns the database and storage
 */
const firestore = {
  db,
  storage
}

module.exports = firestore;
