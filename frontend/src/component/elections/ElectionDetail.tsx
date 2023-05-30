import { Container } from "react-bootstrap";

function ElectionDetail({ election }) {
  return (
    <div className="text-center">
      <Container>
        <h2>{election.electionName}</h2>
        <p>
          {election.state === 0
            ? `Start on: ${election.startTime}`
            : election.state === 1
            ? `Deadline: ${election.endTime}`
            : `Finished on: ${election.endTime}`}
        </p>
        {/* <Image
          src={require("../defaultImage.png")}
          style={{ width: "640px", height: "auto" }}
        /> */}
        {/* <p>Description: </p> */}
        <p>{election.electionDesc}</p>
      </Container>
    </div>
  );
}

export default ElectionDetail;
