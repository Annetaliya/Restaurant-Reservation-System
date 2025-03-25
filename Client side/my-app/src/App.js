import NavBar from "./Components/Nav/NavBar";
import Home from "./Components/Home/Home";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import AdminPanel from "./Components/Admin/AdminPanel";
import ProtectedRoute from "./Components/ProtectedRoute";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { useEffect, useState } from "react";
import Profile from "./Components/Profile/Profile";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [reservationTable, setReservationTable] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const booking = JSON.parse(localStorage.getItem('booking'));
 


  const fetchUpdateReservationTable = async (id, newStatus) => {
         
             try { 
              const newStatus = booking?.status === 'confirmed' ? 'reserved': 'available'
                 const response =  await fetch(`http://localhost:8000/reservations/${id}`, {
                     method: 'PATCH',
                     headers: {
                         'Content-Type': 'application/json'
                     },
                     body: JSON.stringify({status: newStatus})
                 })
                 if (response.ok) {
                  const result = await response.json()
                  setReservationTable((prev) => 
                    prev.map((item) => {
                      if(item.id === id) {
                        if (newStatus === 'confirmed') {
                          return {...item, status: 'reserved' }

                        } else if (booking.message === 'Booking deleted') {
                          return {...item, status : 'available'}
                        }
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
      <NavBar isLoggedIn={isLoggedIn} />
      <Router>
        <Routes>
          <Route path="/" element={<Home booking={booking} fetchUpdateReservationTable={fetchUpdateReservationTable}  reservationTable={reservationTable} setReservationTable={setReservationTable}/>}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/login' element={<Login setIsLoggedIn={setIsLoggedIn} user={user}/>}/>
          <Route path='/profile' element={<Profile booking={booking}  user={user}/>}/>
          <Route element={<ProtectedRoute user={user} />}>
            <Route path='/admin' element={<AdminPanel fetchUpdateReservationTable={fetchUpdateReservationTable}/>} />
          </Route>   
        </Routes>
      </Router>
      
      
      
    </div>
  );
}

export default App;
