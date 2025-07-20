import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { Link, Outlet } from "react-router-dom";

export default function Dashboard() {
    const { user } = useAuth();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (!user) return;

        const userSnap = doc(db, "users", user.uid)

        const unsubscribe = onSnapshot(userSnap, (docSnap)=>{
            if(docSnap.exists()){
                setUserData(docSnap.data());
            }
        })

        return ()=> unsubscribe();
    }, [user])

    return (
        <div className="p-6 max-w-xl max-auto">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <Link to="edit" className="text-sm text-blue-500 underline mt-2 block">
                Edit Profile
            </Link>

            {userData ?
                <div className="bg-white rounded-xl shadow-md p-4">
                    <p>{userData.name}</p>
                    <p>{userData.email}</p>
                </div>
                :
                <p>Loading info......</p>
            }
            <Outlet/>
        </div>
    )
}