import { useEffect, useState } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import {
  CreateUserParams,
  LoginResponse,
  University,
} from "../../model/Interfaces/User";
import myApi from "../../service/MyApi";
import { currentUser } from "../../model/User.model";
import Logger from "../utils/Logger";

function Register({show, onHide, shouldRefreshToken }) {
  const [isClicked, setIsClicked] = useState(false);
  const [dob, setDob] = useState(
    new Date().setFullYear(new Date().getFullYear() - 18)
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [universityId, setUniversityId] = useState(0);
  const [universities, setUniversities] = useState<University[]>([]);
  const [admin, setAdmin] = useState(false);
  const handleDob = (date) => {
    setDob(date);
  };
  Logger.debug("[Register]shouldRefreshToken", shouldRefreshToken)
  useEffect(() => {
    const fetchDataAsync = async () => {
      const universityResult = await myApi.getUniversities();
      if (universityResult.success) {
        const universities = universityResult.data as University[];
        Logger.debug("[Register] university data:", universities);
        setUniversities(universities);
      } else {
        // Handle error
        Logger.error("[Register] university data error:", universityResult);
      }
    };

    fetchDataAsync();
  }, []);

  // Form submition
  const [error, setError] = useState("");
  const handleCreateAccount = async (event) => {
    const user: CreateUserParams = {
      email: email,
      password: password,
      passwordConfirm: passwordConfirm,
      universityId: universityId === 0 ? universities[0].id : universityId,
      dob: new Date(dob),
      admin: admin,
    };
    setIsClicked(true);
    setShowError(false);
    Logger.debug("[Register] submit register event", user);
    event.preventDefault();
    const result = await myApi.createUser(user, shouldRefreshToken);
    if (result.success) {
      Logger.debug("[Register] result success:", result);
      if (shouldRefreshToken) {
        currentUser.setUser(result.data as LoginResponse);
      }
      setIsClicked(false);
      onHide();
    } else {
      Logger.error("[Register] error with msg:", result.msg);
      setError(result.msg);
      setIsClicked(false);
      setShowError(true);
    }
  };

  // Error alert
  const [showError, setShowError] = useState(false);

  const showErrorAlert = () => {
    if (showError) {
      return (
        <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
          Error: {error}
        </Alert>
      );
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create Account
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showErrorAlert()}
        <Form onSubmit={handleCreateAccount}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Your Email Address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              value={passwordConfirm}
              onChange={(e) => {
                setPasswordConfirm(e.target.value);
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formUniversity">
            <Form.Label>University</Form.Label>
            <Form.Select
              className="mb-3"
              aria-label="formUniversity"
              value={universityId}
              onChange={(e) => {
                setUniversityId(parseInt(e.target.value));
              }}
            >
              {universities.map((university) => (
                <option key={university.id} value={university.id}>{university.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="formDate">
            <Form.Label>Date of Birth</Form.Label>
            <DatePicker
              selected={dob}
              onChange={(date) => handleDob(date)}
              className="form-control"
              value={dob}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
              type="checkbox"
              label="Create an Admin Account"
              onChange={(e) => {
                setAdmin(e.target.checked);
              }}
            />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={isClicked}>
            Create account
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default Register;
