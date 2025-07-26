import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import GoalManager from "../component/GoalManager";

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center w-full">
                <GoalManager />
            </div>
        </div>
    );
}
