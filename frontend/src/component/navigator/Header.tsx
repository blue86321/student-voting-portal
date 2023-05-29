import React, { useState, useEffect } from "react";
import { Nav, Navbar, NavDropdown, Container, Alert } from "react-bootstrap";

import logo from "../../logo.svg";
import Login from "../user/Login";
import Navigation from "./Navigation";
import { currentUser } from "../../model/User.model";
import myApi from "../../service/MyApi";
import { useNavigate } from "react-router-dom";

function Header() {
  const [loginModalShow, setLoginModalShow] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [error, setError] = useState("");
  const [alertType, setAlertType] = useState("danger");
  const navigate = useNavigate();
  // TODO: connet to usertype and user status
  const isLoggedIn = currentUser.isLoggedIn();

  useEffect(() => {
    loadUserType();
  }, [isLoggedIn]);

  // Error alert
  const [showError, setShowError] = useState(false);

  const showErrorAlert = () => {
    if (showError) {
      return (
        <Alert
          variant={alertType}
          onClose={() => setShowError(false)}
          dismissible
        >
          {error}
        </Alert>
      );
    }
  };

  const logout = async () => {
    const result = await myApi.deleteLogin();
    console.log("[Header] Logout", result);
    currentUser.removeUser();
    if (!result.success) {
      console.log("[Header] Logout error:", result.msg);
    }
    setError("You have been logged out!");
    setAlertType("success");
    setShowError(true);
    console.log("[Header] Logout reset navigate");
    navigate("/");
  };

  const loadUserType = async () => {
    console.log("[Header] loadUserType");
    let token = localStorage.getItem("token");
    if (!token) {
      //no token: no user logged in
      console.log("[Header] no token: no user logged in");
      setIsAdmin(false);
      setShowError(false);
      console.log("[Header] loadUserType(no token) reset navigate");
      navigate("/");
      return;
    }
    const user = await currentUser.getUser();
    console.log("[Header] user: ", user);
    if (user.email !== "") {
      setIsAdmin(user.staff || user.superuser);
      setShowError(false);
    } else {
      setAlertType("danger");
      setError("Login expired!");
      setShowError(true);
      console.log("[Header] loadUserType reset navigate");
      navigate("/");
    }
  };

  return (
    <div>
      <Navbar expand="lg">
        <Container>
          <Navbar.Brand href="/">
            <img src={logo} alt="logo" />
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              <Nav.Link href="/">Elections</Nav.Link>
              <NavDropdown title="Account" id="basic-nav-dropdown">
                {isLoggedIn ? (
                  <>
                  <NavDropdown.Item disabled className="custom-disabled-item">{currentUser.email}</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logout}>Log Out</NavDropdown.Item>
                  </>
                ) : (
                  <NavDropdown.Item onClick={() => setLoginModalShow(true)}>
                    Log In
                  </NavDropdown.Item>
                )}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        {showErrorAlert()}
        <h1>Student Voting</h1>
      </Container>
      <Container>
        <Navigation isAdmin={isAdmin} />
      </Container>
      <Login show={loginModalShow} onHide={() => setLoginModalShow(false)} />
      {/* <main>
        {children}
      </main> */}
    </div>
  );
}

export default Header;
