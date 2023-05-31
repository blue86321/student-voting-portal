import { ProgressBar, Container, Button, Modal } from "react-bootstrap";
import { useState } from "react";

import "../../component/navigator/Header.css"
import CreateElection from "../../component/admin/CreateElection";
import CreatePositions from "../../component/admin/CreatePositions";
import CreateCandidates from "../../component/admin/CreateCandidates";
import { useLocation, useNavigate } from "react-router-dom";
import Election from "../../model/Election.model";
import Logger from "../../component/utils/Logger";

function CreateElectionPage() {
  const location = useLocation();
  let election = location.state as Election | null;
  const [progress, setProgress] = useState(()=>{
    let haveCandidates = false;
    if (election) {
      if (!election.positions) {
        return 33.33
      }
      election.positions.forEach(position => {
        if (position.candidates.length > 0) {
          haveCandidates = true;
          return
        }
      });
      return haveCandidates ? 66.67 : 33.33
    } else {
      return 0
    }
  });
  const [electionID, setElectionID] = useState(
    election ? election.id : undefined
  );
  const [positions, setPositions] = useState(
    election ? election.positions : undefined
  );
  const handleNext = (value, e) => {
    setProgress(Math.max(progress, value));
    setElectionID(e.id);
    if (election) {
      election.id = e.id;
      election.electionName = e.electionName;
      election.electionDesc = e.electionDesc;
      election.startDate = e.startDate;
      election.endDate = e.endDate;
      election.startTime = e.startTime;
      election.endTime = e.endTime;
    } else {
      election = e;
    }
    Logger.debug("[CreateElectionPage] created election: ", election);
  };

  const handleSave = (positions) => {
    Logger.debug("[CreateElectionPage] handleSave: ", positions, election)
    setPositions(positions);
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
          <ProgressBar variant="progbr-custom-color" now={progress} />
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
            <CreateCandidates electionID={electionID} positions={positions} onNext={handleSubmit}></CreateCandidates>
        )}
      </Container>
    </div>
  );
}

export default CreateElectionPage;
