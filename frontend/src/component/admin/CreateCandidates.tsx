import { Form, Row, Col, Button, Alert } from "react-bootstrap";
import { useEffect, useState } from "react";
import {
  Candidate,
  CandidateDetail,
} from "../../model/Interfaces/Election";
import myApi from "../../service/MyApi";
import Logger from "../utils/Logger";

function CandidateComponent({
  index,
  candidate,
  positions,
  onDelete,
  updateCandidate,
}) {
  const [candidateName, setCandidateName] = useState(candidate.candidateName);
  const [candidateDesc, setCandidateDesc] = useState(candidate.candidateDesc);
  const [candidateImg, setCandidateImg] = useState(candidate.photoUrl);
  const [candidatePosition, setCandidatePosition] = useState(
    candidate.positionId
  );
  const [shouldShowSave, setShouldShowSave] = useState(false);
  const [saveButtonText, setSaveButtonText] = useState("Save");

  useEffect(() => {
    Logger.debug("[CreateCandidate] candidate updated:", candidate);
    setCandidateName(candidate.candidateName);
    setCandidateDesc(candidate.candidateDesc);
    setCandidateImg(candidate.photoUrl);
    setCandidatePosition(candidate.positionId);
  }, [candidate]);

  const handleOnChangeName = (name) => {
    setCandidateName(name);
    candidate.candidateName = name;
    handleOnChange();
  };
  const handleOnChangeDesc = (desc) => {
    setCandidateDesc(desc);
    candidate.candidateDesc = desc;
    handleOnChange();
  };
  const handleOnChangeImg = (url) => {
    setCandidateImg(url);
    candidate.photoUrl = url;
    handleOnChange();
  };
  const handleOnChangePositionID = (id) => {
    Logger.debug("[CreateCandidates] position ID: " + id);
    setCandidatePosition(id);
    candidate.positionId = id;
    handleOnChange();
  };
  const handleOnChange = () => {
    updateCandidate(index, candidate);
    setShouldShowSave(true);
    setSaveButtonText("Save");
  };

  const onSave = async (index) => {
    const position =
      candidatePosition === 0
        ? positions[0]
        : positions.filter((position) => {
          // eslint-disable-next-line
            return position.id == candidatePosition;
          })[0];
    Logger.debug("[CreateCandidates] onSave position:", position, candidatePosition);
    const candidateData: Candidate = {
      electionId: position.electionId,
      positionId: position.id,
      candidateName: candidateName,
      candidateDesc: candidateDesc,
      photoUrl: candidateImg,
    };
    Logger.debug("[CreateCandidates] create", candidateData);
    const isCreate = candidate.id === 0;
    const result = isCreate
      ? await myApi.createCandidate(candidateData)
      : await myApi.updateCandidate({
          candidateData: candidateData,
          candidateId: candidate.id,
        });
    if (result.success) {
      candidate.id = (result.data as CandidateDetail).id;
      updateCandidate(index, candidate);
      setSaveButtonText("Saved");
    } else {
      Logger.error("[CreateCandidates] Error creating position", result.msg);
    }
  };

  const onDeleteClicked = async (index) => {
    if (candidate.id === 0) {
      // local change only
      onDelete(index);
    } else {
      // delete position from server
      const result = await myApi.deleteCandidate(candidate.id);
      if (result.msg) {
        Logger.error(
          "[CreateCandidates] Error deleting candidate id",
          candidate.id,
          "with error:",
          result
        );
      }
      onDelete(index);
    }
  };

  return (
    <Form>
      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="candidateName">
            <Form.Label>Candidate Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Candidate Name"
              value={candidateName}
              onChange={(event) => handleOnChangeName(event.target.value)}
            />
          </Form.Group>
        </Col>

        <Col>
          <Form.Group className="mb-3" controlId="positionID">
            <Form.Label>Select a Position</Form.Label>
            <Form.Select
              aria-label="Default select example"
              value={candidatePosition}
              onChange={(event) => handleOnChangePositionID(event.target.value)}
            >
              {positions.map((position, index) => {
                return (
                  <option key={index} value={position.id}>
                    {position.positionName}
                  </option>
                );
              })}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3" controlId="candidateDesc">
        <Form.Label>Candidate Introduction</Form.Label>
        <Form.Control
          placeholder="Introduction"
          as="textarea"
          rows={2}
          value={candidateDesc}
          onChange={(event) => handleOnChangeDesc(event.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="candidateImg">
        <Form.Label>Candidate Image</Form.Label>
        <Form.Control
          placeholder="Candidate Image"
          type="text"
          value={candidateImg}
          onChange={(event) => handleOnChangeImg(event.target.value)}
        />
      </Form.Group>

      <div className="container d-flex justify-content-end">
        {shouldShowSave && (
          <Button
            variant="primary"
            disabled={saveButtonText === "Saved"}
            onClick={() => onSave(index)}
          >
            {saveButtonText}
          </Button>
        )}
        <div style={{ width: "8px" }}></div>
        <Button variant="outline-danger" onClick={() => onDeleteClicked(index)}>
          Delete
        </Button>
      </div>
    </Form>
  );
}

function CreateCandidates({ electionID, positions, onNext }) {
  const [candidates, setCandidates] = useState<CandidateDetail[]>(() => {
    let candidates: CandidateDetail[] = [];
    positions.forEach((position) => {
      const cs: CandidateDetail[] = position.candidates;
      candidates.push(...cs);
    });
    return candidates;
  });
  const updateCandidate = (index, candidate) => {
    Logger.debug(
      "[CreateCandidates] update position: ",
      candidate,
      " for index",
      index
    );
    Logger.debug("[CreateCandidates] update candidates result:", candidates.map((c, i) => i === index ? candidate : c));
  };

  const handleAddCandidate = () => {
    const newCan: CandidateDetail = {
      electionId: electionID,
      id: 0,
      positionId: 0,
      voteCount: 0,
      candidateName: "",
      candidateDesc: "",
      photoUrl: "",
    };
    setCandidates([...candidates, newCan]);
  };

  if (candidates.length === 0) {
    handleAddCandidate();
    Logger.debug("[CreateCandidates] initial candidates", candidates);
  }

  const handleDeleteCandidate = (id) => {
    Logger.debug("[CreateCandidates] before delete: ", candidates);
    if (candidates.length < 1) return;
    setCandidates((prevCandidates) => {
      const updatedCandidates = prevCandidates.filter((_, index) => {
        return index !== id;
      });
      Logger.debug("[CreateCandidates] after delete: ", updatedCandidates);
      return updatedCandidates;
    });
  };

  // Error alert
  const [showError, setShowError] = useState(false);

  const showErrorAlert = () => {
    if (showError) {
      return (
        <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
          "Please save all candidates before proceed"
        </Alert>
      );
    }
  };

  const handleSubmit = () => {
    let allCandidatesSaved = true;
    candidates.forEach((can) => {
      if (can.id === 0) allCandidatesSaved = false;
      return;
    });
    if (allCandidatesSaved) {
      setShowError(false);
      onNext(candidates);
    } else {
      setShowError(true);
    }
  };

  return (
    <>
      <div style={{ margin: "20px", padding: "10px" }}>
        {/* <ProgressBar now={33} /> */}
        {candidates.map((candidate, index) => (
          <CandidateComponent
            key={index}
            index={index}
            candidate={candidate}
            positions={positions}
            onDelete={handleDeleteCandidate}
            updateCandidate={updateCandidate}
          ></CandidateComponent>
        ))}

        {/* TODO:  every time click the button, add one "create candidate" component */}
        <Button variant="outline-primary" onClick={handleAddCandidate}>
          + Candidates
        </Button>
      </div>
      {showErrorAlert()}

      <div className="container d-flex justify-content-center">
        <Button variant="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </>
  );
}

export default CreateCandidates;
