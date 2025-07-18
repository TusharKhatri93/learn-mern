import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDBJxrkvVzGXK8RQiYfS_0KC5jZSotXx_g",
  authDomain: "skillup-35fca.firebaseapp.com",
  projectId: "skillup-35fca",
  storageBucket: "skillup-35fca.firebasestorage.app",
  messagingSenderId: "258247670517",
  appId: "1:258247670517:web:dc9c797a81314c0eaee3bc"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };