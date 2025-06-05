import React, { useEffect, useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { IoSearchSharp } from "react-icons/io5";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Swal from "sweetalert2";
import Offcanvas from "react-bootstrap/Offcanvas";
import Modal from "react-bootstrap/Modal";


import { useNavigate } from "react-router";
import './admin.css';



function ModalForm({ showModal, handleCloseModal }) {
  const [formData, setFormData] = useState({
    table_number: "",
    guest_number: "",
    price: "",
    status: "",
    floor_level: "",
  });

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmitTable = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        console.log("error posting a table", response.statusText);
        return;
      }
      const result = await response.json();
      setFormData((prev) => ({
        ...prev,
        ...result.data,
      }));
      Swal.fire({
                text: "You created a table",
                icon: "success",
              });
      setFormData({
        table_number: "",
        guest_number: "",
        price: "",
        status: "",
        floor_level: "",

      })
      
    } catch (error) {
      Swal.fire({
                  title: "Error",
                  text: "Something went wrong",
                  icon: "error",
                });
      console.error('Fetching error',error.message);
    }
  };





  return (
    <div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Fill the table details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitTable}>
            <Form.Group className="mb-3" controlId="table_number">
              <Form.Label>Table Number</Form.Label>
              <Form.Control
                type="text"
                name="table_number"
                value={formData.table_number}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Select 
              name="guest_number"
              value={formData.guest_number}
              onChange={handleChange}
              aria-label="Default select example" 
              className="mb-3"
            >
              <option value="">Choose guest No</option>
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="6">6</option>
            </Form.Select>
            <Form.Group className="mb-3" controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Select 
              name='status'
              value={formData.status}
              onChange={handleChange}
              aria-label="Default select example" 
              className="mb-3"
              >
              <option value="">Choose status</option>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
            </Form.Select>
            <Form.Select 
              name='floor_level'
              value={formData.floor_level}
              onChange={handleChange}
              aria-label="Default select example"
            >
              <option value="">Choose floor level</option>
              <option value="Level 1">Level 1</option>
              <option value="Level 2">Level 2</option>
              <option value="Level 3">Level 3</option>
            </Form.Select>

            <Button variant="primary" type="submit">
            Submit
          </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          
        </Modal.Footer>
      </Modal>
    </div>
  );
}

function SideBar({setIsLoggedIn}) {
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const navigate = useNavigate()

  function handleLogout () {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('booking')
        setIsLoggedIn(false); 
        navigate('/login')
   }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Admin Actions
      </Button>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Actions</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <p>Create a new table</p>
          <Button onClick={handleShowModal}>Create Table</Button>
        </Offcanvas.Body>
        <Button onClick={handleLogout}>Logout</Button>
      </Offcanvas>
      <ModalForm showModal={showModal} handleCloseModal={handleCloseModal} />
    </>
  );
}

const AdminPanel = ({fetchUpdateReservationTable, setIsLoggedIn, user}) => {
  const [reservations, setReservations] = useState([]);
  const [todaysReservations, setTodaysReservations] = useState(null);
  const [searchParams, setSearchParams] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [highlighrow, setHighlightRow] = useState(null);
  const rowRefs = useRef({});
  

  

  const handleNotificationShow = () => {
     setShowNotifications(!showNotifications)
     
   }
 


  const filteredSearchReservations = reservations.filter((element) => 
    element.first_name?.toLowerCase().includes(searchParams.toLowerCase()) || 
    element.id?.includes(searchParams)
  )
  const fetchReservations = async () => {
    try {
      const response = await fetch("http://localhost:8000/bookings");
      if (!response.ok) {
        console.log("Error fetching the reservations");
      }
      const result = await response.json();
      
      setReservations(result.data);
    } catch (error) {
      console.log("error fetching", error.message);
    }
  };

 

  useEffect(() => {
    fetchReservations();
    
  }, []);

  
  const publicKey = 'BGQOtwfwG5bzN0Vhyb_hIk_GhMXzkhlnnnk4vMjTBZq5_ZfwY69gcKhGq08TUY0hOtkbVHm1PnqfTVU_ehpBoMQ'

 
  
   async function subscribe() {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          const presentSubscription = await registration.pushManager.getSubscription()
          if (!presentSubscription) {
            const subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: publicKey
             })
            await fetch('http://localhost:8000/subscribe', {
              method: 'POST',
              headers: {
              'Content-Type': 'application/json',
              },
             body: JSON.stringify(subscription)

            })
            
            
          } else {
            console.log('Already subscribed', presentSubscription);
          }
  
          

        } catch (err) {
          console.error('Subscription failed', err);
          
        }
        
      } else {
        console.log('Push manager is not supported')
      }
    }
  
    useEffect(() => {
      subscribe()
    }, [])

    useEffect(() => {
      const storedNotification = JSON.parse(localStorage.getItem('updatedNotification')) || []
      setNotifications(storedNotification)
      navigator.serviceWorker.addEventListener('message',(event) => {
        console.log('Message received', event.data)
        setNotifications((prev) => {
          const updated = [...prev, event.data]
          localStorage.setItem('updatedNotification',JSON.stringify(updated))
          return updated
        })
      })

    },[])
    function handleRemoveNotification() {
      setNotifications([]);
      localStorage.removeItem('updatedNotification')
    }
  
  const options = { timeZone: "Africa/Nairobi", hour12: false };
  const today = new Date()
    .toLocaleString("en-GB", options)
    .replace(",", "")
    .split(" ")[0];

  useEffect(() => {
    const filterdReservation = reservations.filter((element) => {
      const reservationDate = element.booking_date.split(" ")[0];
      return reservationDate === today;
    });
    setTodaysReservations(filterdReservation);
  }, [reservations, today]);

  const handleUpdateReservation = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "confirmed" }),
      });
      if (response.ok) {
        setReservations((prevReservations) =>
          prevReservations.map((item) =>
            item.id === id ? { ...item, status: "confirmed" } : item
          )
        );
        const result = await response.json();
        console.log("Admin changed result", result);
        localStorage.setItem("booking", JSON.stringify(result.data));
        Swal.fire({
          text: "Update successful!",
          icon: "success",
        });
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.log(error.message);
      Swal.fire({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
      });
    }
  };

  function handleHiglited(bookingRef) {
   const row = rowRefs.current[bookingRef];
   if (row) {
    row.scrollIntoView({behavior : 'smooth', block: 'center'})
    setHighlightRow(bookingRef)
    setTimeout(()=> setHighlightRow(null), 3000)
   } else {
    console.log('row not found for bookingId:', bookingRef)
   }
  }
  
