import { Container, Form, Row, Col, Button, Alert } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { Candidate, CandidateDetail } from "../../Interfaces/Election";
import myApi from "../../service/MyApi";
import { currentUser } from "../../model/User.model";

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

  useEffect(() => {
    console.log("[CreateCandidate] candidate updated:", candidate);
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
    console.log("[CreateCandidates] position ID: " + id);
    setCandidatePosition(id);
    candidate.positionId = id;
    handleOnChange();
  };
  const handleOnChange = () => {
    updateCandidate(index, candidate);
    setShouldShowSave(true);
  };

  const onSave = async (index) => {
    const position = positions.filter((position) => position.id == candidatePosition)[0]
    const candidateData: Candidate = {
      userId: currentUser.id,
      electionId: position.electionId,
      positionId: position.id,
      candidateName: candidateName,
      candidateDesc: candidateDesc,
      photoUrl: candidateImg
    };
    console.log("[CreateCandidates] create", candidateData);
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
      setShouldShowSave(false);
    } else {
      console.log("[CreateCandidates] Error creating position", result.msg);
    }
  };

  const onDeleteClicked = async (index) => {
    if (candidate.id === -1) {
      // local change only
      onDelete(index);
    } else {
      // delete position from server
      const result = await myApi.deletePosition(candidate.id);
      if (!result.success) {
        console.log(
          "[CreateCandidates] Error deleting position id",
          candidate.id,
          "with error:",
          result.msg
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
          {/* TODO: connet to the position component */}
          <Form.Group className="mb-3" controlId="positionID">
            <Form.Label>Select a Position</Form.Label>
            <Form.Select aria-label="Default select example"
              value={candidatePosition}
              onChange={(event) => handleOnChangePositionID(event.target.value)}>
              {positions.map((position, index) => (
                <option key={index} value={position.id}>{position.positionName}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3" controlId="candidateDesc">
        <Form.Label>Candidate Introduction</Form.Label>
        <Form.Control placeholder="Introduction" as="textarea" rows={2} 
              value={candidateDesc}
              onChange={(event) => handleOnChangeDesc(event.target.value)}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="candidateImg">
        <Form.Label>Candidate Image</Form.Label>
        <Form.Control placeholder="Candidate Image" type="text" 
              value={candidateImg}
              onChange={(event) => handleOnChangeImg(event.target.value)}/>
      </Form.Group>

      {/* <Button variant="outline-secondary">+ Upload Photo</Button> */}
      <div className="container d-flex justify-content-end">
          {shouldShowSave && (
            <Button variant="primary" onClick={() => onSave(index)}>
              Save
            </Button>
          )}
          <div style={{ width: "8px" }}></div>
        <Button variant="outline-danger" onClick={onDeleteClicked}>
          Delete
        </Button>
      </div>
    </Form>
  );
}

function CreateCandidates({ electionID, positions, onNext }) {
  const [candidates, setCandidates] = useState<CandidateDetail[]>([]);
  const updateCandidate = (index, candidate) => {
    console.log(
      "[CreateCandidates] update position: ",
      candidate,
      " for index",
      index
    );
    candidates.map((c, i) => {
      if (i === index) {
        c = candidate;
      }
    });
    console.log("[CreateCandidates] update candidates result:", candidates);
  };
  useEffect(() => {
    console.log("[CreateCandidates] candidates updated: ", candidates);
  }, [candidates]);

  const handleAddCandidate = () => {
    const newCan: CandidateDetail = {
      electionId: electionID,
      id: 0,
      positionId: 0,
      userId: 0,
      voteCount: 0,
      candidateName: "",
      candidateDesc: "",
      photoUrl: "",
    };
    setCandidates([...candidates, newCan]);
  };

  if (candidates.length === 0) {
    handleAddCandidate();
    console.log("[CreateCandidates] current candidates", candidates);
  }

  const handleDeleteCandidate = (id) => {
    console.log("[CreateCandidates] before delete: ", positions);
    if (positions.length < 1) return;
    console.log("[CreateCandidates] deleting position", id);
    setCandidates((prevCandidates) => {
      const updatedCandidates = prevCandidates.filter((_, index) => {
        console.log("[CreateCandidates] checking index", index, "!==", id);
        return index !== id;
      });
      console.log("[CreateCandidates] after delete: ", updatedCandidates);
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
        <Button variant="outline-primary">+ Candidates</Button>
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
