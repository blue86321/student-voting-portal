import Button from 'react-bootstrap/Button';
import { useState} from 'react';
import Form from 'react-bootstrap/Form';



function CreatePositions() {

    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        setIsClicked(true);
    };


    return (
        <div style={{ margin: '20px', padding: '10px' }}>

            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label> ({ 1 }) Position Name</Form.Label>
                    <Form.Control type="email" placeholder="Position Name" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Postition Description</Form.Label>
                    <Form.Control  placeholder="Description" as="textarea" rows={2}/>
                </Form.Group>

                <div className="container d-flex justify-content-end">
                    <Button variant= 'outline-danger' onClick={handleClick}> Delete</Button>
                    
                </div>
 
            </Form>

        </div>
    )

}

export default CreatePositions;