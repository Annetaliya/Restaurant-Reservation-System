import React, { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import { FaCircle } from "react-icons/fa";
import './home.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import Header from '../../Images/restaurant header.jpg';
import { useNavigate, useLocation } from 'react-router-dom';




const Booking = ({ table, show, setShow }) => {
    
    const user = JSON.parse(localStorage.getItem('user'))
   
    const [selectedDate, setSelectedDate] = useState(null)
    const [formData, setFormData] = useState({
        user_id: user ? user.id : '',
        reservation_id: table ? table.id :'',
        tableNo: table ? table.table_number : '',
        guestNo: table ? table.guest_number: '',
        price: table ? table.price: '',
        booking_date: '',
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
            booking_date: formattedDate
        }))

    }

   

    const handeClose = () => setShow(false);
     
   const handleSubmit = async (e) => {
        e.preventDefault();
        try {
           
            const {user_id, reservation_id, booking_date} = formData;
            const payload = {user_id, reservation_id, booking_date};
            const response  =  await fetch('http://localhost:8000/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
                
                });
                
                if (!response.ok) {
                    throw new Error('Failed to create booking')
                }
                const result =  await response.json();
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
                const user = JSON.parse(localStorage.getItem('user'))
                setTimeout(()=> {
                    navigate(`/profile/${user.id}`)
                }, 2000)
                

        } catch (error) {
            console.log(error.message)

        }
        

    }
    
  return (
    <div>
       
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
                    <Form.Group className='mb-3' controlId='price'>
                        <Form.Label>Amount</Form.Label>
                        <Form.Control 
                        type='text'
                        name='price'
                        value={formData.price}
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
    const [show, setShow] = useState(false);
     const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const location = useLocation();
    
    const handleShow = () => setShow(true);


    useEffect(() => {
        if (user?.role === 'admin' && location.pathname === '/') {
          navigate('/admin', {replace: true})
        }
    },[user?.role])  
    
   

   
    
    

   

    const fetchReservationTables = async () => {
        
        try {
           
            const response =  await fetch('http://localhost:8000/reservations');
            if (!response.ok) {
                throw new Error (`Response status ${response.status}`)
            }
            const result =  await response.json();
          
            setReservationTable(result.data)
            

        } catch (err) {
            console.log(err.message)

        }
    }
    useEffect(() => {
        fetchReservationTables()
    }, [])

    const filterdTables = reservationTable.filter((item) => item.floor_level === selectedLevel)

    const fetchTablebyId = async (id) => {
        
        setLoading(true)
        try {
           
            const response = await fetch(`http://localhost:8000/reservations/${id}`)
            if (!response.ok) {
                console.log('Error fetching table')
            }
            const result = await response.json();
            console.log('table data:', result.data)
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
        if (booking && booking.reservation_id) {
            fetchUpdateReservationTable(booking.reservation_id, booking);
        }
    }, [booking]);
   
  return (
    <div>
        <img className='headerImg' src={Header} alt='food'/>
        <h1 className='homeIntro'><span>Welcome</span> to eatery bay  {user && 
           <span>{user.first_name}</span>   
        }!</h1>
       
        
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
            
                <div key={item.id} className='individualTable' onClick={() => 
                    {fetchTablebyId(item.id)
                    handleShow()

                }} >
                    <FaCircle className={`availability ${item.status === 'available' ? 'availability' : 'noAvailability'}`}/>
                    <div className='tableHome'></div>
                    <p className='table_number'>Table No.{item.table_number}</p>
                    <p className='guest_number'>Guest Number {item.guest_number}</p>
                    <p className='price'> ${item.price}</p>
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
                <Booking table={table} show={show} setShow={setShow} handleShow={handleShow}/>
            )
        ) : (
            ''
        )
    }
    </div>
  )
}

export default Home