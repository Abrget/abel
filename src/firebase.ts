import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDctvY2CbOACWhxoGKXFA4YUdrw-aZRXNE",
  authDomain: "noon-d9a2e.firebaseapp.com",
  databaseURL: "https://noon-d9a2e-default-rtdb.firebaseio.com",
  projectId: "noon-d9a2e",
  storageBucket: "noon-d9a2e.firebasestorage.app",
  messagingSenderId: "649915486709",
  appId: "1:649915486709:web:8d5acd84641578c127d0bc",
  measurementId: "G-WJWM2X9DE4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export default app;
