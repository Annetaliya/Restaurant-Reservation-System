import React, { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import { FaCircle } from "react-icons/fa";
import './home.css';

//import Booking from '../Booking/Booking';
import { useNavigate } from 'react-router';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import Header from '../../Images/restaurant header.jpg';



const Booking = ({ table }) => {
    
    const user = JSON.parse(localStorage.getItem('user'))
    const [show, setShow] = useState(false);
    const [bookedData, setBookedData] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null)
    const [formData, setFormData] = useState({
        userId: user ? user.id : '',
        reservationId: table ? table.id :'',
        tableNo: table ? table.tableNumber : '',
        guestNo: table ? table.guestNumber: '',
        bookingDate: '',
    })
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleDateChange = (date) => {
        if (!date) return;
        const options = {timeZone: 'Africa/Nairobi', hour12: false};
        const formattedDate = date.toLocaleString('en-GB', options).replace(',', '');
        setSelectedDate(date);
        setFormData((prev) => ({
            ...prev,
            bookingDate: formattedDate
        }))

    }

   

    const handeClose = () => setShow(false);
     
    const handleShow = () => setShow(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
           
            const {userId, reservationId, bookingDate} = formData;
            const payload = {userId, reservationId, bookingDate};
            const response  =  await fetch('http://localhost:8000/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
                
                });
                console.log('this is the booking payload:', payload)
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
                setBookedData(result.data);
                
                localStorage.setItem('booking', JSON.stringify(result.data))
                Swal.fire({
                              title: "Good Job",
                              text: "Reservation successful wait for confirmation!",
                              icon: "success",
                            });
                //const booking = JSON.parse(localStorage.getItem('booking'))
                setTimeout(()=> {
                    navigate(`/profile/${bookedData.bookingId}`)
                }, 2000)
                

        } catch (error) {
            console.log(error.message)

        }
        

    }
    
  return (
    <div>
        <Button variant='primary'  className='modalBtn' onClick={handleShow}>
            Click to Reserve table
        </Button>
        <Modal show={show} onHide={handeClose}>
            <Modal.Header closeButton>
                <Modal.Title>Only pick the date</Modal.Title>

            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}> 
                    <Form.Group className='mb-3' controlId='tableNo'>
                        <Form.Label>Table Number</Form.Label>
                        <Form.Control 
                        type='text'
                        name='tableNo'
                        value={formData.tableNo}
                        onChange={handleChange}
                        readOnly
                        />

                    </Form.Group>
                    <Form.Group className='mb-3' controlId='guestNo'>
                        <Form.Label>No. of Guests</Form.Label>
                        <Form.Control 
                        type='text'
                        name='guestNo'
                        value={formData.guestNo}
                        onChange={handleChange}
                        readOnly
                        />

                    </Form.Group>
                    <Form.Group>
                        <DatePicker 
                        selected={selectedDate}
                        onChange={handleDateChange}
                        className='form-control mb-3'
                        
                        showTimeSelect dateFormat="Pp" 
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

const Home = ({ booking, fetchUpdateReservationTable, reservationTable, setReservationTable}) => {
    const [loading, setLoading] =  useState(false);
    const [selectedLevel, setSelectedLevel] = useState('Level 1')
    const [selectIndex, setSelectedIndex] = useState(0)
    const [table, setTable] = useState(null);
    const [showAlert, setShowAlert] = useState(true)
    
    
   

    const user = JSON.parse(localStorage.getItem('user'));
    const navigate  =  useNavigate()
    

    const filterdTables = reservationTable.filter((item) => item.floorLevel === selectedLevel)

    const fetchReservationTables = async () => {
        
        try {
            const response =  await fetch('http://localhost:8000/reservations');
            if (!response.ok) {
                throw new Error (`Response status ${response.status}`)
            }
            const result =  await response.json();
            setReservationTable(result.data)
            console.log(result)

        } catch (err) {
            console.log(err.message)

        }
    }
    useEffect(() => {
        fetchReservationTables()
    }, [])

    const fetchTablebyId = async (id) => {
        
        setLoading(true)
        try {
            const response = await fetch(`http://localhost:8000/reservations/${id}`)
            if (!response.ok) {
                console.log('Error fetching table')
            }
            const result = await response.json();
            if (user) {
                setTable(result.data)
                setLoading(false)
            } else {
                navigate('/login')
            }
            

        } catch (error) {
            console.log(error.message)
        }
    }

  
    useEffect(() => {
        if (booking && booking.reservationId) {
            fetchUpdateReservationTable(booking.reservationId);
        }
    }, [booking]);
   
  return (
    <div>
        <img className='headerImg' src={Header} alt='food'/>
        {user && 
            <h1 className='homeIntro'>Welcome to eatery bay {user.firstName}! 
            </h1>
            
        }
        
        <p className='homeTxt'>Please first choose your prefered floor level</p>
        <div className='floorLevels'>
            {['Level 1', 'Level 2', 'Level 3'].map((level, index) => (
                <button 
                key={index}
                className={`levelbutton ${selectIndex === index ? 'active' : ''}`}
                onClick={() => {setSelectedLevel(level)
                                setSelectedIndex(index)

                }}
                
                >
                    {level}
        
                </button>
            ))}

        </div>
        <div className='tableItems'>
            {filterdTables.length !== 0 ?

            filterdTables.map((item) => (
            
                <div key={item.id} className='individualTable' onClick={() => fetchTablebyId(item.id)} >
                    <FaCircle className={`availability ${item.status === 'available' ? 'availability' : 'noAvailability'}`}/>
                    <div className='tableHome'></div>
                    <p className='tableNumber'>Table No.{item.tableNumber}</p>
                    <p className='guestNumber'>Guest Number {item.guestNumber}</p>
                    <p>${item.price}</p>
                </div>       
                
            ))
            : <p>No tables available</p>}
        </div>
        {loading ? (
            <p>...loading</p>
        ) : table ? (
            table.status === 'reserved' ? (
                <div className='alert'>
                    <Alert show={showAlert} variant="success">
                        <Alert.Heading>My Alert</Alert.Heading>
                        <p>
                            This table is not available

                        </p>
                        <hr />
                        <div className="d-flex justify-content-end">
                        <Button onClick={() => setShowAlert(false)} variant="outline-success">
                            Close me
                        </Button>
                        </div>
                    </Alert>

                    {!showAlert && <Button onClick={() => setShowAlert(true)}>Show Alert</Button>}
                </div>
            ) : (
                <Booking table={table} />
            )
        ) : (
            ''
        )
    }
    </div>
  )
}

export default Home