import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';

function Navigation({userType}) {
    if (userType === 'admin') {
        return (
            <Container>
                <Nav variant="tabs" defaultActiveKey="/manage_elections">
                <Nav.Item>
                    <Nav.Link as={Link} to='/manage_elections' eventKey='/manage_elections'>Manage Elections</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to='/create_new_elections' eventKey='/create_new_elections'>Create New Elections</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to='/manage_users' eventKey='/manage_users'>Manage Users</Nav.Link>
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
                    <Nav.Link eventKey="/" as={Link} to='/'>On-going Elections</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="/past_elections" as={Link} to='/past_elections'>Past Elections</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="/upcoming_elections" as={Link} to='/upcoming_elections'>Upcoming Elections</Nav.Link>
                </Nav.Item>
                {/* check the log in status */}
                <Nav.Item>
                    <Nav.Link eventKey="/your_votes" as={Link} to='/your_votes'>Your Votes</Nav.Link>
                </Nav.Item>
                </Nav>
            </Container>
        );
    }
    
}

export default Navigation;