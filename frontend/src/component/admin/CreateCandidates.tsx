import { Container, Form, Row, Col, Button } from "react-bootstrap";
import React, { useState } from "react";

function CreateCandidates() {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
  };

  return (
    <div style={{ margin: "20px", padding: "10px" }}>
      {/* <ProgressBar now={33} /> */}
      <Form>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Candidate Name</Form.Label>
              <Form.Control type="email" placeholder="Candidate Name" />
            </Form.Group>
          </Col>

          <Col>
            {/* TODO: connet to the position component */}
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Select a Position</Form.Label>
              <Form.Select aria-label="Default select example">
                <option value="Position 1">Position 1</option>
                <option value="Position 2">Position 2</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Candidate Introduction</Form.Label>
          <Form.Control placeholder="Introduction" as="textarea" rows={2} />
        </Form.Group>

        <Button variant="outline-secondary">+ Upload Photo</Button>
        <div className="container d-flex justify-content-end">
          <Button variant="outline-danger" onClick={handleClick}>
            Delete
          </Button>
        </div>
      </Form>

      {/* TODO:  every time click the button, add one "create candidate" component */}
      <Button variant="outline-primary">+ Candidates</Button>
    </div>
  );
}

export default CreateCandidates;
