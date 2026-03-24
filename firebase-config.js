import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCFikZSzeiVbulbnjRm5um4rLkJ03wmCQw",
  authDomain: "aura-077.firebaseapp.com",
  projectId: "aura-077",
  storageBucket: "aura-077.firebasestorage.app",
  messagingSenderId: "465157338528",
  appId: "1:465157338528:web:1db123ac3777237ba4e0c5",
  measurementId: "G-DXZKH4HDKP"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