const handeDeleteReservation = async (id, reservationId) => {
    try {
      const response = await fetch(`http://localhost:8000/bookings/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Error deleting reservation: ${response.statusText}`);
      }
      const tablesLeft = reservations.filter((element) => element.id !== id);
      setReservations(tablesLeft);
      const result = await response.json();
      localStorage.removeItem("booking");
      
      await fetchUpdateReservationTable( reservationId, "available")

      Swal.fire({
        text: "Delete successful!",
        icon: "success",
      });
    } catch (error) {
      console.log(error.message);
      Swal.fire({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
      });
    }
  };
 

  return (
    <div>
      <SideBar setIsLoggedIn={setIsLoggedIn}/>
      <div className="notificationContainer">
        <span className="notify" onClick={handleNotificationShow}>{notifications.length}</span>
        {notifications.length > 0 && (
          <div className={`notifyContainer ${showNotifications ? 'notifyShow' : ''}`}>
            {notifications.map((item,index) => (
              <p key={index}
               onClick={()=> handleHiglited(item.bookingId)} 
                className="notifyMessage">{item.message}
              </p>
            ))}
            <Button onClick={handleRemoveNotification}>Clear All</Button>
          </div>
        )}
        
        
        

      </div>
    
      <InputGroup className="w-50 mx-auto mb-5">
        <InputGroup.Text>
          <IoSearchSharp />
        </InputGroup.Text>
        <Form.Control 
          type="search" 
          placeholder="search by name or id" 
          value={searchParams}
          onChange={(e) => setSearchParams(e.target.value)}
        />
      </InputGroup>
      
      

      {todaysReservations && todaysReservations.length > 0 ? (
        <Table className="w-50 mx-auto mt-2">
          <thead>
            <tr>
              <th className="success">#</th>
              <th>Date</th>
              <th>Floor Level</th>
              <th>No of Bookings</th>
            </tr>
          </thead>
          <tbody>
            <tr className="notNotify">
              <td>1</td>
              <td>{today}</td>
              <td>Level 1</td>
              <td>{todaysReservations.length}</td>
            </tr>
          </tbody>
        </Table>
      ) : (
        <p>No reservations</p>
      )}

      <Table className="col-10 mx-auto table">
        <thead>
          <tr>
            <td>Date</td>
            <td>Time</td>
            <td>Name</td>
            <td>Booking Ref</td>
            <td>Table no.</td>
            <td>Guest No.</td>
            <td>Status</td>
            <td>Update</td>
            <td>Cancel</td>
          </tr>
        </thead>
        <tbody>
          {filteredSearchReservations.length !== 0 ? (
            filteredSearchReservations
            .filter((element) => element.status !== 'cancelled')
            .map((item) => (
              <tr 
                key={item.id}
                ref={(el) => (rowRefs.current[item.id] = el)}
                className={`${highlighrow === item.id ? 'highlighted' : ''}`}
              >
                <td>{item.booking_date.split("T")[0]}</td>
                <td>{item.booking_date.split("T")[1]}</td>
                <td>{item.first_name}</td>
                <td>{item.id.split("-")[0]}</td>
                <td>{item.table_number}</td>
                <td>{item.guest_number}</td>
                <td>{item.status}</td>
                <td>
                  <Button
                    onClick={() => handleUpdateReservation(item.id, item.reservation_id)}
                    disabled={item.status === "confirmed"}
                  >
                    Confirm
                  </Button>
                </td>
                <td>
                  <Button
                    className="btn btn-danger"
                    onClick={() => handeDeleteReservation(item.id)}
                  >
                    Cancel
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td>No reservations</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminPanel;
