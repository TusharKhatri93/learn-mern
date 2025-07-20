import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({children}){
    const {user, loading}=useAuth();

    if(loading){
        return <h2 className="text-xl font-bold text-center">Loading.....</h2>
    }

    if(!user){
        return <Navigate to="/signIn"/>
    }
    return children;
}