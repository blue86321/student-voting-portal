import { Container, Button, Form, Alert, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import myApi from "../../service/MyApi";
import { Election as ElectionInterface, ElectionDetail } from "../../model/Interfaces/Election";
import Election from "../../model/Election.model";
import Logger from "../utils/Logger";
import DateTimeUtils from "../utils/DateTimeUtil";

function CreateElection({ electionForUpdate, onNext }) {
  const eUpdate = electionForUpdate as Election | null;
  const [electionName, setElectionName] = useState(eUpdate ? eUpdate.electionName : "");
  const [startTime, setStartTime] = useState<Date | null>(eUpdate ? DateTimeUtils.convertToGMT(eUpdate.startDate) : null);
  const [endTime, setEndTime] = useState<Date | null>(eUpdate ? DateTimeUtils.convertToGMT(eUpdate.endDate) : null);
  const [description, setDescription] = useState(eUpdate ? eUpdate.electionDesc : "");
  const [electionID, setElectionID] = useState<Number | null>(eUpdate ? eUpdate.id : null);

  const handleStartTime = (date: Date) => {
    setStartTime(date);
    const newDate = new Date(date.getTime() + 86400000);
    Logger.debug("[CreateElection] date: ", date, ", newDate: ", newDate);
    setEndTime(newDate);
  };
  const handleEndTime = (date) => {
    setEndTime(date);
  };

  // Form control
  const [isClicked, setIsClicked] = useState(false);


  useEffect(() => {
    Logger.debug("[CreateElectron] useEffect triggered");
    const isValid = () => {
      Logger.debug('[CreateElection] electionName: ', eUpdate);
      return (
        electionName.length !== 0 &&
        description.length !== 0 &&
        startTime !== null &&
        endTime !== null
      );
    };
    setIsClicked(!isValid());
  }, [electionName, description, startTime, endTime, eUpdate]);

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
  const handleClick = async (event) => {
    event.preventDefault();
    const election: ElectionInterface = {
      universityId: 1,
      electionName: electionName,
      electionDesc: description,
      startTime: new Date(startTime!),
      endTime: new Date(endTime!),
    };
    setIsClicked(true);
    setShowError(false);
    Logger.debug("[CreatElection] submit event", election, electionID);
    const isCreate = electionID === null;
    const result = isCreate
      ? await myApi.createElection(election)
      : await myApi.updateElection({
        electionData: election,
        electionId: electionID.toString(),
      });
    Logger.debug("[CreatElection] is create event", isCreate, "with result:", result);
    if (result.success) {
      const electionDetail = new Election(result.data as ElectionDetail);
      setElectionID(electionDetail.id);
      setShowError(false);
      onNext(33.33, electionDetail);
    } else {
      setError(result.msg);
      setIsClicked(false);
      setShowError(true);
      Logger.error("[CreatElection] error", error);
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
                  minDate={new Date()}
                  showDisabledMonthNavigation
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
              disabled={(electionID === null && isClicked) || isClicked}
            >
              {isClicked ? "Saved" : (electionID === null ? "Next" : "Update")}
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
}

export default CreateElection;
