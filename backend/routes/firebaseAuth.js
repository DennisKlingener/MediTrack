import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCMEQtFODLC9rZwdkT_mb3F1Gusu_1IU-g",
  authDomain: "meditrack-dualauth.firebaseapp.com",
  projectId: "meditrack-dualauth",
  storageBucket: "meditrack-dualauth.firebasestorage.app",
  messagingSenderId: "947596501774",
  appId: "1:947596501774:web:f381a371c54a5830aa2d5f",
  measurementId: "G-K3J4LGNFMS"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
