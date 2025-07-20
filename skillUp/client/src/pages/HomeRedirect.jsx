import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../component/LoadingScreen"

export default function HomeRedirect(){
    const {user, loading} = useAuth();
    const navigate = useNavigate();

    useEffect(()=>{
        if(loading) return <LoadingScreen />;

        if(user){
            navigate("/dashboard");
        }
        else{
            navigate("/signIn");
        }
    },[user, loading, navigate]);
    return null;
}