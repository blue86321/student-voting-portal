import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import classes from './elections.module.css';

function Elections({navigate}) {
    // TODO: elections from the backend.

    return (
        <>
        {[
            'Election1',
            'Election2',
            'Election3',
        ].map((variant) => (
            <div style={{ margin: '10px', padding: '20px' }}>
            <Card key={variant}
                  style={{ width: '22rem' }}>
                <Card.Body>
                    <Card.Title className="text-center">{variant}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted text-center">Deadline: MM/DD/YYYY</Card.Subtitle>
                    <Card.Img variant="top" src={require("./defaultImage.png")} style={{ width: '320px', height: 'auto' }}/>
                    <Card.Text className="card-text-multiline">
                    descriptions: <br/>
                    xxx <br/>
                    xxx <br/>
                    </Card.Text>
                    {/* TODO: link to the detail page. */}
                    <div className="text-center">
                        <Card.Link onClick={()=>{navigate('/'+variant)}}>View More</Card.Link> 
                    </div>
                </Card.Body>
            </Card>
        </div>
        ))}
        </>
  );
}

export default Elections;