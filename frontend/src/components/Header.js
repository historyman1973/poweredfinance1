import React from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { ReactComponent as Logo } from "../images/logo.svg";

const Header = ({ title }) => {
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Container>
            <Logo
              alt={title}
              style={{ maxWidth: "12rem", maxHeight: "2rem" }}
            />
          </Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#assets">Assets</Nav.Link>
              <Nav.Link href="#liabilities">Liabilities</Nav.Link>
              <Nav.Link href="#support">Support</Nav.Link>
              {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
