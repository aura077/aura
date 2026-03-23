import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBagrHgtTIObFHCK-XQ-Fs_T-fbwN6Xed8",
  authDomain: "aura-62244.firebaseapp.com",
  projectId: "aura-62244",
  storageBucket: "aura-62244.firebasestorage.app",
  messagingSenderId: "617932120986",
  appId: "1:617932120986:web:f26dc847282eebdbd1d023",
  measurementId: "G-3Z7DFPZ08G"
};

// Инициализация
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

