import NavBar from "./Components/Nav/NavBar";
import Home from "./Components/Home/Home";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import AdminPanel from "./Components/Admin/AdminPanel";
import ProtectedRoute from "./Components/ProtectedRoute";
import {BrowserRouter as Router, Routes, Route, useParams} from 'react-router-dom'
import { useEffect, useState } from "react";
import Profile from "./Components/Profile/Profile";
import Contact from "./Components/Contact/Contact";
import Footer from "./Components/Footer/Footer";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [reservationTable, setReservationTable] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const booking = JSON.parse(localStorage.getItem('booking'));
 


  const fetchUpdateReservationTable = async (id,) => {
         
             try { 
              if (!id || !booking) {
                throw new Error('Id and booking is required')
              }
              let newStatus;
              if (booking.status === 'confirmed') {
                newStatus = 'reserved';
              } else if (booking.status === 'cancelled') {
                newStatus = 'available';
              } else {
                return;
              }
                 const response =  await fetch(`http://localhost:8000/reservations/${id}`, {
                     method: 'PATCH',
                     headers: {
                         'Content-Type': 'application/json'
                     },
                     body: JSON.stringify({status: newStatus})
                 })
                 if (response.ok) {
                  const result = await response.json()
                  console.log('reserved table is being updated', result);
                  setReservationTable((prev) => 
                    prev.map((item) => {
                      if(item.id === id) {
                        return {...item, status: newStatus}
                      }
                      return item
                    })
                  )
                 }
 
                 const updatedData =  await response.json();
                 console.log('this is a reserved table being updated', updatedData)
 
             } catch (error) {
                 console.log(error.message)
 
             }
         
        
         
     }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsLoggedIn(true)
    }

  }, [])
  return (
    <div>
      <NavBar isLoggedIn={isLoggedIn} user={user}/>
      <Router>
        <Routes>
          <Route path="/" element={<Home booking={booking} fetchUpdateReservationTable={fetchUpdateReservationTable}  reservationTable={reservationTable} setReservationTable={setReservationTable}/>}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/login' element={<Login setIsLoggedIn={setIsLoggedIn} user={user}/>}/>
          <Route path='/profile/:id/' element={<Profile booking={booking}  setIsLoggedIn={setIsLoggedIn} user={user}/>}/>
          <Route path='/contact' element={<Contact />}/>
          <Route element={<ProtectedRoute user={user} />}>
            <Route path='/admin' element={<AdminPanel fetchUpdateReservationTable={fetchUpdateReservationTable} setIsLoggedIn={setIsLoggedIn}/>} />
          </Route>   
        </Routes>
      </Router>
      <Footer />
      
      
      
    </div>
  );
}

export default App;
