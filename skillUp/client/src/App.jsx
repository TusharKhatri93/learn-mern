import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./component/PrivateRoute";
import Navbar from "./component/Navbar";

function App() {

  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/signUp" element={<SignUp/>}/>
        <Route path="/signIn" element={<SignIn/>}/>
        <Route 
          path="/dashboard" 
          element={
              <PrivateRoute>
                <Dashboard/>
              </PrivateRoute>
            }/>
      </Routes>
    </Router>
  )
}

export default App;
