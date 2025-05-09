import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import "./login.css";
import { Formik } from "formik";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import InputGroup from "react-bootstrap/InputGroup";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = ({ setIsLoggedIn }) => {
  const [showPassword, setShowPassword] = useState(false);

  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = "Required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email";
    }
    if (!values.password) {
      errors.password = "Required";
    }
    return errors;
  };

  const initialVaues = {
    email: "",
    password: "",
  };
  const navigate = useNavigate();
  //submit login form
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const result = await response.json();
      if (!response.ok) {
        if (result.error === "Email not found") {
          setErrors({ email: "Email not registered" });
        } else if (result.error === "Incorrect password") {
          setErrors({ password: "Incorrect Password" });
        }
        return;
      }
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      Swal.fire({
        title: "Good Job",
        text: "Login successful!",
        icon: "success",
      });
      const user = JSON.parse(localStorage.getItem('user'))
      setIsLoggedIn(true);
      if (user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
      
    } catch (error) {
      console.log(error, "login failed");

      Swal.fire({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }; 

  return (
    <div className="col-6 parent-container">
      <h4 className="loginHeader">Please Login to Continue...</h4>
      <Formik
        initialValues={initialVaues}
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
            <Form.Group as={Col} md="10" className="mb-2" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Email"
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
            <InputGroup as={Col} md="6" controlId="password">
              <InputGroupText onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </InputGroupText>

              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={values.password}
                onBlur={handleBlur}
                onChange={handleChange}
                isInvalid={touched.password && errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </InputGroup>
            <Button type="submit" disabled={isSubmitting} className="mt-2 mb-2">
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </Form>
        )}
      </Formik>
      <p className="signupTxt">
        Don't have an Account?
        <span>
          <Link to="/register">SignUp</Link>
        </span>
      </p>
    </div>
  );
};

export default Login;
