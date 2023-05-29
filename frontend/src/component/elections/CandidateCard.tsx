import { Button, Card, Modal, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import "./CandidateCard.css";
import { currentUser } from "../../model/User.model";
import { VoteCandidateDetail } from "../../Interfaces/Election";

function CandidateCard({ candidates, votes, selectedID, electionStatus, isCompleted }) {
  /* TODO: debug for card key;
    count add 1 after click the 'VOTE' button; 
    set them into position groups, currently, if clicked one "VOTE" in one of these cards, all the buttons will be disabled;
    update the electionStatus with the backend data.
    */

  console.log("[CandidateCard]:", electionStatus);
  // let voteCount = 0;
  //   let electionStatus = "onGoing";

  // const [isClicked, setIsClicked] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  console.log("[CandidateCard] votes:", votes)
  // useEffect(() => {
  //   setUpVoteButton()
  // },[])

  const handleClick = (candidateID, positionID) => {
    if (!currentUser.isLoggedIn()) {
      handleShow();
    } else {
      // voteCount++;
      // console.log(voteCount, value);
      isCompleted(candidateID, positionID)
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
    const isClicked = (candidateID === selectedID)
    console.log(
      "[CandidateCard] setUpVoteButton by electionStatus",
      electionStatus
    );
    if (electionStatus === 1) {
      return (
        <Button
          variant="primary"
          onClick={()=>handleClick(candidateID, positionID)}
          disabled={isClicked || currentUser.isAdmin}
        >
          {isClicked ? "VOTED" : "VOTE"}
        </Button>
      );
    } else if (electionStatus === 2) {
      let c = 0;
      if (votes !== undefined) {
        const candidateVote:VoteCandidateDetail|undefined = votes[0].candidates.filter(
          (can) => {
            console.log("[CandidateCard] filtering:", can.candidate.id, can.voteCount)
            return can.candidate.id === candidateID
          }
        )[0]
        console.log("[CandidateCard] load votes for candidate:", candidateVote)
        c = candidateVote?.candidate.voteCount ?? 0
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
      {candidates.map((candidate) => (
        <div style={{ margin: "10px", padding: "20px" }}>
          <Card key={candidate.id} style={{ width: "22rem" }}>
            <Card.Body>
              <Card.Title className="text-center">
                {candidate.candidateName}
              </Card.Title>
              <Card.Img className="card-image" src={candidate.photoUrl} />
              <Card.Text className="card-text-multiline">
                Introduction: <br />
                {candidate.candidateDesc}
              </Card.Text>
              {/* TODO: to vote the candidate, add 1 for total votes. */}
              <div className="text-center">{setUpVoteButton(candidate.id,candidate.positionId)}</div>
            </Card.Body>
          </Card>
        </div>
      ))}
    </Row>
  );
}

export default CandidateCard;
