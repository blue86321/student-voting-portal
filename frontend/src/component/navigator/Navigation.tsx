import { Container, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import Logger from "../utils/Logger";

function Navigation({ isAdmin }) {
  let activeKey = "/"
  const location = useLocation()
  activeKey = location.pathname

  if (isAdmin) {
    Logger.debug("[Navigation] render admin", activeKey);
    return (
      <Container>
        <Nav
          activeKey={activeKey}
          variant="tabs"
          defaultActiveKey="/"
        >
          <Nav.Item>
            <Nav.Link as={Link} to="/" eventKey="/">
              Manage Elections
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/create" eventKey="/create">
              Create New Elections
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/manage_users" eventKey="/manage_users">
              Manage Users
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Container>
    );
  } else {
    // to be updated: log in status
    Logger.debug("[Navigation] render user", activeKey);
    return (
      <Container>
        <Nav
          activeKey={activeKey}
          variant="tabs"
          defaultActiveKey="/"
        >
          <Nav.Item>
            <Nav.Link eventKey="/" as={Link} to="/">
              On-going Elections
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="/past_elections" as={Link} to="/past_elections">
              Past Elections
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="/upcoming_elections"
              as={Link}
              to="/upcoming_elections"
            >
              Upcoming Elections
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Container>
    );
  }
}

export default Navigation;
