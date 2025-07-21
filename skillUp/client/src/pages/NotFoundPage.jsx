import { Link } from "react-router-dom";

export default function NotFoundPage(){
    return(
        <div className="h-screen flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
            <p className="text-lg text-gray-700 mb-6">Oops! The page you're looking for doesn't exists.</p>
            <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                Go back to home
            </Link>
        </div>
    )
}