import { Container, Button, Alert } from "react-bootstrap";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import CandidateCard from "../../component/elections/CandidateCard";
import ElectionDetail from "../../component/elections/ElectionDetail";
import ResultChart from "../../component/elections/ElectionResultChart";

import Election from "../../model/Election.model";
import myApi from "../../service/MyApi";
import {
  CandidateDetail,
  PositionDetail,
  Vote,
  VotePosition,
  VoteCandidate,
} from "../../Interfaces/Election";
import { currentUser } from "../../model/User.model";

function ElectionDetailsPage() {
  const location = useLocation();
  const election = location.state as Election;

  const [positions, setPositions] = useState<PositionDetail[]>([]);
  const [candidates, setCandidates] = useState<CandidateDetail[]>([]);

  const [vote, setVote] = useState<Vote | undefined>(undefined);
  const [votePosition, setVotePosition] = useState<VotePosition[]>([]);
  const [voteCandidate, setVoteCandidate] = useState<VoteCandidate[]>([]);

  const isElectionFinished = (election) => {};

  // Error alert
  const [showError, setShowError] = useState(!election.isDataCompleted);

  const showErrorAlert = () => {
    if (showError) {
      return (
        <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
          There election is not completed!{" "}
          {currentUser.isAdmin
            ? "Edit now"
            : "Please contact the administrator to complete the election!"}
        </Alert>
      );
    }
  };

  useEffect(() => {
    const fetchDataAsync = async () => {
      const positionResult = await myApi.getPositions();
      if (positionResult.success) {
        const positions = (positionResult.data as PositionDetail[]).filter(
          (position) => position.electionId === election.id
        );
        setPositions(positions);
        console.log("[Election detail] position data:", positionResult);
      } else {
        // Handle error
      }

      const candidateResult = await myApi.getCandidates();
      if (candidateResult.success) {
        const candidates = (candidateResult.data as CandidateDetail[]).filter(
          (candidate) => candidate.electionId === election.id
        );
        setCandidates(candidates);
        console.log("[Election detail] candidate data:", candidateResult);
      } else {
        // Handle error
      }

      // if past election, get vote result
      if (election.state === 2) {
        const voteResult = await myApi.getVotes();
        if (voteResult.success) {
          const votes = (voteResult.data as Vote[]).filter(
            (vote) => vote.electionId === election.id
          );
          setVote(votes[0]);
          console.log("[Election detail] vote data:", voteResult);
        } else {
          // Handle error
        }
      }
    };

    fetchDataAsync();
  }, []);

  console.log("[Election detail] election:", election);

  // setVotePosition(vote!.votes)

  return (
    <div style={{ margin: "10px" }}>
      <Container>
        <div className="mb-2">
          <Button //@ts-expect-error
            as={Link}
            variant="outline-dark"
            to={"/"}
          >
            Back
          </Button>{" "}
          {currentUser.isAdmin ? (
            <Button //@ts-expect-error
              as={Link}
              variant="primary"
              to={`/create`}
              state={election}
            >
              Edit
            </Button>
          ) : null}
        </div>
        {showErrorAlert()}
        <ElectionDetail election={election}></ElectionDetail>

        <h5> </h5>
        {positions.map((position) => (
          <div>
            <h5>{position.positionName}</h5>
            {/* if past election, show the result chart */}
            {election.state === 2 ? (
              <Container>
                <ResultChart></ResultChart>
              </Container>
            ) : null}
            <Container>
              <CandidateCard
                candidates={candidates.filter(
                  (candidate) => candidate.positionId === position.id
                )}
                electionStatus={election.state}
                isCompleted={isElectionFinished}
              ></CandidateCard>
            </Container>
          </div>
        ))}
      </Container>
    </div>
  );
}

export default ElectionDetailsPage;
