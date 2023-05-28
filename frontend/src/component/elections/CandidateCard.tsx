import { Button, Card, Row } from "react-bootstrap";
import React, { useState } from "react";
import "./CandidateCard.css";
import { currentUser } from "../../model/User.model";

function CandidateCard({ candidates, electionStatus, isCompleted }) {
  /* TODO: debug for card key;
    count add 1 after click the 'VOTE' button; 
    set them into position groups, currently, if clicked one "VOTE" in one of these cards, all the buttons will be disabled;
    update the electionStatus with the backend data.
    */

  console.log("[CandidateCard]:", electionStatus);
  let voteCount = 0;
  //   let electionStatus = "onGoing";

  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    voteCount++;
    console.log(voteCount);
  };

  // If the elections is "past", then show the total vote count instead of the "vote" button
  let buttonContent;

  if (electionStatus === 1 && !currentUser.isAdmin) {
    buttonContent = (
      <Button variant="primary" onClick={handleClick} disabled={isClicked}>
        {isClicked ? "VOTED" : "VOTE"}
      </Button>
    );
  } else if (electionStatus === 2) {
    buttonContent = (
      <Button variant="secondary" size="lg" disabled>
        {voteCount}
      </Button>
    );
  } else {
    // if future elections or any other status/default, show nothing
    buttonContent = "";
  }

  return (
    <Row xs={1} md={2} lg={3} className="g-4">
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
              <div className="text-center">{buttonContent}</div>
            </Card.Body>
          </Card>
        </div>
      ))}
    </Row>
  );
}

export default CandidateCard;
