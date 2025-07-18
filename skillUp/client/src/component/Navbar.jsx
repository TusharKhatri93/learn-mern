import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar(){
    const { user, logOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async()=>{
        await logOut();
        navigate("/signIn")
    };

    return(
        <nav className="bg-blue-600 p-4 flex justify-between items-center text-white">
            <Link to="/" className="text-xl font-bold">Skill Up</Link>

            <div className="flex items-center gap-4">
               {user?(
                <>
                    <span className="text-sm hidden sm:inline">{user.email}</span>
                    <Link to="/dashboard" className="hover:underline">DashBoard</Link>
                    <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
                </>
               ):(
                <>
                    <Link to="/signIn" className="hover:underline">Sign In</Link>
                    <Link to="/signUp" className="hover:underline">Sign Up</Link>
                </>
               )} 
            </div>
        </nav>
    )
}