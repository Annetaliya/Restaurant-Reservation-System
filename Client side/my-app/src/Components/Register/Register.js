import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "./register.css";
import { Formik } from "formik";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import InputGroup from "react-bootstrap/InputGroup";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { supabase } from "../../superBaseClient";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  
  const validate = (values) => {
    const errors = {};
    if (!values.first_name) {
      errors.first_name = "Required";
    } else if (values.first_name.length > 15) {
      errors.first_name = "Must be 15 characters or less";
    }
    if (!values.second_name) {
      errors.second_name = "Required";
    } else if (values.second_name.length > 20) {
      errors.second_name = "Must be 20 characters or less";
    }
    if (!values.email) {
      errors.email = "Required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    }

    if (!values.phone) {
      errors.phone = "Required";
    } else if (!/^\d{10}$/.test(values.phone)) {
      errors.phone = "Phone number must be exactly 10 digits";
    }

    if (!values.password) {
      errors.password = "Required";
    } else if (values.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = "Required";
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "passwords must match";
    }
    return errors;
  };

  const initialValues = {
    first_name: "",
    second_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  };
  const navigate = useNavigate();
 const handleSubmit = async (values, { setSubmitting, resetForm }) => {
  try {
    const response = await fetch('http://localhost:8000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: values.first_name,
        second_name: values.second_name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        phone: values.phone,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      Swal.fire({
        title: 'Error',
        text: result.error || 'Registration failed',
        icon: 'error',
      });
      return;
    }

    Swal.fire({
      title: 'Success',
      text: 'Registration successful!',
      icon: 'success',
    });

    resetForm();
    navigate('/login'); // redirect to login page
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: 'Something went wrong. Please try again.',
      icon: 'error',
    });
  } finally {
    setSubmitting(false);
  }
};


  return (
    <div className="col-6 parent-container">
      <h4 className="textRegister">Please Fill in the form to proceed</h4>
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} md="4" controlId="first_name">
                <Form.Label>First name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="First name"
                  name="first_name"
                  value={values.first_name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isInvalid={touched.first_name && errors.first_name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.first_name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="second_name">
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Last name"
                  value={values.second_name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isInvalid={touched.second_name && errors.second_name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.second_name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="email"
                  name="email"
                  value={values.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isInvalid={touched.email && errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <InputGroup as={Col} md="6" controlId="password">
                
                <InputGroupText onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEye/> : <FaEyeSlash/>}
                </InputGroupText>

                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter Password"
                  value={values.password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isInvalid={touched.password && errors.password}
                />

                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </InputGroup>
              < InputGroup as={Col} controlId="confirmPassword">
                <InputGroupText onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEye/> : <FaEyeSlash/>}</InputGroupText>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={values.confirmPassword}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isInvalid={touched.confirmPassword && errors.confirmPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </InputGroup>
            </Row>
            <Form.Group as={Col} md="3" className="mb-3" controlId="phone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                placeholder="Enter Phone no."
                value={values.phone}
                onBlur={handleBlur}
                onChange={handleChange}
                isInvalid={touched.phone && errors.phone}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phone}
              </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </Form>
        )}
      </Formik>
      <p>
        Already have an Account?
        <span>
          <Link to="/login">Login</Link>
        </span>
      </p>
    </div>
  );
};

export default Register;
