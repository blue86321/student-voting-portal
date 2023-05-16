import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function Candidates() {
    // TODO: card key

    return (
        <>
        {[
            'Candidate1',
            'Candidate2',
            'Candidate3',
        ].map((variant) => (
            <div style={{ margin: '10px', padding: '20px' }}>
            <Card key={variant}
                  style={{ width: '22rem' }}>
                
                <Card.Body>
                    
                    <Card.Title className="text-center">{variant}</Card.Title>
                    <Card.Img variant="top" src={require("./defaultImage.png")} style={{ width: '320px', height: 'auto' }}/>
                    <Card.Text className="card-text-multiline">
                    Introduction: <br/>
                    xxx <br/>
                    xxx <br/>
                    </Card.Text>
                    {/* TODO: to vote the candidate, add 1 for total votes. */}
                    <div className="text-center">
                        <Button  variant="primary">VOTE</Button> 
                    </div>
                       
                </Card.Body>
            </Card>
        </div>
        ))}
        </>
    )

}

export default Candidates;