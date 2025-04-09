// src/firebase.js
const firebase = require('firebase/app');  // Firebase app initialization
require('firebase/auth');  // Firebase Authentication SDK

// Replace with your Firebase project's configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMEQtFODLC9rZwdkT_mb3F1Gusu_1IU-g",
  authDomain: "meditrack-dualauth.firebaseapp.com",
  projectId: "meditrack-dualauth",
  storageBucket: "meditrack-dualauth.firebasestorage.app",
  messagingSenderId: "947596501774",
  appId: "1:947596501774:web:f381a371c54a5830aa2d5f",
  measurementId: "G-K3J4LGNFMS"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Export the auth service for use in components
module.exports = {
  auth: firebaseApp.auth(),  // Firebase Authentication service
  firebaseApp,  // The initialized Firebase app
};
