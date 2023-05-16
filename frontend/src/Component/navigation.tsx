import { Container } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';

function Navigation({userType, navigate}) {
    if (userType === 'admin') {
        return (
            <Container>
                <Nav variant="tabs" defaultActiveKey="/manage_elections">
                <Nav.Item>
                    <Nav.Link onClick={()=>{navigate('/manage_elections')}}>Manage Elections</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/create">Create New Elections</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/manage_users">Manage Users</Nav.Link>
                </Nav.Item>
                </Nav>
            </Container>

        );
    } else {    // to be updated: log in status
        console.log('render user');
        return (
            <Container>
                <Nav variant="tabs" defaultActiveKey="/">
                <Nav.Item>
                    <Nav.Link eventKey="/" onClick={()=>{navigate('/')}}>On-going Elections</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="/past_elections" onClick={()=>{navigate('/past_elections')}}>Past Elections</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="/upcoming_elections" onClick={()=>{navigate('/upcoming_elections')}}>Upcoming Elections</Nav.Link>
                </Nav.Item>
                {/* check the log in status */}
                <Nav.Item>
                    <Nav.Link eventKey="/your_votes" onClick={()=>{navigate('/your_votes')}}>Your Votes</Nav.Link>
                </Nav.Item>
                </Nav>
            </Container>
        );
    }
    
}

export default Navigation;