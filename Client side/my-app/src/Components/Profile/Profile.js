import React, {useEffect, useState} from 'react';
import './profile.css';
import { FaUserCircle } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import { useNavigate, useParams } from 'react-router';
import Table from 'react-bootstrap/Table';
import { supabase } from '../../superBaseClient';


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
            const { data, error} =  await supabase
                .from('booking')
                .select(`
                    id,
                    booking_data,
                    status,
                    reservations(table_number, guest_number, floor_level)
                    `)
                .eq('user_Id', userId)

            if (error) {
                throw new Error('Error fetching booking:', error.message)
            }
           // const response =  await fetch(`http://localhost:8000/bookings/user/${userId}`)
            // if (!response.ok) {
            //     throw new Error('error fetching booking')
            // }
            
            // const result = await response.json() 

            setSelectedBooking(data) 
            console.log('Booking data:',data)
           

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
            // await fetch('http://localhost:8000/logout', {
            //     method: 'POST',
            //     credentials: 'include',
            // })
            // localStorage.removeItem('token');
            // localStorage.removeItem('user');
            // localStorage.removeItem('booking')
            // setIsLoggedIn(false); 
            // navigate('/login')
             const { error } =  await supabase.auth.signOut()
             if (error) {
                throw error;
            }
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
                        <td>{item.table_number}</td>
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