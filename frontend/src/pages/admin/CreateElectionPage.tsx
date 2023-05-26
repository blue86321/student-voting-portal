import { ProgressBar, Container, Button } from "react-bootstrap";
import { useState } from "react";

import CreateElection from "../../component/admin/CreatElection";
import CreatePositions from "../../component/admin/CreatePositions";
import CreateCandidates from "../../component/admin/CreateCandidates";

function CreateElectionPage() {
  const [progress, setProgress] = useState(0);
  const handleNext = (value) => {
    setProgress(value);
  };

  const [isClicked, setIsClicked] = useState(false);

  const handleSave = () => {
    setProgress(66.67);
    setIsClicked(true);
  };

  const handleSubmit = () => {
    setIsClicked(true);
  };

  // TODO: Handle all the click events

  return (
    <div style={{ padding: "20px" }}>
      <Container>
        <Container className="mx-2">
          <ProgressBar now={progress} label={`${progress}%`} />
        </Container>

        {progress >= 0 && <CreateElection onNext={handleNext}></CreateElection>}

        {progress >= 33.33 && (
          <>
            <CreatePositions></CreatePositions>
            <div className="container d-flex justify-content-center">
              <Button variant="primary" onClick={handleSave}>
                Save
              </Button>
            </div>
          </>
        )}

        {progress >= 66.67 && (
          <>
            <CreateCandidates></CreateCandidates>

            <div className="container d-flex justify-content-center">
              <Button variant="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </>
        )}
      </Container>
    </div>
  );
}

export default CreateElectionPage;
