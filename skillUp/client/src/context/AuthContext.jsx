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

const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const [user, setUser] = useState(null);

    const signUp = async (email, password) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const displayName = user.email.split("@")[0];

        await setDoc(doc(db,"users",user.uid),{
            name: displayName,
            email: user.email,
            createdAt: serverTimestamp(),
        });

        return user;
    }

    const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password);

    const googleSignIn = async ()=> {
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;
        const displayName = user.displayName.split(" ")[0];

        await setDoc(doc(db, "users",user.uid),{
            name: displayName,
            email: user.email,
            createdAt: serverTimestamp(),
        },{merge: true});

        return user;
    }

    const logOut = ()=> signOut(auth);

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (currentUser)=>{
            setUser(currentUser);
        });

        return ()=> unsubscribe();
    },[]);

    return(
        <AuthContext.Provider value={{user, signUp, signIn, googleSignIn, logOut}}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => useContext(AuthContext);

