import { Container, Image } from "react-bootstrap";

function ElectionDetail({ election }) {
  return (
    <div className="text-center">
      <Container>
        <h2>{election?.election_name}</h2>
        <p>Deadline: {election?.end_time}</p>
        <Image
          src={require("../defaultImage.png")}
          style={{ width: "640px", height: "auto" }}
        />
        <p>Description: </p>
        <p>{election?.desc}</p>
      </Container>
    </div>
  );
}

export default ElectionDetail;
