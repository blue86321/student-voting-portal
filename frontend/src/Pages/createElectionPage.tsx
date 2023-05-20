import CreateElection from "../component/admin/CreatElection";
import CreatePositions from "../component/admin/CreatePositions";
import CreateCandidates from "../component/admin/CreateCandidates";
import ProgressBar from 'react-bootstrap/ProgressBar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { useState} from 'react';


function CreateElectionPage({navigate}) {

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

                {/* TODO: every time click the button, add one "create position" component */}
                <Button variant="outline-primary"
                >+ Position</Button>
                <CreatePositions></CreatePositions>
                <div className="container d-flex justify-content-center">
                    <Button variant="primary" onClick={handleClick}
                    >Save</Button>
                </div>

                {/* TODO:  every time click the button, add one "create candidate" component */}
                <Button variant="outline-primary"
                >+ Candidates</Button>
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