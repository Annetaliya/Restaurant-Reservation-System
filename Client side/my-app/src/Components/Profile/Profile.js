import React, {useEffect, useState} from 'react';
import './profile.css';
import { FaUserCircle } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import { useNavigate, useParams , useLocation} from 'react-router';
import Spinner from 'react-bootstrap/Spinner';

const Profile = ({ booking, setIsLoggedIn }) => {
    

    const [selectBooking, setSelectedBooking] = useState(null)
    const [loading, setLoading] = useState(true);
    
   const navigate = useNavigate();
   const params = useParams();
   const location = useLocation();

    const fetchBookingById = async (bookingId) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/bookings/${bookingId}`)
            if (!response.ok){
                throw new Error('Error fetching booking')
            }
            const result = await response.json()
            console.log('booking for user:', result)
            console.log('Fetch request ran')
            if (result && result.data){
                setSelectedBooking(result.data)
            }
            setLoading(false)

        } catch (error) {
            console.log(error.message)

        }
    }

    
      

    useEffect(() => {
        const bookingId = booking?.bookingId || params.bookingId || location.state?.bookingId;
        if (!bookingId) {
            navigate('/')
        }
        fetchBookingById(bookingId)
  
    }, [params.bookingId, location.state])
    
    
    


    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false); 
        navigate('/login')
    }

    if (loading) {
        return (
            <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
            </Spinner>
        )
    }
  return (
    <div className='parent col-6'>
        
            {selectBooking && selectBooking.length !== 0 ? 
            <div className='userInfo'>
                <div className='profileHeader'></div>
                <div className='profileIcon'><FaUserCircle size={40} /></div>
                <p>{selectBooking.firstName} {selectBooking.secondName}</p>
                <p>{selectBooking.email}</p>
                <p>Boking Date: {selectBooking.bookingDate.split(' ')[0]}</p>
                <p>Table No: {selectBooking.tableNumber}</p>
                <p>No of Guests {selectBooking.guestNumber}</p>
                <p className='bookingStatus'>Status: {selectBooking.status}</p>
                <Button className='btn btn-danger mb-3'>Cancel Reservation</Button>
                <Button onClick={handleLogout}>Logout</Button>
                
            </div>
            
            : <div>
                no data yet
            </div>
            }
            

    </div>
  )
}

export default Profile