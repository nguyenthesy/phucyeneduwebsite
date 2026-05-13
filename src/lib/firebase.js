import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCULiJx-eKtzsDGURSXRCTsJVmwT7tEvR8",
  authDomain: "anhnguphucyeneduweb.firebaseapp.com",
  projectId: "anhnguphucyeneduweb",
  storageBucket: "anhnguphucyeneduweb.firebasestorage.app",
  messagingSenderId: "464669969019",
  appId: "1:464669969019:web:18c82095bbb0430addb0de",
  measurementId: "G-GKE6BRKJB5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
