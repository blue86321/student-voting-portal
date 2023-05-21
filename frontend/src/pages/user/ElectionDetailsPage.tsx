import { Container, Button } from "react-bootstrap";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import CandidateCard from "../../component/elections/CandidateCard";
import ElectionDetail from "../../component/elections/ElectionDetail";
import ResultChart from "../../component/elections/ElectionResultChart";

import Election from "../../model/Election.model";
import Position from "../../model/Position.model";
import Candidate from "../../model/Candidate.model";
import { fetchPositions, fetchCandidates } from "../../service/Api";

function ElectionDetailsPage() {
  const location = useLocation();
  const election = location.state as Election;

  const [positions, setPositions] = useState<Position[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const positionResult: [Position] = await fetchPositions();
        const positions = positionResult.filter(
          (position) => position.election_id === election.id
        );
        setPositions(positions);
        console.log("[Election detail] position data:", positionResult);
      } catch (error) {
        // Handle error
      }

      try {
        const candidateResult: [Candidate] = await fetchCandidates();
        const candidates = candidateResult.filter(
          (candidate) => candidate.election_id === election.id
        );
        setCandidates(candidates);
        console.log("[Election detail] candidate data:", candidateResult);
      } catch (error) {
        // Handle error
      }
    };

    fetchDataAsync();
  }, []);

  console.log("[Election detail] election:", election);

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

        {election.state === 2 ? (
          <Container>
            <ResultChart></ResultChart>
          </Container>
        ) : null}

        <h5> </h5>
        {positions.map((position) => (
          <div>
            <h5>{position.position_name}</h5>
            <Container>
              <CandidateCard
                candidates={candidates.filter(
                  (candidate) => candidate.position_id === position.id
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
