import { createContext, useContext, useState, useEffect } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";
import { auth, provider, db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const Backend_url = import.meta.env.VITE_BACKEND_URL;

    const syncUserToBackend = async (fireUser) => {
        if (!fireUser) return;

        const token = await fireUser.getIdToken();
        const name = fireUser.displayName || fireUser.email.split("@")[0];

        try {
            await axios.post(`${Backend_url}/api/users`, {
                uid: fireUser.uid, 
                name,
                email: fireUser.email,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Synced with backend");
        }
        catch (err) {
            console.error("Backend sync error:", err.message);
        }
    };

    const signUp = async (email, password) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const displayName = user.email.split("@")[0];

        await setDoc(doc(db, "users", user.uid), {
            name: displayName,
            email: user.email,
            createdAt: serverTimestamp(),
        });
        await syncUserToBackend(user);

        toast.success("Signed Up successfully");
        return user;
    }

    const signIn = async (email, password) => {
        const userCredential = signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await syncUserToBackend(user);

        toast.success("Logged in");

        return userCredential.user;
    }

    const googleSignIn = async () => {
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;
        const displayName = user.displayName.split(" ")[0];

        await setDoc(doc(db, "users", user.uid), {
            name: displayName,
            email: user.email,
            createdAt: serverTimestamp(),
        }, { merge: true });

        await syncUserToBackend(user);

        toast.success("Signed in with Google");
        return user;
    }

    const logOut = async () => {
        await signOut(auth);
        toast.success("Logged Out");
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            setLoading(false);

            if (currentUser) {
                await syncUserToBackend(user);
            }

        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, signUp, signIn, googleSignIn, logOut }}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => useContext(AuthContext);

