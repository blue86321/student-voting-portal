import Container from 'react-bootstrap/Container';
import { Image } from 'react-bootstrap';


function ElectionDetail() {
    
    return (
        <div className='text-center'>
            <Container>
                <h2>Election Name</h2>
                <p>Deadline: MM/DD/YYYY</p>
                <Image src={require("./defaultImage.png")} style={{ width: '640px', height: 'auto' }}/>
                <p>Description: </p>
                <p>xxx</p>
                <p>xxx</p>

            </Container>
        </div>
    )

}

export default ElectionDetail;