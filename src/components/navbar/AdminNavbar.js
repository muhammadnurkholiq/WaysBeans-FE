// react
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Navbar, Nav, Dropdown } from "react-bootstrap";

// context
import { AuthContext } from "../../context/AuthContext";

// css
import "../../assets/css/components/Navbar.css";

// image
import profile from "../../assets/images/favicon.png";
import Triangle from "../../assets/images/triangle-icon.png";
import Icon from "../../assets/images/icon.png";
import TransactionIcon from "../../assets/images/transaction.png";
import ProductIcon from "../../assets/images/product-icon.png";
import ComplainIcon from "../../assets/images/complain-icon.png";
import LogoutIcon from "../../assets/images/logout-icon.png";

// components
import LogoutModal from "../modal/LogoutModal";

export default function AdminNavbar() {
  // context
  const [state, dispatch] = useContext(AuthContext);
  // navigate
  let navigate = useNavigate();

  // useState
  const [showLogOut, setshowLogOut] = useState(false);

  const handleShow = () => {
    setshowLogOut(true);
  };

  const handleClose = () => {
    setshowLogOut(false);
  };

  // handle logout
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <>
      <Navbar expand="lg" className="Navbar">
        <Container>
          <Navbar.Brand
            onClick={() => {
              navigate("/");
            }}
          >
            <img
              src={Icon}
              className="triangleIcon"
              alt="React Bootstrap logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Dropdown>
                <Dropdown.Toggle variant="">
                  <img src={profile} alt="profile" />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <img src={Triangle} className="triangleIcon" alt="triangle" />
                  <Dropdown.Item
                    onClick={() => {
                      navigate("/transaction");
                    }}
                  >
                    <img src={TransactionIcon} alt="transaction icon" />
                    Transaction
                  </Dropdown.Item>
                  <hr />
                  <Dropdown.Item
                    onClick={() => {
                      navigate("/product");
                    }}
                  >
                    <img src={ProductIcon} alt="profile icon" />
                    Product
                  </Dropdown.Item>
                  <hr />
                  <Dropdown.Item
                    onClick={() => {
                      navigate("/adminComplain");
                    }}
                  >
                    <img src={ComplainIcon} alt="complain icon" />
                    Complain
                  </Dropdown.Item>
                  <hr />
                  <Dropdown.Item onClick={handleShow}>
                    <img src={LogoutIcon} alt="logout icon" />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* modal */}
      <LogoutModal
        showLogOut={showLogOut}
        handleClose={handleClose}
        handleLogout={handleLogout}
      />
    </>
  );
}
