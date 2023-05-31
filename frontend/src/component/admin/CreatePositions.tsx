import { Alert, Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Position, PositionDetail } from "../../model/Interfaces/Election";
import myApi from "../../service/MyApi";
import Logger from "../utils/Logger";

function PositionComponent({ index, position, onDelete, updatePosition }) {
  const [positionName, setPositionName] = useState(position.positionName);
  const [positionDesc, setPositionDesc] = useState(position.positionDesc);
  const [shouldShowSave, setShouldShowSave] = useState(false);
  const [saveButtonText, setSaveButtonText] = useState("Save");

  useEffect(() => {
    setPositionName(position.positionName);
    setPositionDesc(position.positionDesc);
  }, [position]);

  const handleOnChangeName = (name) => {
    setPositionName(name);
    position.positionName = name;
    handleOnChange();
  };
  const handleOnChangeDesc = (desc) => {
    setPositionDesc(desc);
    position.positionDesc = desc;
    handleOnChange();
  };
  const handleOnChange = () => {
    updatePosition(index, position);
    setShouldShowSave(true);
    setSaveButtonText("Save");
  };

  const onSave = async (index) => {
    const positionData: Position = {
      electionId: Number(position.electionId),
      positionName: positionName,
      positionDesc: positionDesc,
      maxVotesTotal: 9,
      maxVotesPerCandidate: 9,
    };
    const isCreate = position.id === 0;
    Logger.debug("[CreatePosition] creating position", positionData);
    const result = isCreate
      ? await myApi.createPosition(positionData)
      : await myApi.updatePosition({
          positionData: positionData,
          positionId: position.id,
        });
    if (result.success) {
      position.id = (result.data as PositionDetail).id;
      updatePosition(index, position);
      // setShouldShowSave(false);
      setSaveButtonText("Saved");
    } else {
      Logger.error("[CreatePosition] Error creating position", result.msg);
    }
  };

  const onDeleteClicked = async (index) => {
    if (position.id === 0) {
      // local change only
      onDelete(index);
    } else {
      // delete position from server
      const result = await myApi.deletePosition(position.id);
      if (!result.success) {
        Logger.debug(
          "[CreatePosition] Error deleting position id",
          position.id,
          "with error:",
          result.msg
        );
      }
      onDelete(index);
    }
  };

  return (
    <div>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label> ({index + 1}) Position Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Position Name"
            value={positionName}
            onChange={(event) => handleOnChangeName(event.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Postition Description</Form.Label>
          <Form.Control
            placeholder="Description"
            as="textarea"
            value={positionDesc}
            onChange={(event) => handleOnChangeDesc(event.target.value)}
            rows={2}
          />
        </Form.Group>
        <div className="container d-flex justify-content-end">
          {shouldShowSave && (
            <Button variant="primary" disabled={saveButtonText==="Saved"} onClick={() => onSave(index)}>
              {saveButtonText}
            </Button>
          )}
          <div style={{ width: "8px" }}></div>
          <Button
            variant="outline-danger"
            onClick={() => onDeleteClicked(index)}
          >
            Delete
          </Button>
        </div>
      </Form>
    </div>
  );
}
// let positionCount = 1; // need to set at least 1 position

function CreatePositions({ electionID, prePositions, onNext }) {
  const [positions, setPositions] = useState<PositionDetail[]>(prePositions??[]);
  const updatePosition = (index, position) => {
    Logger.debug(
      "[CreatePositions] update position: ",
      position,
      " for index",
      index
    );
    Logger.debug("[CreatePositions] update position result:", positions.map((p, i) => i === index ? position : p));
  };

  const handleAddPosition = () => {
    const newPos: PositionDetail = {
      electionId: electionID,
      positionName: "",
      positionDesc: "",
      maxVotesTotal: 0,
      maxVotesPerCandidate: 0,
      totalVoteCount: 0,
      id: 0,
      candidates: [],
    };
    Logger.debug("[CreatePositions] handleAddPosition: ", newPos);
    setPositions([...positions, newPos]);
  };

  if (positions.length === 0) {
    handleAddPosition();
    Logger.debug("[CreatePositions] initial positions", positions);
  }

  const handleDeletePosition = (id) => {
    Logger.debug("[CreatePositions] before delete: ", positions);
    if (positions.length < 1) return;
    setPositions((prevPositions) => {
      const updatedPositions = prevPositions.filter((_, index) => {
        return index !== id;
      });
      Logger.debug("[CreatePositions] after delete: ", updatedPositions);
      return updatedPositions;
    });
  };

  // Error alert
  const [showError, setShowError] = useState(false);

  const showErrorAlert = () => {
    if (showError) {
      return (
        <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
          "Please save all positions before proceed"
        </Alert>
      );
    }
  };

  const handleNext = () => {
    let allPositionsSaved = true;
    positions.forEach((pos) => {
      if (pos.id === 0) allPositionsSaved = false;
      return;
    });
    if (allPositionsSaved) {
      setShowError(false);
      onNext(positions);
    } else {
      setShowError(true);
    }
  };

  return (
    <>
      <div style={{ margin: "20px" }}>
        {positions.map((pos, index) => (
          <PositionComponent
            key={index}
            index={index}
            position={pos}
            onDelete={handleDeletePosition} // Pass the delete handler
            updatePosition={updatePosition}
          />
        ))}

        <Button variant="outline-primary" onClick={handleAddPosition}>
          + Position
        </Button>
      </div>
      {showErrorAlert()}
      <div className="container d-flex justify-content-center">
        <Button variant="primary" onClick={handleNext}>
          Next
        </Button>
      </div>
    </>
  );
}

export default CreatePositions;
