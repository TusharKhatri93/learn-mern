import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./component/PrivateRoute";
import PublicRoute from "./component/PublicRoute";
import FeedbackForm from "./component/FeedbackFOrm";
import NotFoundPage from "./pages/NotFoundPage";
import Navbar from "./component/Navbar";
import HomeRedirect from "./pages/HomeRedirect";
import {Toaster} from "react-hot-toast";
import EditProfile from "./pages/EditProfile";
import { useAuth } from "./context/AuthContext";

function App() {
  const {loading} = useAuth();

  if(loading){
    return(
      <div className="h-screen flex items-center justify-center text-xl font-semibold">
        Checking authentication....
      </div>
    );
  }

  return (
    <Router>
      <Navbar/>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<HomeRedirect />}/>
        <Route path="/signUp" element={
                              <PublicRoute>
                                <SignUp/>
                              </PublicRoute>
                              }/>
        <Route path="/signIn" element={
                              <PublicRoute>
                                <SignIn/>
                              </PublicRoute>
                              }/>
        <Route 
          path="/dashboard" 
          element={
              <PrivateRoute>
                <Dashboard/>
              </PrivateRoute>
            }>
              <Route path="edit" element={<EditProfile/>} />
        </Route>
        <Route path="/feedback" element={<FeedbackForm />}/>
        <Route path="*" element={<NotFoundPage />}/>
      </Routes>
    </Router>
  )
}

export default App;
