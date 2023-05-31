import { Button, Card, Modal, Row } from "react-bootstrap";
import { useState } from "react";
import "./CandidateCard.css";
import { currentUser } from "../../model/User.model";
import { VoteCandidateDetail } from "../../model/Interfaces/Election";
import Logger from "../utils/Logger";

function CandidateCard({ position, selectedID, electionStatus, isCompleted }) {
  Logger.debug("[CandidateCard]:", position);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClick = (candidateID, positionID) => {
    if (!currentUser.isLoggedIn()) {
      handleShow();
    } else {
      isCompleted(candidateID, positionID);
    }
  };

  const showErrorModal = () => {
    return (
      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>You haven't login</Modal.Title>
          </Modal.Header>
          <Modal.Body>You have to login before you vote!</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  const setUpVoteButton = (candidateID, positionID) => {
    const isClicked = candidateID === selectedID;
    Logger.debug(
      "[CandidateCard] setUpVoteButton by electionStatus",
      electionStatus
    );
    if (electionStatus === 1) {
      return (
        <Button
          variant="primary"
          onClick={() => handleClick(candidateID, positionID)}
          disabled={isClicked || currentUser.isAdmin}
        >
          {isClicked ? "VOTED" : "VOTE"}
        </Button>
      );
    } else if (electionStatus === 2) {
      let c = 0;
      if (position !== undefined) {
        const candidateVote: VoteCandidateDetail | undefined =
          position.candidates.filter((can) => {
            return can.id === candidateID;
          })[0];
        // Logger.debug("[CandidateCard] load votes for candidate:", candidateVote)
        c = candidateVote?.voteCount ?? 0;
      }
      return (
        <Button variant="secondary" size="lg" disabled>
          {c}
        </Button>
      );
    } else {
      // if future elections or any other status/default, show nothing
      return null;
    }
  };

  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {showErrorModal()}
      {position.candidates.map((candidate) => (
        <div className="mb-4">
          <Card key={candidate.id} style={{ width: "22rem" }}>
            {/* winner banner */}
            {electionStatus === 2 && candidate.winner && (<div className="card-winner"> Winner </div>)}
            <Card.Body>
              <Card.Title className="text-center">
                {candidate.candidateName}
              </Card.Title>
            </Card.Body>
            <Card.Img className="card-image" src={candidate.photoUrl} />
            <Card.Body>
              <Card.Text className="card-text-multiline">
                {candidate.candidateDesc}
              </Card.Text>
              {/* TODO: to vote the candidate, add 1 for total votes. */}
              <div className="text-center">
                {setUpVoteButton(candidate.id, candidate.positionId)}
              </div>
            </Card.Body>
          </Card>
        </div>
      ))}
    </Row>
  );
}

export default CandidateCard;
