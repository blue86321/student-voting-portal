import React, { useState, useEffect, useCallback } from "react";
import { Nav, Navbar, NavDropdown, Container, Alert } from "react-bootstrap";
import "./Header.css"

import logo from "../../logo.svg";
import Login from "../user/Login";
import Navigation from "./Navigation";
import { currentUser } from "../../model/User.model";
import myApi, { TOKEN } from "../../service/MyApi";
import { useNavigate } from "react-router-dom";
import Logger from "../utils/Logger";

function Header() {
  const navigate = useNavigate();

  const [loginModalShow, setLoginModalShow] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [error, setError] = useState("");
  const [alertType, setAlertType] = useState("danger");
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  const redirectToHome = useCallback(() => {
    navigate("/");
    Logger.debug("[Header] Reset navigate");
  }, [navigate])


  useEffect(() => {
    const loadUserType = async () => {
      Logger.debug("[Header] loadUserType");
      let token = localStorage.getItem(TOKEN);
      if (!token) {
        //no token: no user logged in
        Logger.debug("[Header] no token: no user logged in");
        setIsAdmin(false);
        // setShowError(false);
        // redirectToHome();
        return;
      }
      const user = await currentUser.getUser();
      Logger.debug("[Header] loaded user: ", user);
      setIsLoggedIn(currentUser.isLoggedIn())
      if (user.email !== "") {
        setIsAdmin(user.staff || user.superuser);
        setShowError(false);
      } else {
        setAlertType("danger");
        setError("Login expired!");
        setShowError(true);
        redirectToHome();
      }
    };
    loadUserType();
  }, [redirectToHome]);

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
    currentUser.removeUser();
    setIsLoggedIn(currentUser.isLoggedIn())
    if (result.msg) {
      Logger.error("[Header] Logout error:", result.msg);
    }
    redirectToHome();
    // window.location.reload();
    Logger.debug("[Header] Logout finished, set alert");
    setError("You have been logged out!");
    setAlertType("success");
    setShowError(true);
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
                {isLoggedIn || currentUser.isLoggedIn() ? (
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
