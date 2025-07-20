import { Children } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function PublicRoute({children}){
    const {user, loading} = useAuth();

    if(loading) return null;

    return user? <Navigate to="/dashboard"/>: children;
}