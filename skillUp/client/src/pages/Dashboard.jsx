import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Dashboard(){
    const {user}= useAuth();
    const [userData, setUserData] = useState(null);
    
    useEffect(()=>{
        const fetchUser = async()=>{
            if(!user) return;

            const userSnap = await getDoc(doc(db, "users", user.uid))

            if(userSnap.exists()){
                setUserData(userSnap.data());
            }
        };

        fetchUser();
    },[user])

    return(
        <div className="p-6 max-w-xl max-auto">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            {userData?
                <div className="bg-white rounded-xl shadow-md p-4">
                    <p>{userData.name}</p>
                    <p>{userData.email}</p>
                </div>
                :
                <p>Loading info......</p>
            }
        </div>
    )
}