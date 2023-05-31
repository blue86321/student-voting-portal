import { Container, Button, Alert, Modal } from "react-bootstrap";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CandidateCard from "../../component/elections/CandidateCard";
import ElectionDetail from "../../component/elections/ElectionDetail";
import ResultChart from "../../component/elections/ElectionResultChart";

import Election, { ElectionState } from "../../model/Election.model";
import myApi from "../../service/MyApi";
import {
  Vote,
  VotePosition,
  VoteCandidate,
} from "../../model/Interfaces/Election";
import { currentUser } from "../../model/User.model";
import { PositionVote } from "../../model/Position.model";
import DeleteModal from "../../component/utils/DeleteModal";
import Logger from "../../component/utils/Logger";

function ElectionDetailsPage() {
  const location = useLocation();
  const election: Election | null = useMemo(() => {
    return location.state
      ? new Election(location.state)
      : null;
  }, [location.state])

  const [positions, setPositions] = useState<PositionVote[]>([]);
  // votePosition for submit vote
  const [votePosition, setVotePosition] = useState<VotePosition[]>([]);



  const isElectionFinished = (candidateID, positionID) => {
    Logger.debug(
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
      Logger.debug("[ElectionDetailsPage] update vote position", positions);
      return positions;
    });
    setPositions((positions) => {
      const updatedPositions: PositionVote[] = positions.map((p) => {
        if (p.id === positionID) {
          p.selectedCandidate = candidateID;
        }
        return p;
      });
      Logger.debug("[ElectionDetailsPage] update positions", updatedPositions);
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
      Logger.debug("[ElectionDetailsPage] Successfully created vote", result);
      showModalWithMessage("Vote Success", "Thank you for your perticiption!");
    } else {
      Logger.error("[ElectionDetailsPage] Failed to create vote", result);
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
    const fetchDataAsync = async () => {
      const positionResult = await myApi.getPositions();
      if (positionResult.success) {
        const positions = (positionResult.data as PositionVote[]).filter(
          (position) => position.electionId === election?.id
        );
        setPositions(positions);
        Logger.debug("[ElectionDetailsPage] position data:", positions);
      } else {
        // Handle error
        Logger.error("[ElectionDetailsPage] position data error:", positionResult);
      }
    };
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
  }, [election]);

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  const onClickEdit = () => {
    navigate("/create", { state: election });
  };
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const onClickDelete = async () => {
    if (election) {
      const result = await myApi.deleteElection(String(election.id))
      if (!result.success) {
        Logger.debug(
          "[ElectionDetailsPage] Error deleting election",
          election.id,
          "with error:",
          result.msg
        );
      }
      navigate(-1)
    }
  };

  return (
    <div style={{ margin: "10px" }}>
      {showSuccessModal()}
      <Container>
        <div className="mb-4">
          <Container className="d-flex justify-content-between">
            <div>
              <Button variant="outline-secondary" onClick={goBack}>
                Back
              </Button>{" "}
              {currentUser.isAdmin ? (
                <Button
                  variant="primary"
                  className="ml-2"
                  onClick={onClickEdit}
                >
                  Edit
                </Button>
              ) : null}
            </div>
            {currentUser.isAdmin && (
              <Button
                variant="danger"
                className="ml-auto"
                onClick={() => setShowDeleteModal(true)}
                disabled={election?.state !== ElectionState.upComing && election?.isDataCompleted}
              >
                Delete
              </Button>
            )}
            <DeleteModal
              target={election}
              targetName={election?.electionName}
              shouldShow={showDeleteModal}
              deleteFunc={onClickDelete}
              closeModal={() => setShowDeleteModal(false)}
            />
          </Container>
        </div>
        {showErrorAlert()}
        {election && <ElectionDetail election={election}></ElectionDetail>}

        <h5> </h5>
        {positions.map((position) => (
          <div>
            <h5>{position.positionName}</h5>
            <p>{position.positionDesc}</p>
            {/* if past election, show the result chart */}
            {(election?.state === 2 && election?.isDataCompleted) ? (
              <Container>
                <ResultChart
                  position={position}
                ></ResultChart>
              </Container>
            ) : null}
            <Container>
              <CandidateCard
                position={position}
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
