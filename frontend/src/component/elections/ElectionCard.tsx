import React, { useEffect, useState, createContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Col, Row } from "react-bootstrap";
import EmptyCards from "../navigator/EmptyCards";
import Election from "../../model/Election.model";

// export const ElectionContext = createContext<Election | null>(null);

function ElectionCard({ elections }) {
  const navigate = useNavigate();
  const onClickButton = (election) => {
    navigate(`/elections/${election.id}`, { state: election });
  };
  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {elections.length > 0 ? (
        elections.map((election) => (
          <Col key={election.id}>
            <Card key={election.id} style={{ width: "22rem" }}>
              <Card.Body>
                <Card.Title className="text-center">
                  {election.electionName}
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted text-center">
                  {election.state === 0
                    ? `Start on: ${election.startTime}`
                    : election.state === 1
                    ? `Deadline: ${election.endTime}`
                    : `Finished on: ${election.endTime}`}
                </Card.Subtitle>
              </Card.Body>
              <Card.Img
                variant="top"
                src={require("../defaultImage.png")}
                // style={{ width: "320px", height: "auto" }}
              />
              <Card.Body>
                <Card.Text className="card-text-multiline">
                  {/* descriptions: <br /> */}
                  {election.electionDesc}
                </Card.Text>

                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={() => onClickButton(election)}
                  >
                    {election.state === 2 ? "View Result" : "View More"}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))
      ) : (
        <EmptyCards />
      )}
    </Row>
  );
}

export default ElectionCard;
