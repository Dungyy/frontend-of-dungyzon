import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Navbar,
  Nav,
  NavItem,
  NavLink,
  NavbarBrand,
} from "reactstrap";

const NavbarComponent = ({ isDarkMode, toggleDarkMode }) => {
  const [modal, setModal] = useState(false);

  const toggleModal = () => setModal(!modal);

  return (
    <div>
      <Navbar
        color=""
        light={!isDarkMode}
        dark={isDarkMode}
        expand="md"
        className="mb-5"
        size="xl"
        fixed="top"
      >
        <NavbarBrand style={{ fontSize: "21px" }} href="/">
          DUNGYZON
        </NavbarBrand>
        <Nav className="ml-auto togglebutton" navbar>
          <NavItem>
            <NavLink
              style={{ fontSize: "21px" }}
              href="#"
              onClick={toggleDarkMode}
            >
              {isDarkMode ? "💡 Light Mode" : "🌛 Dark Mode"}
            </NavLink>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink style={{ fontSize: "21px" }} onClick={toggleModal}>
              ABOUT
            </NavLink>
          </NavItem>
        </Nav>
      </Navbar>

      <Modal isOpen={modal} toggle={toggleModal} className={!isDarkMode}>
        <ModalHeader toggle={toggleModal}>What is Dungyzon?</ModalHeader>
        <ModalBody className={!isDarkMode}>
          Dungyzon is your speedy, reliable buddy for Amazon product searches.
          It uses smart web scraping tech to fetch info from all over the
          internet, delivering you precise product details in no time at all.
          With Dungyzon, you get quick, accurate results in a user-friendly
          format. Think of it as your hassle-free, shortcut route to the Amazon
          products you need. Less time searching, more time shopping!
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default NavbarComponent;
