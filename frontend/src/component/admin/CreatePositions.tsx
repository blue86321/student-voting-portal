import { Button, Form } from "react-bootstrap";
import { useState } from "react";

function PositionComponent({ id, onDelete }) {
  //   const handleDelete = () => {
  //     onDelete();
  //   };

  return (
    <div style={{ margin: "20px", padding: "10px" }}>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label> ({id}) Position Name</Form.Label>
          <Form.Control type="email" placeholder="Position Name" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Postition Description</Form.Label>
          <Form.Control placeholder="Description" as="textarea" rows={2} />
        </Form.Group>
        <div className="container d-flex justify-content-end">
          <Button variant="outline-danger" onClick={() => onDelete(id)}>
            Delete
          </Button>
        </div>
      </Form>
    </div>
  );
}
let positionCount = 1; // need to set at least 1 position

function CreatePositions() {
  const [positions, setPositions] = useState<React.ReactNode[]>([]);

  const handleAddPosition = () => {
    positionCount ++;
    console.log("[CreatePositions] add position:", positionCount);
    const newPosition = (
      <PositionComponent
        key={positions.length + 1} // Unique identifier
        id={positionCount}
        onDelete={handleDeletePosition} // Pass the delete handler
      />
    );
    // setPositions([...positions, newPosition]);
    setPositions((prevPositions) => [...prevPositions, newPosition])

  };

  const handleDeletePosition = (id) => {
    console.log("[CreatePositions] positions: " + positions.length);
    if (positions.length < 1) return;
    console.log("[CreatePositions] deleting position", id);
    setPositions((prevPositions) => {
      const updatedPositions = prevPositions.filter(
        (_, index) => {
            console.log("[CreatePositions] checking index", index + 1, '!==', id);
            return index + 1 !== id;
        }
      );
      return updatedPositions;
    });
  };

  return (
    <div>
      <PositionComponent key={0} id={1} onDelete={handleDeletePosition} />

      {positions.map((_, index) => (
        <PositionComponent
          key={index}
          id={index+2}
          onDelete={handleDeletePosition}
        />
      ))}

      <Button variant="outline-primary" onClick={handleAddPosition}>
        + Position
      </Button>
    </div>
  );
}

export default CreatePositions;
