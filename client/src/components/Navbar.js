import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Modal, Tab, Card } from "react-bootstrap";
import SignUpForm from "./SignupForm";
import LoginForm from "./LoginForm";

import Auth from "../utils/auth";

const AppNavbar = () => {
  // set modal display state
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            <Card.Img variant="top" src="logo.png" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse id="navbar">
            <Nav className="ml-auto">
              <Nav.Link className="text-light" as={Link} to="/">
                <i className="fa-solid fa-magnifying-glass"></i> Search Books
              </Nav.Link>
              {/* if user is logged in show saved books and logout */}
              {Auth.loggedIn() ? (
                <>
                  <Nav.Link className="text-light" as={Link} to="/saved">
                    <i className="fa-solid fa-book"></i> My Saved Books
                  </Nav.Link>
                  <Nav.Link className="text-light" onClick={Auth.logout}>
                    <i className="fa fa-sign-out"></i> Logout
                  </Nav.Link>
                </>
              ) : (
                <Nav.Link
                  className="text-light"
                  onClick={() => setShowModal(true)}
                >
                  <i className="fa-solid fa-lock"></i> Login / Register
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* set modal data up */}
      <Modal
        size="lg"
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="signup-modal"
      >
        {/* tab container to do either signup or login component */}
        <Tab.Container defaultActiveKey="login">
          <Modal.Header closeButton>
            <Modal.Title id="signup-modal">Login / Register</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Nav fill variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="login">
                  {" "}
                  Login <i className="fa-solid fa-lock"></i>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="signup">
                  {" "}
                  Register <i className="fa-solid fa-user"></i>
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content className="border-left border-right border-bottom p-5 ">
              <Tab.Pane eventKey="login">
                <LoginForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey="signup">
                <SignUpForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

export default AppNavbar;
