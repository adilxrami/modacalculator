// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // For authentication
import { getFirestore } from "firebase/firestore"; // <-- Add this for Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGGdAmxzFrWb1aDO0lydpGNm6CU9s2-rk",
  authDomain: "luna-1-2.firebaseapp.com",
  projectId: "luna-1-2",
  storageBucket: "luna-1-2.firebasestorage.app",
  messagingSenderId: "12626519120",
  appId: "1:12626519120:web:1b91f21d5d4c5d2c811d55",
  measurementId: "G-3JNQSXG7E4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);        // Authentication
export const db = getFirestore(app);     // Firestore database

// (Optional) Export app and analytics if needed elsewhere
export { app, analytics };
