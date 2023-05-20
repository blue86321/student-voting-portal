import Container from 'react-bootstrap/Container';
import { Image } from 'react-bootstrap';
import { useParams } from "react-router-dom";

function ElectionDetail() {
    let { electionID } = useParams();
    // let election = getElectionById(electionID);
    console.log('[ElectionDetail]', electionID);
    return (
        <div className='text-center'>
            <Container>
                <h2>Election Name</h2>
                <p>Deadline: MM/DD/YYYY</p>
                <Image src={require("../defaultImage.png")} style={{ width: '640px', height: 'auto' }}/>
                <p>Description: </p>
                <p>xxx</p>
                <p>xxx</p>

            </Container>
        </div>
    )

}

export default ElectionDetail;