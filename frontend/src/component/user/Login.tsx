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
import { CurrentUser, currentUser } from "../../model/User.model";
import { AxiosError } from "axios";
import myApi from "../../service/MyApi";
import User, { LoginParams, LoginResponse } from "../../Interfaces/User";
import { useNavigate } from "react-router-dom";
// import { useAppSelector, useAppDispatch } from "../../hooks";

function Login(props) {
  const [registerModalShow, setRegisterModalShow] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  //redux
  // const reduxUser = useAppSelector((state) => state.user.value);
  // const dispatch = useAppDispatch();

  // Form control
  const [isClicked, setIsClicked] = useState(false);
  const [isValid, setValid] = useState(false);
  const navigate = useNavigate();
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
    const user: LoginParams = {
      email: email,
      password: password,
    };
    setIsClicked(true);
    setShowError(false);
    console.log("#K_ [Login] submit event");
    event.preventDefault();
    try {
      const result = await myApi.login(user);
      // authedUser.setUser(result.email, result.token.access, result.token.refresh, result.is_staff, result.id)
      console.log("#K_ [Login] result", result);
      currentUser.setUser(result.data as LoginResponse);
      // const cUser = new CurrentUser()
      // cUser.setUser(result.data as User)
      // dispatch(setUser(cUser))

      setIsClicked(false);
      props.onHide();
      currentUser.staff || currentUser.superuser
        ? navigate("/manage_elections")
        : navigate("/");
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
          />
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default Login;
