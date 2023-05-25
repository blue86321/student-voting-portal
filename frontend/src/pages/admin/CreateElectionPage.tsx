import { ProgressBar, Container, Button } from 'react-bootstrap';
import { useState} from 'react';

import CreateElection from "../../component/admin/CreatElection";
import CreatePositions from "../../component/admin/CreatePositions";
import CreateCandidates from "../../component/admin/CreateCandidates";

function CreateElectionPage() {

    let currentStep = 1;

    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        setIsClicked(true);
    };


    // TODO: Handle all the click events

    return (
        <div style={{ padding: '20px' }}>
            <Container>
                <Container className="mx-2">
                    <ProgressBar now={currentStep*33.33} />
                </Container>
                
                <CreateElection></CreateElection>

                
                <CreatePositions></CreatePositions>
                <div className="container d-flex justify-content-center">
                    <Button variant="primary" onClick={handleClick}
                    >Save</Button>
                </div>
                
                <CreateCandidates></CreateCandidates>

                <div className="container d-flex justify-content-center">
                    <Button variant="primary" onClick={handleClick}
                    >Submit</Button>
                </div>

            </Container>

        </div>
    
    )

}

export default CreateElectionPage;