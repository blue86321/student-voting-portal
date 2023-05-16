import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Candidates from '../Component/candidates'
import ElectionDetail from '../Component/electionDetail'

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
            </Container>
            
        </div>
    )

}

export default DetailsPage;