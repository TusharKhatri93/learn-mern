import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function SignUp(){
    const {signUp}=useAuth();
    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");

    const navigate = useNavigate();

    const handleSubmit = async(e)=>{
        e.preventDefault();
        if(!email || !password){
            toast.error("Please fill all fields");
            return;
        }
        try{
            await signUp(email,password);
            navigate("/dashboard");
        }
        catch(err){
            toast.error("Something went wrong"||err.message);
        }
    }

    return(
        <div className="flex flex-col items-center justify-center h-screen bg-grey-100">
            <form className="bg-white p-6 rounded shadow w-80" onSubmit={handleSubmit}>
                <h2 className="text-2xl mb-4 text-center font-semibold">Sign Up</h2>
                <input 
                    className="w-full mb-3 p-2 border rounded"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>{setEmail(e.target.value)}}
                    required
                />
                 <input 
                    className="w-full mb-3 p-2 border rounded"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value)}}
                    required
                />
                <button 
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600">
                        Create Account
                </button>
            </form>
        </div>
    )
}