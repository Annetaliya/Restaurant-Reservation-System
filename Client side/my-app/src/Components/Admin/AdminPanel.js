import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup'
import { IoSearchSharp } from "react-icons/io5";
import Table from 'react-bootstrap/Table';
import Button from "react-bootstrap/Button";

const AdminPanel = () => {
  const [reservations, setReservations] = useState([]);
  const [todaysReservations, setTodaysReservations] = useState(null);

  const fetchReservations = async () => {
    try {
      const response  =  await fetch('http://localhost:8000/bookings');
      if (!response.ok) {
        console.log('Error fetching the reservations')
      }
      const result = await response.json();
      console.log('RESERVATIONS ON ADMIN PANEL:', result);
      setReservations(result.data)

    } catch (error) {
      console.log('error fetching', error.message)

    }
  }

  useEffect(() => {
    fetchReservations()
  }, [])

  const today = new Date().toISOString().split('T')[0]


  useEffect(() => {
    
    const filterdReservation = reservations.filter((element) => {
      const reservationDate = element.bookingDate.split(" ")[0]
      return reservationDate === today
    })
    setTodaysReservations(filterdReservation)
  }, [reservations, today])

  
  return (
    <div>
      <InputGroup  className="w-50 mx-auto mb-5">
        <InputGroup.Text><IoSearchSharp /></InputGroup.Text>
        <Form.Control type='search' placeholder='search'/>
      </InputGroup>

    { todaysReservations && todaysReservations.length > 0 ? (
      <Table  className="w-50 mx-auto mt-2">
      <thead>
        <tr>
          <th>#</th>
          <th>Date</th>
          <th>Floor Level</th>
          <th>No of Bookings</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>{today}</td>
          <td>Level 1</td>
          <td>{todaysReservations.length}</td>
        </tr>
      
      </tbody>
      </Table>

    ): (
      <p>No reservations</p>

    )}

    <Table  className="w-50 mx-auto">
      <thead>
        <tr>
          <td>Date</td>
          <td>Booking Ref</td>
          <td>Guest No.</td>
          <td>Status</td>
          <td>Extend</td>
          <td>Cancel</td>
        </tr>
      </thead>
      <tbody>
        {reservations.length !== 0 ? 
        reservations.map((item) => (
          <tr key={item.id}>
            <td>{item.bookingDate.split(' ')[0]}</td>
            <td>{item.id.split('-')[0]}</td>
            <td>{item.guestNumber}</td>
            <td>{item.status}</td>
            <td><Button>Extend</Button></td>
            <td><Button className='btn btn-danger'>Cancel</Button></td>
            
          </tr>
        ))
        : <tr>
          <td>No reservations</td>
          </tr>}
      </tbody>
    </Table>
     
      
    </div>
  )
}

export default AdminPanel