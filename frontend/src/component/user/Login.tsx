import React, { useEffect, useState } from "react";
import Register from "./Register";
import {
  Button,
  Modal,
  Form,
  Alert,
} from "react-bootstrap";
import { currentUser } from "../../model/User.model";
import myApi from "../../service/MyApi";
import { LoginParams, LoginResponse } from "../../model/Interfaces/User";
import { useNavigate } from "react-router-dom";
import Logger from "../utils/Logger";

function Login(props) {
  const [registerModalShow, setRegisterModalShow] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  // Form control
  const [isClicked, setIsClicked] = useState(false);
  const [isValid, setValid] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const isValid = email.length !== 0 && password.length !== 0;
    setValid(isValid);
  }, [email, password]);

  // Form submition
  const [error, setError] = useState("");
  const handleSubmit = async (event) => {
    const user: LoginParams = {
      email: email,
      password: password,
    };
    setIsClicked(true);
    setShowError(false);
    event.preventDefault();
    const result = await myApi.login(user);
    Logger.debug("[Login] result", result);
    if (result.success) {
      currentUser.setUser(result.data as LoginResponse);
  
      setIsClicked(false);
      props.onHide();
      if (currentUser.isAdmin) { // only redirect admin to home page on login
        navigate("/", { state: "login" });
      }
    } else {
      setError(result.msg);
      setIsClicked(false);
      setShowError(true);
      Logger.error("[Login] error", error);
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
        <Form>
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
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>

          <div className="container d-flex justify-content-center">
            <Button
              variant="link"
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
            shouldRefreshToken={true}
          />
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default Login;
