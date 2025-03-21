import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { IoSearchSharp } from "react-icons/io5";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Swal from "sweetalert2";
import Offcanvas from 'react-bootstrap/Offcanvas';


function Example() {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    tableNumber: '',
    guestNumber: '',
    price: '',
    status: '',
    floorLevel: '',
    
  })

  const handleSubmitTable = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/reservations', {
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      if (!response.ok) {
        console.log('error posting a table')
      }
      const result = await response.json();
      setFormData((prev) => ({
        ...prev,
        ...result.data
      }))
      

    } catch (error) {
      console.log(error.message)

    }

  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
          <Button>Create Table</Button>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}


const AdminPanel = () => {
  const [reservations, setReservations] = useState([]);
  const [todaysReservations, setTodaysReservations] = useState(null);

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
  }, []);
  const options = {timeZone: 'Africa/Nairobi', hour12: false};
  const today = new Date().toLocaleString('en-GB', options).replace(',', '').split(' ')[0];
 

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
        method: 'PATCH',
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
        const result =  await response.json();
        console.log('Admin changed result', result)
        localStorage.setItem('booking', JSON.stringify(result.data))
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

  const handeDeleteReservation = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/bookings/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Error deleting reservation: ${response.statusText}`);
      }
      const tablesLeft = reservations.filter((element) => element.id !== id);
      setReservations(tablesLeft);
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
    <Example />
      <InputGroup className="w-50 mx-auto mb-5">
        <InputGroup.Text>
          <IoSearchSharp />
        </InputGroup.Text>
        <Form.Control type="search" placeholder="search" />
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

      <Table className="col-10 mx-auto">
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
          {reservations.length !== 0 ? (
            reservations.map((item) => (
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
                    onClick={() => handleUpdateReservation(item.id)}
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
