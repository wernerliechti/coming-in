// Firebase project: coming-in-wernus
// Client-side config values are public by design (secured via Firestore Security Rules, not secrecy)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyApg0yuTxzJvPEmKDBo2_pgrE7pdt60m28",
  authDomain: "coming-in-wernus.firebaseapp.com",
  projectId: "coming-in-wernus",
  storageBucket: "coming-in-wernus.firebasestorage.app",
  messagingSenderId: "1036345210732",
  appId: "1:1036345210732:web:d7b064e5be8d05aa08e549"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
