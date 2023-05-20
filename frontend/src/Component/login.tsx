import React from "react";
import Register from "./register";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";

function Login(props) {
  const [registerModalShow, setRegisterModalShow] = React.useState(false);

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
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          <div
            className="container d-flex justify-content-center"
            style={{ padding: "10px" }}
          >
            <Button variant="primary" type="submit">
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
