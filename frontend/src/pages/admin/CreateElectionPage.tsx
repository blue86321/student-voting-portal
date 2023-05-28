import { ProgressBar, Container, Button, Modal } from "react-bootstrap";
import { useState } from "react";

import CreateElection from "../../component/admin/CreatElection";
import CreatePositions from "../../component/admin/CreatePositions";
import CreateCandidates from "../../component/admin/CreateCandidates";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Election from "../../model/Election.model";

function CreateElectionPage() {
  const location = useLocation();
  let election = location.state as Election | null;
  const [progress, setProgress] = useState(election ? 33.33 : 0);
  const [electionID, setElectionID] = useState<Number | null>(
    election ? election.id : null
  );
  const handleNext = (value, e) => {
    setProgress(value);
    console.log("[CreateElectionPage] create election: ", e.id);
    setElectionID(e.id);
    if (election) {
      election.electionName = e.electionName;
      election.electionDesc = e.electionDesc;
      election.startDate = e.startDate;
      election.endDate = e.endDate;
      election.startTime = e.startTime;
      election.endTime = e.endTime;
    } else {
      election = e;
    }
  };
  console.log("[CreateElectionPage] election: ", election);

  const handleSave = (positions) => {
    election!.positions = positions;
    setProgress(66.67);
  };

  const handleSubmit = () => {
    setProgress(100);
    setShow(true);
  };
  const [show, setShow] = useState(false);

  const navigate = useNavigate();
  const handleClose = () => {
    setShow(false);
    navigate("/");
  };

  const showFinishedModel = () => {
      return (
        <>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Submit Succeed!</Modal.Title>
            </Modal.Header>
            {/* <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body> */}
            <Modal.Footer>
              <Button variant="primary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
  };

  return (
    <div style={{ padding: "20px" }}>
      <Container>
        {showFinishedModel()}
        <Container className="mx-2">
          <ProgressBar now={progress} label={`${progress}%`} />
        </Container>

        {progress >= 0 && (
          <CreateElection
            electionForUpdate={election}
            onNext={handleNext}
          ></CreateElection>
        )}

        {progress >= 33.33 && (
            <CreatePositions electionID={electionID} prePositions={election ? election.positions:null} onNext={handleSave}></CreatePositions>
        )}

        {progress >= 66.67 && (
            <CreateCandidates electionID={electionID} positions={election ? election.positions:null} onNext={handleSubmit}></CreateCandidates>
        )}
      </Container>
    </div>
  );
}

export default CreateElectionPage;
