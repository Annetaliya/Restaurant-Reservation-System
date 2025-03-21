import React, {useEffect, useState} from 'react';
import './profile.css';
import { FaUserCircle } from "react-icons/fa";
import Button from "react-bootstrap/Button";


const Profile = ({ booking }) => {

    const [selectBooking, setSelectedBooking] = useState(null)
    console.log(booking)
   

    const fetchBookingById = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/bookings/${id}`)
            if (!response.ok){
                console.log('Error fetching booking')
            }
            const result = await response.json()
            console.log('booking for user:', result)
            setSelectedBooking(result.data)

        } catch (error) {
            console.log(error.message)

        }
    }

    useEffect(() => {
        if (booking && booking.id) {
            fetchBookingById(booking.id)
        }
    }, [booking])
  return (
    <div className='parent col-6'>
        
            {selectBooking ? 
            <div className='userInfo'>
                <div className='profileHeader'></div>
                <div className='profileIcon'><FaUserCircle size={40} /></div>
                <p>{selectBooking.firstName} {selectBooking.secondName}</p>
                <p>{selectBooking.email}</p>
                <p>Table No: {selectBooking.tableNumber}</p>
                <p>No of Guests {selectBooking.guestNumber}</p>
                <p className='bookingStatus'>Status: {selectBooking.status}</p>
                <Button className='btn btn-danger'>Cancel Reservation</Button>
                
            </div>
            
            : <p>No data yet</p>}

    </div>
  )
}

export default Profile