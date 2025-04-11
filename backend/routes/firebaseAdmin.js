const admin = require('firebase-admin');

// Decode the Base64 encoded service account key string
const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT;
const serviceAccountJson = Buffer.from(serviceAccountBase64, 'base64').toString('utf-8');

// Parse the decoded JSON string to a JavaScript object
const serviceAccount = JSON.parse(serviceAccountJson);

// Initialize the Firebase Admin SDK using the decoded service account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log('Firebase Admin SDK initialized!');

module.exports = admin;
