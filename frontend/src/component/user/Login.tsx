import React, { useEffect, useState } from "react";
import Register from "./Register";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Alert,
} from "react-bootstrap";
import { LoginUser, authedUser } from "../../model/User.model";
import { AxiosError } from "axios";
import { authentication } from "../../service/Api";

function Login(props) {
  const [registerModalShow, setRegisterModalShow] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  // Form control
  const [isClicked, setIsClicked] = useState(false);
  const [isValid, setValid] = useState(false);
  const validate = () => {
    return email.length !== 0 && password.length !== 0;
  };
  useEffect(() => {
    const isValid = validate();
    setValid(isValid);
  }, [email, password]);

  // Form submition
  const [error, setError] = useState("");
  const handleSubmit = async (event) => {
    const user = new LoginUser(email!, password!);
    setIsClicked(true);
    setShowError(false);
    console.log("#K_ [Login] submit event");
    event.preventDefault();
    try {
      const result = await authentication(user);
      authedUser.setUser(result.email, result.token.access, result.token.refresh, result.is_staff, result.id)
      console.log("#K_ [Login] result", authedUser);
    } catch (error) {
      setError((error as AxiosError).message);
      setIsClicked(false);
      setShowError(true);
      console.log("#K_ [Login] error", error);
    }
  };

  // Error alert
  const [showError, setShowError] = useState(false);

  const showErrorAlert = () => {
    if (showError) {
      return (
        <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
          There is an errror: {error}
        </Alert>
      );
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <div className="container d-flex justify-content-center">
          <Modal.Title
            className="text-center"
            id="contained-modal-title-vcenter"
          >
            Login
          </Modal.Title>
        </div>
      </Modal.Header>
      <Modal.Body>
        {showErrorAlert()}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </Form.Group>
          <div
            className="container d-flex justify-content-center"
            style={{ padding: "10px" }}
          >
            <Button
              variant="primary"
              type="submit"
              disabled={isClicked || !isValid}
              // onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>

          <div className="container d-flex justify-content-center">
            <Button
              variant="light"
              type="button"
              onClick={() => setRegisterModalShow(true)}
            >
              or Create an Account
            </Button>
          </div>

          <Register
            show={registerModalShow}
            onHide={() => {
              setRegisterModalShow(false);
              props.onHide();
            }}
          />
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default Login;
