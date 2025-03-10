import React from 'react';
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import './login.css'
const Login = () => {
  return (
    <div  className="col-6 parent-container">
        <Form>
            <Form.Group  as={Col} md="6">
                <Form.Label>Email</Form.Label>
                <Form.Control
                type='text'
                placeholder='Email'
                name='email'
                >
                    
                </Form.Control>
            </Form.Group>
            <Form.Group  as={Col} md="6">
                <Form.Label>Password</Form.Label>
                <Form.Control
                type='password'
                placeholder='Password'
                name='password'
                >   
                </Form.Control>
            </Form.Group>
            <Button type='submit'>Submit</Button>
        </Form>
    </div>
  )
}

export default Login