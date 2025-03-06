import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import './register.css'


const Register = () => {
    const [validated, setValidate] = useState(false);
  return (
    <div className='col-6 parent-container'>
    <Form noValidate validated={validated}>
      <Row className="mb-3">
        <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>First name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="First name"
            defaultValue="Mark"
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationCustom02">
          <Form.Label>Last name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Last name"
            defaultValue="Otto"
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationCustomEmail">
          <Form.Label>Email</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              type="email"
              placeholder="Username"
              aria-describedby="inputGroupPrepend"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please choose a valid email.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="validationCustom03">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Enter Password" required />
          <Form.Control.Feedback type="invalid">
            Password should be atleast 8  characters.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col}  controlId="validationCustom04">
          <Form.Label>confirm Password</Form.Label>
          <Form.Control type="password" placeholder="Confirm password" required />
          <Form.Control.Feedback type="invalid">
            password does not match
          </Form.Control.Feedback>
        </Form.Group>
        
        
      </Row>
      <Form.Group as={Col} md="3"className='mb-3'  controlId="validationCustom04">
          <Form.Label>Phone</Form.Label>
          <Form.Control type="text" placeholder="Enter Phone no." required />
          <Form.Control.Feedback type="invalid">
            please provide a valid phone number
          </Form.Control.Feedback>
        </Form.Group>
     
      <Button type="submit">Submit form</Button>
    </Form>
    </div>
  )
}

export default Register