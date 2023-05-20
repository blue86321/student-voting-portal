import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function CreateElection() {

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);


    // TODO: get this selected date to the backend
    const handleStartDate = (date) => {
        setStartDate(date);
    };

    const handleEndDate = (date) => {
        setEndDate(date);
    };

    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        setIsClicked(true);
    };

    // TODO: onclick handler

    return (
        <div style={{ margin: '20px' }}>
            <Container>
                {/* <ProgressBar now={33} /> */}
                <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Election Name</Form.Label>
                    <Form.Control type="email" placeholder="Election Name" />
                </Form.Group>

                <Row>
                    <Col>
                        <Form.Group controlId="formDate">
                            <Form.Label>Start Date</Form.Label>
                            <DatePicker
                            selected={startDate}
                            onChange={(date) => handleStartDate(date)}
                            className="form-control"
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formDate">
                            <Form.Label>End Date</Form.Label>
                            <DatePicker
                            selected={endDate}
                            onChange={(date) => handleEndDate(date)}
                            className="form-control"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Description</Form.Label>
                    <Form.Control  placeholder="Description" as="textarea" rows={3}/>
                </Form.Group>

                <div className="container d-flex justify-content-center">
                    <Button variant= 'primary' onClick={handleClick} disabled={isClicked}>{isClicked ? 'Saved' : 'Next'}</Button>
                </div>
                </Form>
            </Container>


        </div>
    )

}

export default CreateElection;