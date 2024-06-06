// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Import other Firebase services as needed, e.g., getAuth, getStorage

const firebaseConfig = {
  // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  // authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  // projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  // appId: process.env.REACT_APP_FIREBASE_APP_ID

  apiKey: "AIzaSyAWt6CUw2ofGPI1TZIKb61lgUotLD0wUX8",

  authDomain: "tc-care.firebaseapp.com",

  databaseURL: "https://tc-care-default-rtdb.firebaseio.com",

  projectId: "tc-care",

  storageBucket: "tc-care.appspot.com",

  messagingSenderId: "932293067016",

  appId: "1:932293067016:web:226f46a8310301995b6cbd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export initialized services
export { app, db };
