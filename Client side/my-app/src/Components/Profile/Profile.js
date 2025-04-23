import React, {useEffect, useState} from 'react';
import './profile.css';
import { FaUserCircle } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import { useNavigate, useParams } from 'react-router';


const Profile = ({ setIsLoggedIn, user }) => {
    

    const [selectBooking, setSelectedBooking] = useState(null)
    
    
   const navigate = useNavigate();
   const { id } = useParams();
   console.log('This is params', id)
   console.log('user details', user)

    const fetchBookingByUser = async (userId) => {
       
        try { 
            const response =  await fetch(`http://localhost:8000/bookings/user/${userId}`)
            if (!response.ok) {
                throw new Error('error fetching booking')
            }
            
            const result = await response.json() 
            setSelectedBooking(result.data) 
           

        } catch (error) {
            console.log(error.message)
        }
       
    }

    useEffect(() => {
        const userInfo = user?.id || id;
        if (!userInfo) {
            navigate('/')
        }
        fetchBookingByUser(userInfo)
    }, [user, id])
   



    const handleLogout = async() => {
        try { 
            await fetch('http://localhost:8000/logout', {
                method: 'POST',
                credentials: 'include',
            })
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('booking')
            setIsLoggedIn(false); 
            navigate('/login')

        } catch (error) {
            console.log(error.message)

        }
       
    }

  
  return (
    <div className='parentProfile col-6'>
        
            {selectBooking && selectBooking.length !== 0 ? 
            <div className='userInfo'>
                
                <FaUserCircle size={50} className='profileIcon'/>
                <p>{selectBooking.firstName} {selectBooking.secondName}</p>
                <p>{selectBooking.email}</p>
                <p>Booking Date: {selectBooking.bookingDate.split(' ')[0]}</p>
                <p>Table No: {selectBooking.tableNumber}</p>
                <p>No of Guests {selectBooking.guestNumber}</p>
                <p>Status: {selectBooking.status}</p>
                {/* <Button className='btn btn-danger mb-3'>Cancel Reservation</Button> */}
                <Button onClick={handleLogout}>Logout</Button>
                
            </div>
            
            : <div>
                <p>Hi {user.firstName}, you dont have a reservation yet.</p>
                <p>{user.email}</p>
                <Button onClick={handleLogout}>Logout</Button>
            </div>
            }
            

    </div>
  )
}

export default Profile