import React from 'react';
import { useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";

const Booking = ({ table }) => {
    
    const user = JSON.parse(localStorage.getItem('user'))
    const [show, setShow] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null)
    const [formData, setFormData] = useState({
        userId: user ? user.id : '',
        reservationId: table ? table.id :'',
        guestNumber: '',
        bookingDate: '',
    })

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

   

    const handeClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response  =  await fetch('http://localhost:8000/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
                });
                if (!response.ok) {
                    throw new Error('Failed to create booking')
                }
                const result =  await response.json();
                console.log('booking data', result)
                if (result.data) {
                    setFormData((prev) => ({
                        ...prev,
                        ...result.data
                    }))

                }
                localStorage.setItem('booking', JSON.stringify(result.data))
                Swal.fire({
                              title: "Good Job",
                              text: "Reservation successful wait for confirmation!",
                              icon: "success",
                            });

        } catch (error) {
            console.log(error.message)

        }
        

    }
    
  return (
    <div>
        <Button variant='primary' onClick={handleShow}>
            Click to Reserve table
        </Button>
        <Modal show={show} onHide={handeClose}>
            <Modal.Header closeButton>
                <Modal.Title>Only pick the date</Modal.Title>

            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}> 
                    <Form.Group className='mb-3' controlId='userId'>
                        <Form.Label>Id</Form.Label>
                        <Form.Control 
                        type='text'
                        name='userId'
                        value={formData.userId}
                        onChange={handleChange}
                        readOnly
                        />

                    </Form.Group>
                    <Form.Group className='mb-3' controlId='reservationId'>
                        <Form.Label>Table Id</Form.Label>
                        <Form.Control 
                        type='text'
                        name='reservationId'
                        value={formData.reservationId}
                        onChange={handleChange}
                        readOnly
                        />

                    </Form.Group>
                    <Form.Group>
                        <DatePicker 
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        className='form-control mb-3'
                        dateFormat='yyyy-MM-dd'
                        placeholderText='click to pick date'
                        />
                    </Form.Group>
                    <Button variant="success" type='submit'>
                    Reserve
                    </Button>
                    
                </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handeClose} className='mt-3'>
                Close
            </Button>
           
        </Modal.Footer>

        </Modal>
    </div>
  )
}

export default Booking