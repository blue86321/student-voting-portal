import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Row } from "react-bootstrap";
import EmptyCards from "../navigator/EmptyCards";
import comingImg from "../images/coming.png";
import mayImg from "../images/may.png";
import juneImg from "../images/june.png";
import pastImg from "../images/past.png";
import defaultImg from "../images/defaultImage.png";

function ElectionCard({ elections }) {
  const navigate = useNavigate();
  const onClickButton = (election) => {
    navigate(`/elections/${election.id}`, { state: election });
  };
  const getImagePath = (election) => {
    if (election.state === 0) {
      return comingImg;
    } else if (election.state === 1) {
      const month = election.endDate.getMonth() + 1;
      if (month === 5) {
        return mayImg;
      } else if (month === 6) {
        return juneImg;
      }
    } else if (election.state === 2) {
      return pastImg;
    }
    return defaultImg;
  };

  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {elections.length > 0 ? (
        elections.map((election) => (
          <Col key={election.id}>
            <Card key={election.id} style={{ width: "22rem" }}>
              <Card.Img variant="top" src={getImagePath(election)} />
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
                <Card.Text style={{ whiteSpace: 'pre-line' }}>
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
