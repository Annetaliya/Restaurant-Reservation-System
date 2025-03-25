import React, {useEffect, useState} from 'react';
import './profile.css';
import { FaUserCircle } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import { io } from "socket.io-client";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router';

const socket = io('http://localhost:8000')



const Profile = ({booking}) => {
    

    const [selectBooking, setSelectedBooking] = useState(null)
    
    useEffect(() => {
        
        if (booking) {
            setSelectedBooking(booking)
        
        }
    }, [booking]);
    console.log(booking)
    

   const navigate = useNavigate();

    const fetchBookingById = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/bookings/${id}`)
            if (!response.ok){
                throw new Error('Error fetching booking')
            }
            const result = await response.json()
            console.log('booking for user:', result)
            if (result && result.data){
                setSelectedBooking(result.data)
            }

        } catch (error) {
            console.log(error.message)

        }
    }

    console.log('fetched booking details', selectBooking)

    useEffect(() => {
        
        if (booking?.id) {
            fetchBookingById(booking.id)
        }
        
        socket.on('reservation confirmed', (updatedBooking) => {
            if (booking && booking.id  === updatedBooking.id) {
                Swal.fire({
                    title: 'Reservation Confirmed!',
                    text: 'Your reservation has been confirmed',
                    icon: 'success'
                })
                localStorage.setItem(
                    'booking',
                    JSON.stringify({...booking, status: 'confirmed'})
                );
                setSelectedBooking(updatedBooking)
            }
        })
        return () => {
            socket.off('reservation confirmed')
        }
        
    }, [booking])


    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login')
    }
  return (
    <div className='parent col-6'>
        
            {selectBooking && selectBooking.length !== 0 ? 
            <div className='userInfo'>
                <div className='profileHeader'></div>
                <div className='profileIcon'><FaUserCircle size={40} /></div>
                <p>{selectBooking.firstName} {selectBooking.secondName}</p>
                <p>{selectBooking.email}</p>
                <p>Table No: {selectBooking.tableNumber}</p>
                <p>No of Guests {selectBooking.guestNumber}</p>
                <p className='bookingStatus'>Status: {selectBooking.status}</p>
                <Button className='btn btn-danger mb-3'>Cancel Reservation</Button>
                <Button onClick={handleLogout}>Logout</Button>
                
            </div>
            
            : <p>No data yet</p>}

    </div>
  )
}

export default Profile