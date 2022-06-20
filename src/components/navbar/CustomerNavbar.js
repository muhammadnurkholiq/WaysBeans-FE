// react
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Navbar, Nav, Dropdown, Button } from "react-bootstrap";

// context
import { AuthContext } from "../../context/AuthContext";

// API
import { API } from "../../config/API";

// css
import "../../assets/css/components/Navbar.css";

// image
import Avatar from "../../assets/images/avatar.png";
import Triangle from "../../assets/images/triangle-icon.png";
import CartIcon from "../../assets/images/cart-icon.png";
import Icon from "../../assets/images/icon.png";
import ProfileIcon from "../../assets/images/profile-icon.png";
import ComplainIcon from "../../assets/images/complain-icon.png";
import LogoutIcon from "../../assets/images/logout-icon.png";

// components
import LogoutModal from "../modal/LogoutModal";

export default function CustomerNavbar({ carts, image }) {
  // context
  const [state, dispatch] = useContext(AuthContext);
  // navigate
  let navigate = useNavigate();
  // useState
  const [showLogOut, setshowLogOut] = useState(false);
  const [profile, setProfile] = useState(null);

  // get profile
  const getProfile = async () => {
    try {
      const response = await API.get("/user");

      if (response.data.status === "Success") {
        setProfile(response.data.data.image);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfile();
    setProfile(image);
  });

  // show modal
  const handleShow = () => {
    setshowLogOut(true);
    getProfile();
  };

  // modal modal
  const handleClose = () => {
    setshowLogOut(false);
    getProfile();
  };

  // handle logout
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  console.log(image);
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
              <Button
                onClick={() => {
                  navigate("/cart");
                }}
              >
                {carts?.length < 1 ? (
                  <img src={CartIcon} alt="cart icon" />
                ) : (
                  <>
                    <img src={CartIcon} alt="cart icon" />
                    <div className="cartStock">{carts.length}</div>
                  </>
                )}
              </Button>
              <Dropdown>
                <Dropdown.Toggle variant="">
                  {profile === null ||
                  profile ===
                    "https://res.cloudinary.com/muhammad-nurkholiq/image/upload/v1654676551/null" ? (
                    <img src={Avatar} alt="profile" />
                  ) : (
                    <img src={profile} alt="profile" />
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <img src={Triangle} className="triangleIcon" alt="triangle" />
                  <Dropdown.Item
                    onClick={() => {
                      navigate("/profile");
                    }}
                  >
                    <img src={ProfileIcon} alt="profile icon" />
                    Profile
                  </Dropdown.Item>
                  <hr />
                  <Dropdown.Item
                    onClick={() => {
                      navigate("/customerComplain");
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
