import React, { useEffect, useState, createContext } from "react";
import { Link } from "react-router-dom";
import { Card, Col, Row } from "react-bootstrap";
import classes from "./elections.module.css";

import { fetchElections } from "../../service/Api";
import Election from "../../model/Election.model";
import EmptyCards from "../navigator/EmptyCards";

// export const ElectionContext = createContext<Election | null>(null);

function ElectionCard( {elections} ) {
//   // TODO: elections from the backend.
//   const [data, setData] = useState<Election[]>([]);

//   useEffect(() => {
//     const fetchDataAsync = async () => {
//       try {
//         const result: Election[] = await fetchElections();
//         const instances = result.map((item) => new Election(item.id, item.url, item.election_name, item.desc, item.start_time, item.end_time))
//         setData(instances);
//         console.log("[Election card] data:", instances);
//       } catch (error) {
//         // Handle error
//       }
//     };

//     fetchDataAsync();
//   }, []);
// const desiredStatus = 1
//   const isRequired = (data.filter((election) => (election.state === desiredStatus))

  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {/* <ElectionContext.Provider value={data}> */}
        {elections ? (
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
                      View More
                    </Card.Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <EmptyCards />
        )}
      {/* </ElectionContext.Provider> */}
    </Row>
  );
}

export default ElectionCard;
