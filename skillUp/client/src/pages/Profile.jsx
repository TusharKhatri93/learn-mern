import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import {
    reauthenticateWithPopup,
    reauthenticateWithCredential,
    GoogleAuthProvider,
    EmailAuthProvider,
    deleteUser,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Profile() {
    const { user } = useAuth();
    const [userData, setUserData] = useState(null);
    const [name, setName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;
        const userRef = doc(db, "users", user.uid);
        const unsubscribe = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setUserData(data);
                setName(data.name);
            }
        });

        return () => unsubscribe();
    }, [user]);

    const handleUpdateName = async (e) => {
        e.preventDefault();
        if (!name.trim()) return toast.error("Name cannot be empty");

        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { name });
            toast.success("Name updated successfully");
        } catch (err) {
            toast.error(err.message || "Failed to update name");
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure you want to delete your account?")) return;

        try {
            const providerId = user.providerData[0]?.providerId;

            // 1. Re-authenticate
            if (providerId === "password") {
                const password = prompt("Please enter your password to confirm:");
                if (!password) return toast.error("Password is required");

                const credential = EmailAuthProvider.credential(user.email, password);
                await reauthenticateWithCredential(user, credential);
            } else if (providerId === "google.com") {
                const provider = new GoogleAuthProvider();
                await reauthenticateWithPopup(user, provider);
            } else {
                return toast.error("Unsupported auth provider");
            }

            const token = await user.getIdToken();

            // 2. Delete from MongoDB (Backend)
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/delete`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // 3. Delete from Firestore
            await deleteDoc(doc(db, "users", user.uid));

            // 4. Delete from Firebase Auth
            await deleteUser(user);

            toast.success("Account deleted successfully");
            navigate("/signIn");
        } catch (err) {
            console.error("Delete account error:", err.message);
            toast.error(err.message || "Failed to delete account");
        }
    };


    return (
        <div className="p-6 max-w-xl mx-auto mt-10 bg-white shadow rounded">
            <h2 className="text-2xl font-bold mb-4 text-center">👤 Your Profile</h2>

            {userData ? (
                <div className="space-y-4">
                    <div className="text-center">
                        <p className="text-lg font-semibold">{userData.name}</p>
                        <p className="text-gray-600 text-sm">{userData.email}</p>
                    </div>

                    <form onSubmit={handleUpdateName} className="space-y-2">
                        <input
                            type="text"
                            className="w-full border p-2 rounded"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Update name"
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                        >
                            Update Name
                        </button>
                    </form>

                    <button
                        onClick={handleDeleteAccount}
                        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                    >
                        Delete My Account
                    </button>
                </div>
            ) : (
                <p className="text-center text-gray-500">Loading profile...</p>
            )}
        </div>
    );
}
