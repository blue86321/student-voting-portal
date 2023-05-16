import { Container } from 'react-bootstrap';
import Navigation from '../Component/navigation';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Elections from '../Component/elections';

function Home({ navigate }) {
  
  return (

    <div>
    <Container>
      
        <Elections navigate={navigate}></Elections>
      
    </Container>
    </div>
  )
}

export default Home;