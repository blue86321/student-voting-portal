import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Candidates from "../component/elections/CandidateCard";
import ElectionDetail from "../component/elections/ElectionDetail";
import ResultChart from "../component/elections/ElectionResultChart";

function ElectionDetailsPage() {
  return (
    <div style={{ margin: "10px" }}>
      <Container>
        <Button //@ts-expect-error
          as={Link}
          variant="outline-dark"
          to={"/"}
        >
          {" "}
          Back{" "}
        </Button>
        <ElectionDetail></ElectionDetail>

        <h5> </h5>
        <h5>Position 1</h5>
        <Container>
          <Candidates></Candidates>
        </Container>
        {/* just for test chart component */}
        <Container>
          <ResultChart></ResultChart>
        </Container>
      </Container>
    </div>
  );
}

export default ElectionDetailsPage;
