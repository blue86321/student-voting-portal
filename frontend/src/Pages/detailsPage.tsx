import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Candidates from '../Component/candidates'
import ElectionDetail from '../Component/electionDetail'
import ResultChart from "../Component/resultChart";

function DetailsPage({navigate}) {

    return (
        <div style={{ margin: '10px' }}>

            <Container>
                <Button variant="outline-dark" onClick={()=>{navigate('/')}}> Back </Button>
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
    )

}

export default DetailsPage;