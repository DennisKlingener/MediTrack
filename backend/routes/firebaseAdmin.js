const admin = require('firebase-admin');

// Initialize Firebase Admin with the service account key
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT);  // Correct path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
 
