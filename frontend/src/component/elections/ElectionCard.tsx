import React, { useEffect, useState, createContext } from "react";
import { Link } from "react-router-dom";
import { Card, Col, Row } from "react-bootstrap";
import EmptyCards from "../navigator/EmptyCards";

// export const ElectionContext = createContext<Election | null>(null);

function ElectionCard({ elections }) {
  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {elections.length > 0 ? (
        elections.map((variant) => (
          <Col key={variant.id}>
            <Card key={variant.id} style={{ width: "22rem" }}>
              <Card.Body>
                <Card.Title className="text-center">
                  {variant.election_name}
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted text-center">
                  Deadline: {variant.end_time}
                </Card.Subtitle>
                <Card.Img
                  variant="top"
                  src={require("../defaultImage.png")}
                  style={{ width: "320px", height: "auto" }}
                />
                <Card.Text className="card-text-multiline">
                  descriptions: <br />
                  {variant.desc}
                </Card.Text>

                <div className="text-center">
                  <Card.Link
                    as={Link}
                    to={`/elections/${variant.id}`}
                    state={variant}
                  >
                    {elections.state === 2 ? "View Result" : "View More"}
                  </Card.Link>
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
