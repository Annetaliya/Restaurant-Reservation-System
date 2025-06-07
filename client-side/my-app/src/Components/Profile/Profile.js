import React, {useEffect, useState} from 'react';
import './profile.css';
import { FaUserCircle } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import { useNavigate, useParams } from 'react-router';
import Table from 'react-bootstrap/Table';



const Profile = ({ setIsLoggedIn, user }) => {
    

    const [selectBooking, setSelectedBooking] = useState([])
    const [currentBookings, setCurrentBookings] = useState([])
    
    function toMySQLDateTime(date) {
     const pad = n => n.toString().padStart(2, '0');
     return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
         `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }
    
    const currentDate = new Date()
    const now = toMySQLDateTime(currentDate);
   
    
   const navigate = useNavigate();
   const { id } = useParams();
   
 

   useEffect(() => {
    const filteredBooking = selectBooking.filter((element) => {
        return element.booking_date.split("T")[0] >= now.split(' ')[0];
    })
    setCurrentBookings(filteredBooking)

   }, [selectBooking])

   

    const fetchBookingByUser = async (userId) => {
       
        try { 
            const response =  await fetch(`https://restaurant-reservation-sy-git-609abf-annettes-projects-70970dfb.vercel.app/bookings/user/${userId}`)
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
   



   function handleLogout () {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('booking')
        setIsLoggedIn(false); 
        navigate('/login')
   }

  
  return (
    <div className='parentProfile'>
        <div className='userInfo'>
            <FaUserCircle size={70} className='profileIcon'/>
            <p>{user?.first_name} {user?.second_name}</p>
            <p>Hi {user?.first_name} here are your available bookings</p>
            
        </div>
          <Table className="col-10 mx-auto table">
            <thead>
                <tr>
                    <td>Date</td>
                    <td>Table No.</td>
                    <td>Amount</td>
                    <td>Status</td>
                </tr>
            </thead>
            <tbody>
                {currentBookings && currentBookings.length !== 0 ? 
                currentBookings
                .filter((element) => element.status !== 'cancelled')
                .map((item) => (
                    <tr key={item.id}>
                        <td>{item.booking_date.split('T')[0]}</td>
                        <td>{item.reservations.table_number}</td>
                        <td>{item.reservations.price}</td>
                        <td>{item.status}</td>

                    </tr>
                ))
                : <tr>
                    <td>No reservation</td>
                </tr> }

            </tbody>
          </Table>
          <div className='btnLogout'>
            <Button onClick={handleLogout}>Logout</Button>

          </div>
          
        
            
            

    </div>
  )
}

export default Profile