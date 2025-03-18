import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBSFHtHoS8t4AaOFXr2XvpCnLDE6rBeOQ8",
  authDomain: "fibrex-e83bd.firebaseapp.com",
  projectId: "fibrex-e83bd",
  storageBucket: "fibrex-e83bd.firebasestorage.app",
  messagingSenderId: "187920041382",
  appId: "1:187920041382:web:ead882690b5b40c3b9fb67",
  measurementId: "G-NWPHW3F2CE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const database = getDatabase(app);
const db = getFirestore(app);

export { auth, googleProvider, database, ref, db,  onValue, collection, addDoc, query, orderBy, onSnapshot };
