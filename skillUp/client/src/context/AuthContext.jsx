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

const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const [user, setUser] = useState(null);
    const [loading, setLoading]=useState(true);

    const signUp = async (email, password) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const displayName = user.email.split("@")[0];

        await setDoc(doc(db,"users",user.uid),{
            name: displayName,
            email: user.email,
            createdAt: serverTimestamp(),
        });

        toast.success("Signed Up successfully");
        return user;
    }

    const signIn = (email, password) => {
        const userCredential= signInWithEmailAndPassword(auth, email, password);
        toast.success("Logged in");

        return userCredential.user;
    }

    const googleSignIn = async ()=> {
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;
        const displayName = user.displayName.split(" ")[0];

        await setDoc(doc(db, "users",user.uid),{
            name: displayName,
            email: user.email,
            createdAt: serverTimestamp(),
        },{merge: true});

        toast.success("Signed in with Google");
        return user;
    }

    const logOut = async()=> {
        await signOut(auth);
        toast.success("Logged Out");
    }

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (currentUser)=>{
            setUser(currentUser);
            setLoading(false);
        });

        return ()=> unsubscribe();
    },[]);

    return(
        <AuthContext.Provider value={{user, loading, signUp, signIn, googleSignIn, logOut}}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => useContext(AuthContext);

