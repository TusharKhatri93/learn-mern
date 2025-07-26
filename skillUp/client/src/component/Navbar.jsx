import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Modal from "./Modal";
import { useState } from "react";

export default function Navbar() {
    const { user, logOut } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logOut();
        navigate("/signIn");
        setIsModalOpen(false);
    };

    return (
        <nav className="bg-blue-600 p-4 flex justify-between items-center text-white">
            <Link to="/" className="text-xl font-bold">Skill Up</Link>

            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <span className="text-sm hidden sm:inline">{user.email}</span>
                        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                        <Link to="/profile" className="hover:underline">Profile</Link>

                        <button onClick={() => setIsModalOpen(true)} className="bg-red-500 px-3 py-1 rounded">Logout</button>

                        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                            <h2 className="text-lg font-semibold mb-4 text-black">Are you sure, you want to Logout?</h2>
                            <div className="flex justify-end gap-3">
                                <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">Yes, Logout</button>
                                <button onClick={() => setIsModalOpen(false)} className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">Cancel</button>
                            </div>
                        </Modal>
                    </>
                ) : (
                    <>
                        <Link to="/signIn" className="hover:underline">Sign In</Link>
                        <Link to="/signUp" className="hover:underline">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    )
}