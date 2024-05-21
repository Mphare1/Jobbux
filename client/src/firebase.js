// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "jobbux-3d299.firebaseapp.com",
  projectId: "jobbux-3d299",
  storageBucket: "jobbux-3d299.appspot.com",
  messagingSenderId: "244618738532",
  appId: "1:244618738532:web:3bf15ed31037c64ff85871"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);