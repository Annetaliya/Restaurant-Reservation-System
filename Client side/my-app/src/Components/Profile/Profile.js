import React, {useEffect, useState} from 'react';
import './profile.css';
import { FaUserCircle } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import { useNavigate, useParams } from 'react-router';
import Table from 'react-bootstrap/Table';


const Profile = ({ setIsLoggedIn, user }) => {
    

    const [selectBooking, setSelectedBooking] = useState([])
    const [currentBookings, setCurrentBookings] = useState([])
    
    const options = { timeZone: "Africa/Nairobi", hour12: false };
    const currentDate = new Date().toLocaleString('en-GB', options).replace(',', '').split(' ')[0]
    
   const navigate = useNavigate();
   const { id } = useParams();
   
 

   useEffect(() => {
    const filteredBooking = selectBooking.filter((element) => {
        return element.bookingDate.split(" ")[0] >= currentDate
    })
    setCurrentBookings(filteredBooking)

   }, [selectBooking, currentDate])

   

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
    <div className='parentProfile'>
        <div className='userInfo'>
            <FaUserCircle size={70} className='profileIcon'/>
            <p>{user?.firstName} {user?.secondName}</p>
            <p>Hi {user?.firstName} here are your available bookings</p>
            
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
                {selectBooking && selectBooking.length !== 0 ? 
                selectBooking
                .filter((element) => element.status !== 'cancelled')
                .map((item) => (
                    <tr key={item.id}>
                        <td>{item.bookingDate.split(' ')[0]}</td>
                        <td>{item.tableNumber}</td>
                        <td>{item.price}</td>
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