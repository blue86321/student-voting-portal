import { Container, Button, Form, Alert, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import myApi from "../../service/MyApi";
import { Election, ElectionDetail } from "../../Interfaces/Election";

function CreateElection({ onNext }) {
  const [electionName, setElectionName] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [description, setDescription] = useState("");

  const handleStartTime = (date: Date) => {
    setStartTime(date);
    const newDate = new Date(date.getTime() + 86400000)
    console.log("[CreateElection] date: ", date, ", newDate: ", newDate);
    setEndTime(newDate);
  };
  const handleEndTime = (date) => {
    setEndTime(date);
  };

  // Form control
  const [isClicked, setIsClicked] = useState(false);
  const [isValid, setValid] = useState(false);
  const validate = () => {
    return (
      electionName.length !== 0 &&
      description.length !== 0 &&
      startTime !== null &&
      endTime !== null
    );
  };
  useEffect(() => {
    const isValid = validate();
    setValid(isValid);
  }, [electionName, description]);

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

  // Form submition
  const [error, setError] = useState("");
  const handleClick = async () => {
    const election: Election = {
      universityId: 1,
      electionName: electionName,
      electionDesc: description,
      startTime: new Date(startTime!),
      endTime: new Date(endTime!),
    };
    setIsClicked(true);
    setShowError(false);
    console.log("#K_ [CreatElection] submit event", election);
    const result = await myApi.createElection(election);
    if (result.success) {
      const electionDetail: ElectionDetail = result.data as ElectionDetail
      console.log("#K_ [CreatElection] result", electionDetail);
      setIsClicked(false);
      setShowError(false);
      onNext(33.33);
    } else {
      setError(result.msg);
      setIsClicked(false);
      setShowError(true);
      console.log("#K_ [CreatElection] error", error);
    }
  };

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
                  onChange={(date) => handleStartTime(date)}
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
                  onChange={(date) => handleEndTime(date)}
                  className="form-control"
                  showTimeSelect
                  minDate={startTime}
                  showDisabledMonthNavigation
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
