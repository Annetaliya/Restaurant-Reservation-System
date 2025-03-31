import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { IoSearchSharp } from "react-icons/io5";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Swal from "sweetalert2";
import Offcanvas from "react-bootstrap/Offcanvas";
import Modal from "react-bootstrap/Modal";
import { io } from "socket.io-client";
import { useNavigate } from "react-router";
import './admin.css';
import Toast from 'react-bootstrap/Toast';



const socket = io('http://localhost:8000');

function ModalForm({ showModal, handleCloseModal }) {
  const [formData, setFormData] = useState({
    tableNumber: "",
    guestNumber: "",
    price: "",
    status: "",
    floorLevel: "",
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
            <Form.Group className="mb-3" controlId="tableNumber">
              <Form.Label>Table Number</Form.Label>
              <Form.Control
                type="text"
                name="tableNumber"
                value={formData.tableNumber}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Select 
              name="guestNumber"
              value={formData.guestNumber}
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
              name='floorLevel'
              value={formData.floorLevel}
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

function SideBar() {
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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

const AdminPanel = ({fetchUpdateReservationTable}) => {
  const [reservations, setReservations] = useState([]);
  const [todaysReservations, setTodaysReservations] = useState(null);
  const [searchParams, setSearchParams] = useState('');
  const [notifications, setNotifications] = useState([]);
 


  const filteredSearchReservations = reservations.filter((element) => 
    element.firstName?.toLowerCase().includes(searchParams.toLowerCase()) || 
    element.id?.includes(searchParams)
  )

  const fetchReservations = async () => {
    try {
      const response = await fetch("http://localhost:8000/bookings");
      if (!response.ok) {
        console.log("Error fetching the reservations");
      }
      const result = await response.json();
      console.log("RESERVATIONS ON ADMIN PANEL:", result);
      setReservations(result.data);
    } catch (error) {
      console.log("error fetching", error.message);
    }
  };

  useEffect(() => {
    fetchReservations();
    socket.on('new booking', (newBooking) => {
      setNotifications((prev) => [...prev, newBooking])
      console.log('new booking emited', newBooking)
      Swal.fire({
        title: 'New Reservation',
        text: 'A new reservation has been made',
        icon: 'info',
      })
    })
    return () => {
      socket.off('new booking')
    }
  }, []);
  const options = { timeZone: "Africa/Nairobi", hour12: false };
  const today = new Date()
    .toLocaleString("en-GB", options)
    .replace(",", "")
    .split(" ")[0];

  useEffect(() => {
    const filterdReservation = reservations.filter((element) => {
      const reservationDate = element.bookingDate.split(" ")[0];
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
      console.log('response of delete function', result)
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
      <SideBar />
      <Toast>
      <Toast.Header>
        <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
        <small>11 mins ago</small>
      </Toast.Header>
      <Toast.Body>
      {notifications.length > 0 && (
        notifications.map((item, index) => (
          <div key={index}>
            <p>{item.bookingDate}</p>

          </div>
        ))

      )}

      </Toast.Body>
     
      
    </Toast>
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
            filteredSearchReservations.map((item) => (
              <tr key={item.id}>
                <td>{item.bookingDate.split(" ")[0]}</td>
                <td>{item.bookingDate.split(" ")[1]}</td>
                <td>{item.firstName}</td>
                <td>{item.id.split("-")[0]}</td>
                <td>{item.tableNumber}</td>
                <td>{item.guestNumber}</td>
                <td>{item.status}</td>
                <td>
                  <Button
                    onClick={() => handleUpdateReservation(item.id, item.reservationId)}
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
