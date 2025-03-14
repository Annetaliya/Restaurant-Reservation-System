import NavBar from "./Components/Nav/NavBar";
import Home from "./Components/Home/Home";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { useEffect, useState } from "react";
import Profile from "./Components/Profile/Profile";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const booking = JSON.parse(localStorage.getItem('booking'));
 


 

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsLoggedIn(true)
    }

  }, [])
  return (
    <div>
      <NavBar isLoggedIn={isLoggedIn} />
      <Router>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/login' element={<Login setIsLoggedIn={setIsLoggedIn}/>}/>
          <Route path='/profile' element={<Profile booking={booking}  />}/>
          
        </Routes>
      </Router>
      
      
      
    </div>
  );
}

export default App;
