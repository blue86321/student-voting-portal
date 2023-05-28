import { Container, Button, Form, Alert, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import myApi from "../../service/MyApi";
import { Election as ElectionInterface, ElectionDetail } from "../../Interfaces/Election";
import Election from "../../model/Election.model";

function CreateElection({ electionForUpdate, onNext }) {
  const eUpdate = electionForUpdate as Election|null;
  const [electionName, setElectionName] = useState(eUpdate ? eUpdate.electionName : "");
  const [startTime, setStartTime] = useState<Date | null>(eUpdate ? eUpdate.startDate : null);
  const [endTime, setEndTime] = useState<Date | null>(eUpdate ? eUpdate.endDate : null);
  const [description, setDescription] = useState(eUpdate ? eUpdate.electionDesc : "");
  const [electionID, setElectionID] = useState<Number | null>(eUpdate ? eUpdate.id : null);

  const handleStartTime = (date: Date) => {
    setStartTime(date);
    const newDate = new Date(date.getTime() + 86400000);
    console.log("[CreateElection] date: ", date, ", newDate: ", newDate);
    setEndTime(newDate);
  };
  const handleEndTime = (date) => {
    setEndTime(date);
  };

  // Fetch election by election ID for update
  // if (electionForUpdate !== null) {
  //   console.log("[CreateElection] update with eID: ", electionForUpdate.id);
  //   setElectionID(electionForUpdate.id);
  //   setElectionName(electionForUpdate.electionName);
  //   setStartTime(electionForUpdate.startTime);
  //   setEndTime(electionForUpdate.endTime);
  //   setDescription(electionForUpdate.electionDesc);
  // }

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
    console.log("[CreateElectron] useEffect triggered");
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
    const election: ElectionInterface = {
      universityId: 1,
      electionName: electionName,
      electionDesc: description,
      startTime: new Date(startTime!),
      endTime: new Date(endTime!),
    };
    setIsClicked(true);
    setShowError(false);
    console.log("#K_ [CreatElection] submit event", election);
    const isCreate = electionID === null;
    const result = isCreate
      ? await myApi.createElection(election)
      : await myApi.updateElection({
          electionData: election,
          electionId: electionID.toString(),
        });
    console.log("#K_ [CreatElection] is create event", isCreate, "with result:", result);
    if (result.success) {
      const electionDetail = new Election(result.data as ElectionDetail);
      setElectionID(electionDetail.id);
      console.log("#K_ [CreatElection] result", electionDetail);
      setShowError(false);
      onNext(33.33, electionDetail);
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
          <Form.Group className="mb-3" controlId="formElectionName">
            <Form.Label>Election Name</Form.Label>
            <Form.Control
              type="text"
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

          <Form.Group className="mb-3" controlId="formElectionDescription">
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
              disabled={(electionID === null && isClicked) || !isValid}
            >
              {electionID === null ? (isClicked ? "Saved" : "Next") : "Update"}
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
}

export default CreateElection;
