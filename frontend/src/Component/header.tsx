import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../Logo.svg';
import Login from './login';
import Register from './register';
import Navigation from './navigation'

function Header({ children, isPending, navigate }) {
  const [loginModalShow, setLoginModalShow] = React.useState(false);
  const [registerModalShow, setRegisterModalShow] = React.useState(false);

  // TODO: connet to usertype and user status
  const currentUserType = 'user';

  return (
    <div>
    <Navbar expand="lg">
      <Container>
        <Navbar.Brand href="/">
        <img src={logo} alt="logo" />
        </Navbar.Brand>
        <Navbar.Toggle/>
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <Nav.Link href="#link">Elections</Nav.Link>
            <NavDropdown title="Account" id="basic-nav-dropdown">
              <NavDropdown.Item onClick={() => setLoginModalShow(true)}>Log In</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Log Out
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <Container>
      <h1>
          Student Voting
      </h1>
    </Container>
    <Container>
      <Navigation userType={currentUserType} navigate={(url)=>navigate(url)} />
    </Container>
      <Login
        show={loginModalShow}
        onHide={() => setLoginModalShow(false)} />
      {/* <Register
        show={registerModalShow}
        onHide={() => setRegisterModalShow(false)} /> */}
      <main>
        {children}
      </main>
    </div>
  );
}

export default Header;