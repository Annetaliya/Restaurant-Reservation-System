import React from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup'
import { IoSearchSharp } from "react-icons/io5";

const AdminPanel = () => {
  return (
    <div>
      <InputGroup  className="w-50 mx-auto">
        <InputGroup.Text><IoSearchSharp /></InputGroup.Text>
        <Form.Control type='search' placeholder='search'/>
      </InputGroup>
      
    </div>
  )
}

export default AdminPanel