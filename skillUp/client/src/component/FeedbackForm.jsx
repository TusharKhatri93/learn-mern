import { useState } from "react"
import { db } from "../firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function FeedbackForm(){
    const [message, setMessage] = useState("");
    const [rating, setRating] = useState("5");
    const [loading, setLoading] = useState(false);

    const {user} = useAuth();
    const id = user.uid;
    const email = user.email;

    const handleSubmit = async(e)=>{
        e.preventDefault();

        if(!message.trim()) return toast.error("Message is required");

        setLoading(true);
        try{
            await addDoc(collection(db, "feedback"),{
                id,
                email,
                message,
                rating,
                createdAt: serverTimestamp(),
            });
            setMessage("");
            setRating("5");
            toast.success("Thanks for submitting the form");
        }
        catch(err){
            toast.error("Error submitting form"||err.message);
        }  
        setLoading(false); 
    }

    return(
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
            <h2 className="text-xl font-semibold mb-4">Submit feedback</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <textarea 
                    className="border px-3 py-2 rounded"
                    placeholder="Your message"
                    value={message}
                    onChange={(e)=>setMessage(e.target.value)}
                />
                <select     
                    className="border px-3 py-2 rounded"
                    value={rating}
                    onChange={(e)=>setMessage(e.target.value)}
                >
                    <option value="5">🌟 5 - Excellent</option>
                    <option value="4">⭐ 4 - Good</option>
                    <option value="3">⭐ 3 - Average</option>
                    <option value="2">⭐ 2 - Poor</option>
                    <option value="1">⭐ 1 - Terrible</option>
                </select>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {loading?"Submitting...":"Submit feedback"} 
                </button>
            </form>
        </div>
    )
}