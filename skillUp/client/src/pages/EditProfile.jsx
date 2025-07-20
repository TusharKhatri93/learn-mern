import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { reauthenticateWithCredential, reauthenticateWithPopup, GoogleAuthProvider, EmailAuthProvider, deleteUser } from "firebase/auth";
import { db } from "../firebase";
import toast from "react-hot-toast";

export default function EditProfile(){
    const {user} = useAuth();
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const handleSubmit= async(e)=>{
        e.preventDefault();

        if(!name.trim()){
            toast.error("Name should be filled");
            return;
        }

        try{
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {name});
            toast.success("Name updated successfully");
            setName("");
        }
        catch(err){
            toast.error(err.message||"Failed to update name");
        }
    }

    const handleDeleteAccount = async()=>{
        if(!window.confirm("Are you sure you want to delete your account?")) return;


        try{
            const providerId = user.providerData[0]?.providerId;    

            if(providerId==="password"){
                const password = prompt("Please enter your password to confirm delete");

                if(!password){
                    toast.error("Password is required");
                    return;
                }

                const userCredential = EmailAuthProvider.credential(user.email, password);
                await reauthenticateWithCredential(user,userCredential);
            }
            else if(providerId==="google.com"){
                const provider = new GoogleAuthProvider();
                await reauthenticateWithPopup(user, provider);
            }
            else{
                toast.error("Unsupported auth provider");
                return;
            }

            await deleteDoc(doc(db, "users", user.uid));

            await deleteUser(user);

            toast.success("Your account has been deleted successfully");
            navigate("/signIn");
        }
        catch(err){
            toast.error(err.message || "Failed to delete account");
        }
    }

    return(
        <div className="mt-4 bg-white shadow p-4 rounded max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    className="w-full mb-3 p-2 border rounded" 
                    placeholder="New Name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600">Update Name</button>
                <button type="button" 
                    className="bg-red-500 text-white mt-3 px-4 py-2 rounded w-full hover:bg-red-600"
                    onClick={handleDeleteAccount}
                >Delete My Account</button>
            </form>
        </div>
    );
}