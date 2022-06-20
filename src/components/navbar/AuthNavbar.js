// react
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Navbar, Nav, Button } from "react-bootstrap";

// css
import "../../assets/css/components/authNavbar.css";

// image
import Icon from "../../assets/images/icon.png";

// components
import LoginModal from "../../components/modal/LoginModal";
import RegisterModal from "../../components/modal/RegisterModal";

export default function AuthNavbar() {
  // useNavigate
  let navigate = useNavigate();
  // useState
  const [showRegister, setshowRegister] = useState(false);
  const [showLogin, setshowLogin] = useState(false);

  const handleShowLogin = () => {
    setshowLogin(true);
    setshowRegister(false);
  };

  const handleShowRegister = () => {
    setshowLogin(false);
    setshowRegister(true);
  };

  const handleClose = () => {
    setshowLogin(false);
    setshowRegister(false);
  };

  return (
    <>
      <Navbar expand="lg" className="authNavbar">
        <Container>
          <Navbar.Brand
            onClick={() => {
              navigate("/");
            }}
          >
            <img src={Icon} alt="React Bootstrap logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Button className="btnLogin" variant="" onClick={handleShowLogin}>
                Login
              </Button>
              <Button
                className="btnRegister"
                variant=""
                onClick={handleShowRegister}
              >
                Register
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* modal */}
      <LoginModal
        showLogin={showLogin}
        handleShowRegister={handleShowRegister}
        handleClose={handleClose}
      />
      <RegisterModal
        showRegister={showRegister}
        handleShowLogin={handleShowLogin}
        handleClose={handleClose}
      />
    </>
  );
}
