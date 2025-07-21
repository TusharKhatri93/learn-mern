import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Link, Outlet } from "react-router-dom";
import GoalManager from "../component/GoalManager";

export default function Dashboard() {
    const { user } = useAuth();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (!user) return;

        const userSnap = doc(db, "users", user.uid)

        const unsubscribe = onSnapshot(userSnap, (docSnap) => {
            if (docSnap.exists()) {
                setUserData(docSnap.data());
            }
        })

        return () => unsubscribe();
    }, [user])

    return (
        <div className="p-6 max-w-7xl mx-auto flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4 text-center">Dashboard</h1>
            <Link to="edit" className="text-sm text-blue-500 underline mt-2 block">
                Edit Profile
            </Link>
            {userData ?
                <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center justify-center gap-2">
                    <p>{userData.name}</p>
                    <p>{userData.email}</p>
                </div>
                :
                <p>Loading info......</p>
            }

            <div className="flex flex-col items-center justify-center w-full mt-8">
                <h1 className="text-2xl font-bold p-4">Learning Goals</h1>
                <GoalManager />
            </div>

            <Outlet />
        </div>
    )
}