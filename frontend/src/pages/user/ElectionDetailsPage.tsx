import { Container, Button, Alert, Modal } from "react-bootstrap";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
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
  VoteDetail,
} from "../../Interfaces/Election";
import { currentUser } from "../../model/User.model";
import { PositionVote } from "../../model/Position.model";

function ElectionDetailsPage() {
  const location = useLocation();
  const election: Election | null = location.state
    ? new Election(location.state, false)
    : null;

  const [positions, setPositions] = useState<PositionVote[]>([]);
  const [candidates, setCandidates] = useState<CandidateDetail[]>([]);

  // vote for result page
  const [vote, setVote] = useState<VoteDetail | undefined>(undefined);
  // votePosition for submit vote
  const [votePosition, setVotePosition] = useState<VotePosition[]>([]);
  // const [voteCandidate, setVoteCandidate] = useState<VoteCandidate[]>([]);

  const isElectionFinished = (candidateID, positionID) => {
    console.log(
      "[ElectionDetailsPage] user submitting vote:",
      candidateID,
      positionID
    );
    const voteCandidate: VoteCandidate = {
      candidateId: candidateID,
      voteCount: 1,
    };
    const votePosition: VotePosition = {
      positionId: positionID,
      candidates: [voteCandidate],
    };
    setVotePosition((positions) => {
      let positionVoted = false;
      positions.forEach((p) => {
        if (p.positionId === positionID) {
          p = votePosition;
          positionVoted = true;
        }
      });
      if (!positionVoted) {
        return [...positions, votePosition];
      }
      console.log("[ElectionDetailsPage] update vote position", positions);
      return positions;
    });
    setPositions((positions) => {
      const updatedPositions: PositionVote[] = positions.map((p) => {
        if (p.id === positionID) {
          p.selectedCandidate = candidateID;
        }
        return p;
      });
      console.log("[ElectionDetailsPage] update positions", updatedPositions);
      return updatedPositions;
    });
  };

  const onClickSubmit = async () => {
    const postVote: Vote = {
      electionId: election!.id,
      votes: votePosition,
    };
    const result = await myApi.createVote(postVote);
    if (result.success) {
      console.log("[ElectionDetailsPage] Successfully created vote", result);
      showModalWithMessage("Vote Success", "Thank you for your perticiption!");
    } else {
      console.error("[ElectionDetailsPage] Failed to create vote", result);
      showModalWithMessage("Submit failed!", result.msg, "danger");
    }
  };

  const showModalWithMessage = (
    title: string,
    message: string,
    variant: string = "primary"
  ) => {
    setModalTitle(title);
    setModalBody(message);
    setModalVariant(variant);
    setShow(true);
  };

  const [show, setShow] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState("");
  const [modalVariant, setModalVariant] = useState("primary");
  const showSuccessModal = () => {
    return (
      <>
        <Modal show={show} onHide={goBack}>
          <Modal.Header closeButton>
            <Modal.Title>{modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalBody}</Modal.Body>
          <Modal.Footer>
            <Button variant={modalVariant} onClick={goBack}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  const showErrorWithMessage = (title: string, message: string) => {
    setErrorHeader(title);
    setErrorMsg(message);
    setShowError(true);
  };

  // Error alert
  const [showError, setShowError] = useState(false);
  const [errorHeader, setErrorHeader] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const showErrorAlert = () => {
    if (showError) {
      return (
        <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
          {errorHeader} {errorMsg}
        </Alert>
      );
    }
  };

  useEffect(() => {
    fetchDataAsync();
    if (election && !election.isDataCompleted) {
      showErrorWithMessage(
        "There election is not completed!",
        election?.state !== 1
          ? currentUser.isAdmin
            ? "Edit now"
            : "Please contact the administrator to complete the election!"
          : ""
      );
    }
  }, []);

  const fetchDataAsync = async () => {
    const positionResult = await myApi.getPositions();
    if (positionResult.success) {
      const positions = (positionResult.data as PositionVote[]).filter(
        (position) => position.electionId === election?.id
      );
      setPositions(positions);
      console.log("[ElectionDetailsPage] position data:", positions);
    } else {
      // Handle error
      console.log("[ElectionDetailsPage] position data error:", positionResult);
    }

    const candidateResult = await myApi.getCandidates();
    if (candidateResult.success) {
      const candidates = (candidateResult.data as CandidateDetail[]).filter(
        (candidate) => candidate.electionId === election?.id
      );
      setCandidates(candidates);
      console.log("[ElectionDetailsPage] candidate data:", candidates);
    } else {
      // Handle error
      console.log(
        "[ElectionDetailsPage] candidate data error:",
        candidateResult
      );
    }

    // if past election, get vote result
    if (election?.state === 2) {
      const voteResult = await myApi.getVotes();
      if (voteResult.success) {
        const votes = (voteResult.data as VoteDetail[]).filter(
          (vote) => vote.election.id === election?.id
        );
        setVote(votes[0]);
        console.log("[ElectionDetailsPage] vote data:", votes[0]);
      } else {
        // Handle error
        console.log("[ElectionDetailsPage] vote data error:", voteResult);
      }
    }
  };

  console.log("[ElectionDetailsPage] election:", election);
  // setVotePosition(vote!.votes)
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  const onClickEdit = () => {
    navigate("/create", { state: election });
  };

  // setVotePosition(vote!.votes)

  return (
    <div style={{ margin: "10px" }}>
      {showSuccessModal()}
      <Container>
        <div className="mb-2">
          <Button variant="outline-dark" onClick={goBack}>
            Back
          </Button>{" "}
          {currentUser.isAdmin ? (
            <Button
              variant="primary"
              onClick={onClickEdit}
              // disabled={election?.state === 1}
            >
              Edit
            </Button>
          ) : null}
        </div>
        {showErrorAlert()}
        {election && <ElectionDetail election={election}></ElectionDetail>}

        <h5> </h5>
        {positions.map((position) => (
          <div>
            <h5>{position.positionName}</h5>
            <p>{position.positionDesc}</p>
            {/* if past election, show the result chart */}
            {election?.state === 2 ? (
              <Container>
                <ResultChart></ResultChart>
              </Container>
            ) : null}
            <Container>
              <CandidateCard
                candidates={candidates.filter(
                  (candidate) => candidate.positionId === position.id
                )}
                votes={vote?.votes.filter(
                  (votePositionDetails) => votePositionDetails.position.id === position.id
                )}
                selectedID={position.selectedCandidate}
                electionStatus={election?.state}
                isCompleted={isElectionFinished}
              ></CandidateCard>
            </Container>
          </div>
        ))}
        <div className="text-center">
          {election?.state === 1 && (
            <Button
              disabled={
                !(
                  votePosition.length !== 0 &&
                  votePosition.length === positions.length
                )
              }
              onClick={onClickSubmit}
            >
              Submit
            </Button>
          )}
        </div>
      </Container>
    </div>
  );
}

export default ElectionDetailsPage;
