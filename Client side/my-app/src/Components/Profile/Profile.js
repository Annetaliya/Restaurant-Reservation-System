import React, {useEffect, useState} from 'react';
import './profile.css';
import { FaUserCircle } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import { useNavigate, useParams } from 'react-router';
import Table from 'react-bootstrap/Table';


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
            console.log('BOOKED DATA FOR USER',result )
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
            <FaUserCircle size={50} className='profileIcon'/>
            <p>{user.firstName} {user.secondName}</p>
            <Button onClick={handleLogout}>Logout</Button>
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
                        <td>{item.bookingDate}</td>
                        <td>{item.tableNumber}</td>
                        <td>1</td>
                        <td>{item.status}</td>

                    </tr>
                ))
                : <tr>
                    <td>No reservation</td>
                </tr> }

            </tbody>
          </Table>
        
            
            

    </div>
  )
}

export default Profile