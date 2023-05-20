import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import React, { useState } from 'react';

function Candidates() {
    
    /* TODO: debug for card key;
    count add 1 after click the 'VOTE' button; 
    set them into position groups, currently, if clicked one "VOTE" in one of these cards, all the buttons will be disabled;
    update the electionStatus with the backend data.
    */

    let voteCount = 0;
    let electionStatus = 'onGoing';

    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        setIsClicked(true);
        voteCount ++;
        console.log(voteCount);
    };

    // If the elections is "past", then show the total vote count instead of the "vote" button
    let buttonContent;

    if (electionStatus === 'onGoing') {
        buttonContent = (
            <Button variant= 'primary' onClick={handleClick} disabled={isClicked}>{isClicked ? 'VOTED' : 'VOTE'}</Button>
        )            
    } else if (electionStatus === 'past') {
        buttonContent = (
            <Button variant="secondary" size="lg" disabled>{voteCount}</Button>
        )
    } else {    // if future elections or any other status/default, show nothing
        buttonContent = ('')
    }


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
                        {buttonContent}
                    </div> 
                       
                </Card.Body>
            </Card>
        </div>
        ))}
        </>
    )

}

export default Candidates;