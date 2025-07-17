// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ added storage

const firebaseConfig = {
  apiKey: "AIzaSyBiTHtq1_B8zfhmTPRRtLeuty9REy1x_tQ",
  authDomain: "expense-tracker-d3ef3.firebaseapp.com",
  projectId: "expense-tracker-d3ef3",
  storageBucket: "expense-tracker-d3ef3.appspot.com",
  messagingSenderId: "619328638339",
  appId: "1:619328638339:web:e6bbcf4cec73ff4b583ab6",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Export Firestore and Storage
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ added
