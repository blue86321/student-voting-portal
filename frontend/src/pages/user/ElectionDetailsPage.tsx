import { Container, Button } from "react-bootstrap";
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

function ElectionDetailsPage() {
  const location = useLocation();
  const election = location.state as Election;

  const [positions, setPositions] = useState<PositionDetail[]>([]);
  const [candidates, setCandidates] = useState<CandidateDetail[]>([]);

  const [vote, setVote] = useState<Vote | undefined>(undefined);
  const [votePosition, setVotePosition] = useState<VotePosition[]>([]);
  const [voteCandidate, setVoteCandidate] = useState<VoteCandidate[]>([]);

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

  setVotePosition(vote!.votes)

  return (
    <div style={{ margin: "10px" }}>
      <Container>
        <Button //@ts-expect-error
          as={Link}
          variant="outline-dark"
          to={"/"}
        >
          {" "}
          Back{" "}
        </Button>
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
              ></CandidateCard>
            </Container>
          </div>
        ))}
      </Container>
    </div>
  );
}

export default ElectionDetailsPage;
