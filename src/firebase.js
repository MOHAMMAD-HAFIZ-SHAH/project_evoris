// src/firebase.js

import { initializeApp } from "firebase/app";

// --- AUTH IMPORTS ---
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "firebase/auth";

// --- FIRESTORE IMPORTS ---
import { 
    getFirestore,
    collection,
    addDoc,
    Timestamp // Import Timestamp here to ensure correct object type is available
} from "firebase/firestore";

// 🌟 NEW: FIREBASE STORAGE IMPORTS 🌟
import { getStorage } from "firebase/storage"; 


// ⚠️ IMPORTANT: Replace these placeholders with your actual Firebase config keys
const firebaseConfig = {
  apiKey: "AIzaSyBjUBdV-UDlWmmgci4zRLyUuOqp4jkUx4Q",
  authDomain: "evoris-80629.firebaseapp.com",
  databaseURL: "https://evoris-80629-default-rtdb.firebaseio.com",
  projectId: "evoris-80629",
  storageBucket: "evoris-80629.firebasestorage.app",
  messagingSenderId: "126374103666",
  appId: "1:126374103666:web:045233cd7cfe8814ba10eb",
  measurementId: "G-FYT6SJP1K0"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// --- INITIALIZE SERVICES ---

// Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// Firestore Database
export const db = getFirestore(app); 
export const capsulesCollection = collection(db, "capsules");

// 🌟 FIX: INITIALIZE AND EXPORT FIREBASE STORAGE 🌟
export const storage = getStorage(app); 


// --- EXPORT FUNCTIONS ---
export { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged
};

// 🌟 FIX: EXPORT FIRESTORE METHODS and TIMESTAMP 🌟
// Timestamp is often the cause of the _location error if not imported correctly.
export { addDoc, Timestamp };