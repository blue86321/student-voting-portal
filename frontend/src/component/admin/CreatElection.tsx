import { Container, Button, Form, Alert, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import Election from "../../model/Election.model";
import { createElection } from "../../service/Api";
import { AxiosError } from "axios";

function CreateElection() {
  const [electionName, setElectionName] = useState("");
  const [startTime, setstartTime] = useState("");
  const [endTime, setendTime] = useState("");
  const [description, setDescription] = useState("");

  const handlestartTime = (date) => {
    setstartTime(date);
  };
  const handleendTime = (date) => {
    setendTime(date);
  };

  // Form control
  const [isClicked, setIsClicked] = useState(false);
  const [isValid, setValid] = useState(false);
  const validate = () => {
    return (
      electionName.length !== 0 &&
      description.length !== 0 &&
      startTime.length !== 0 &&
      endTime.length !== 0
    );
  };
  useEffect(() => {
    const isValid = validate();
    setValid(isValid);
  }, [electionName, description]);

  // Form submition
  const [error, setError] = useState("");
  const handleClick = async () => {
    const election = new Election(
      electionName,
      description,
      startTime,
      endTime
    );
    setIsClicked(true);
    setShowError(false);
    console.log("#K_ [CreatElection] submit event", election);
    try {
      const result: Election[] = await createElection(election);
      console.log("#K_ [CreatElection] result", result);
    } catch (error) {
      setError((error as AxiosError).message);
      setIsClicked(false);
      setShowError(true);
      console.log("#K_ [CreatElection] error", error);
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

  // TODO: onclick handler

  return (
    <div style={{ margin: "20px" }}>
      <Container>
        {showErrorAlert()}
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Election Name</Form.Label>
            <Form.Control
              type="email"
              placeholder="Election Name"
              value={electionName}
              onChange={(event) => setElectionName(event.target.value)}
            />
          </Form.Group>

          <Row>
            <Col>
              <Form.Group controlId="formDate">
                <Form.Label>Start Date</Form.Label>
                <DatePicker
                  selected={startTime}
                  onChange={(date) => handlestartTime(date)}
                  className="form-control"
                  showTimeSelect
                  dateFormat="Pp"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formDate">
                <Form.Label>End Date</Form.Label>
                <DatePicker
                  selected={endTime}
                  onChange={(date) => handleendTime(date)}
                  className="form-control"
                  showTimeSelect
                  dateFormat="Pp"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Description</Form.Label>
            <Form.Control
              placeholder="Description"
              as="textarea"
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </Form.Group>

          <div className="container d-flex justify-content-center">
            <Button
              variant="primary"
              type="submit"
              onClick={handleClick}
              disabled={isClicked || !isValid}
            >
              {isClicked ? "Saved" : "Next"}
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
}

export default CreateElection;
